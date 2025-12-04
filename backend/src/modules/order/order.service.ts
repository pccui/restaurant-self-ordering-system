import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { prisma } from '../../lib/prisma';
import { AuditService } from '../audit/audit.service';

// 5 minutes in milliseconds
const EDIT_WINDOW_MS = 5 * 60 * 1000;

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'completed' | 'paid';

interface SafeUser {
  id: string;
  email: string;
}

@Injectable()
export class OrderService {
  constructor(@Inject(AuditService) private readonly auditService: AuditService) {}

  // Maximum orders to keep in database (for demo mode cleanup)
  private readonly MAX_ORDERS = 50;

  async createOrder(dto: any) {
    const order = await prisma.order.create({
      data: {
        tableId: dto.tableId || 'unknown',
        items: dto.items as any,
        total: dto.total || 0,
        status: 'pending',
        metadata: dto.metadata || {},
      },
    });

    // Audit log: order created (no user context for public endpoint)
    await this.auditService.log({
      action: 'CREATE',
      entityType: 'Order',
      entityId: order.id,
      changes: { after: order as unknown as Record<string, unknown> },
    });

    // Async cleanup: keep only the latest MAX_ORDERS (don't await to avoid slowing response)
    this.cleanupOldOrders().catch(err => console.error('Order cleanup failed:', err));

    return order;
  }

  /**
   * Keep only the latest MAX_ORDERS orders in the database.
   * Deletes oldest orders (hard delete) to save database space in demo mode.
   */
  private async cleanupOldOrders(): Promise<void> {
    const totalCount = await prisma.order.count({
      where: { deletedAt: null },
    });

    if (totalCount <= this.MAX_ORDERS) {
      return; // No cleanup needed
    }

    const ordersToDelete = totalCount - this.MAX_ORDERS;

    // Find the oldest orders to delete
    const oldestOrders = await prisma.order.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'asc' },
      take: ordersToDelete,
      select: { id: true },
    });

    if (oldestOrders.length > 0) {
      await prisma.order.deleteMany({
        where: {
          id: { in: oldestOrders.map(o => o.id) },
        },
      });
      console.log(`Cleaned up ${oldestOrders.length} old orders to maintain limit of ${this.MAX_ORDERS}`);
    }
  }

  async getOrder(id: string) {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    return order;
  }

  async getOrderByTable(tableId: string) {
    // Get the most recent active order for this table (exclude deleted)
    const order = await prisma.order.findFirst({
      where: {
        tableId,
        status: { notIn: ['paid'] },
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!order) return null;

    // Enrich order items with menu data
    const menuItems = await prisma.menuItem.findMany();
    const menuMap = new Map(menuItems.map(m => [m.id, m]));

    const rawItems = order.items as Array<{ menuItemId?: string; id?: string; qty: number; name?: string; priceCents?: number; imageUrl?: string }>;
    const enrichedItems = rawItems.map(item => {
      const itemId = item.menuItemId || item.id;
      const menuItem = itemId ? menuMap.get(itemId) : null;
      const translations = menuItem?.translations as Record<string, { name?: string }> | undefined;
      const name = translations?.en?.name || item.name || `Item ${itemId}`;

      return {
        id: itemId,
        name,
        priceCents: menuItem?.priceCents || item.priceCents || 0,
        qty: item.qty,
        imageUrl: menuItem?.thumbnailUrl || menuItem?.imageUrl || item.imageUrl || undefined,
      };
    });

    return {
      id: order.id,
      tableId: order.tableId,
      items: enrichedItems,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  }

  async updateOrderItems(id: string, items: any[], total: number, user?: SafeUser) {
    const order = await this.getOrder(id);

    // Check if within edit window
    if (!this.isWithinEditWindow(order)) {
      throw new BadRequestException('Order edit window has expired');
    }

    if (order.status !== 'pending') {
      throw new BadRequestException('Cannot modify order after confirmation');
    }

    const before = { items: order.items, total: order.total };
    const updated = await prisma.order.update({
      where: { id },
      data: { items, total },
    });

    // Audit log: order items updated
    await this.auditService.log({
      action: 'UPDATE',
      entityType: 'Order',
      entityId: id,
      user: user ? { id: user.id, email: user.email } : undefined,
      changes: { before, after: { items, total } },
    });

    return updated;
  }

  async updateOrderStatus(id: string, status: OrderStatus, user?: SafeUser) {
    const order = await this.getOrder(id);

    // Validate status transitions
    const validTransitions: Record<string, OrderStatus[]> = {
      pending: ['confirmed'],
      confirmed: ['preparing'],
      preparing: ['completed'],
      completed: ['paid'],
    };

    if (!validTransitions[order.status]?.includes(status)) {
      throw new BadRequestException(
        `Cannot transition from ${order.status} to ${status}`,
      );
    }

    // Set lockedAt when confirming
    const data: any = { status };
    if (status === 'confirmed' && !order.lockedAt) {
      data.lockedAt = new Date();
    }

    const updated = await prisma.order.update({
      where: { id },
      data,
    });

    // Audit log: status changed
    await this.auditService.log({
      action: 'STATUS_CHANGE',
      entityType: 'Order',
      entityId: id,
      user: user ? { id: user.id, email: user.email } : undefined,
      changes: {
        before: { status: order.status },
        after: { status: updated.status },
      },
    });

    return updated;
  }

  async markOrderAsPaid(id: string, user: SafeUser) {
    const order = await this.getOrder(id);

    if (order.status !== 'completed') {
      throw new BadRequestException(
        `Cannot mark order as paid from status ${order.status}`,
      );
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status: 'paid' },
    });

    // Audit log: order paid
    await this.auditService.log({
      action: 'PAY',
      entityType: 'Order',
      entityId: id,
      user: { id: user.id, email: user.email },
      changes: {
        before: { status: order.status },
        after: { status: 'paid' },
      },
    });

    return updated;
  }

  async deleteOrder(id: string, user: SafeUser) {
    const order = await this.getOrder(id);

    // Already deleted
    if (order.deletedAt) {
      throw new BadRequestException('Order already deleted');
    }

    // Cannot delete paid orders
    if (order.status === 'paid') {
      throw new BadRequestException('Cannot delete paid orders');
    }

    const deleted = await prisma.order.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    // Audit log: order deleted
    await this.auditService.log({
      action: 'DELETE',
      entityType: 'Order',
      entityId: id,
      user: { id: user.id, email: user.email },
      changes: { before: order as unknown as Record<string, unknown> },
    });

    return deleted;
  }

  async updateOrder(
    id: string,
    dto: { items?: any[]; total?: number; tableId?: string; status?: OrderStatus },
    user: SafeUser
  ) {
    const order = await this.getOrder(id);
    const before = { ...order } as unknown as Record<string, unknown>;

    const data: any = {};
    if (dto.items !== undefined) data.items = dto.items;
    if (dto.total !== undefined) data.total = dto.total;
    if (dto.tableId !== undefined) data.tableId = dto.tableId;
    if (dto.status !== undefined) data.status = dto.status;

    const updated = await prisma.order.update({
      where: { id },
      data,
    });

    // Audit log: full order update
    await this.auditService.log({
      action: 'UPDATE',
      entityType: 'Order',
      entityId: id,
      user: { id: user.id, email: user.email },
      changes: { before, after: updated as unknown as Record<string, unknown> },
    });

    return updated;
  }

  async confirmOrderIfExpired(id: string) {
    const order = await this.getOrder(id);

    if (order.status !== 'pending') {
      return order;
    }

    if (!this.isWithinEditWindow(order)) {
      return this.updateOrderStatus(id, 'confirmed');
    }

    return order;
  }

  private isWithinEditWindow(order: any): boolean {
    if (!order.createdAt) return true;
    const elapsed = Date.now() - new Date(order.createdAt).getTime();
    return elapsed < EDIT_WINDOW_MS;
  }

  async syncOrders(batch: any[]) {
    const results = [];
    for (const o of batch) {
      // Check if order already exists
      const existing = await prisma.order.findUnique({
        where: { id: o.id },
      });

      if (existing) {
        // Update existing order if still editable
        if (this.isWithinEditWindow(existing) && existing.status === 'pending') {
          const updated = await prisma.order.update({
            where: { id: o.id },
            data: {
              items: o.items as any,
              total: o.total || 0,
            },
          });
          results.push(updated);
        } else {
          results.push(existing);
        }
      } else {
        // Create new order
        const created = await prisma.order.create({
          data: {
            id: o.id,
            tableId: o.tableId || 'unknown',
            items: o.items as any,
            total: o.total || 0,
            status: 'pending',
            metadata: o.metadata || {},
          },
        });

        // Audit log for synced order
        await this.auditService.log({
          action: 'CREATE',
          entityType: 'Order',
          entityId: created.id,
          changes: { after: created as unknown as Record<string, unknown> },
          metadata: { source: 'sync' },
        });

        results.push(created);
      }
    }
    return results;
  }

  // Dashboard: Get all orders with optional filters (exclude deleted)
  // Enriches order items with menu data (name, price, image)
  async getAllOrders(filters?: { status?: string; tableId?: string }) {
    const where: any = {
      deletedAt: null, // Exclude soft-deleted orders
    };

    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.tableId) {
      where.tableId = filters.tableId;
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Get all menu items for enrichment
    const menuItems = await prisma.menuItem.findMany();
    const menuMap = new Map(menuItems.map(m => [m.id, m]));

    // Enrich each order's items with menu data
    const enrichedOrders = orders.map(order => {
      const rawItems = order.items as Array<{ menuItemId?: string; id?: string; qty: number; name?: string; priceCents?: number; imageUrl?: string }>;
      const enrichedItems = rawItems.map(item => {
        // Handle both formats: { menuItemId, qty } and { id, qty, name, priceCents, imageUrl }
        const itemId = item.menuItemId || item.id;
        const menuItem = itemId ? menuMap.get(itemId) : null;

        // Get English name as fallback
        const translations = menuItem?.translations as Record<string, { name?: string }> | undefined;
        const name = translations?.en?.name || item.name || `Item ${itemId}`;

        return {
          id: itemId,
          name,
          priceCents: menuItem?.priceCents || item.priceCents || 0,
          qty: item.qty,
          imageUrl: menuItem?.thumbnailUrl || menuItem?.imageUrl || item.imageUrl || undefined,
        };
      });

      return {
        id: order.id,
        tableId: order.tableId,
        items: enrichedItems,
        total: order.total,
        status: order.status,
        placedAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
      };
    });

    return enrichedOrders;
  }
}
