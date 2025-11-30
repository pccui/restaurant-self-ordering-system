import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 5 minutes in milliseconds
const EDIT_WINDOW_MS = 5 * 60 * 1000;

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'completed' | 'paid';

@Injectable()
export class OrderService {
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
    return order;
  }

  async getOrder(id: string) {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    return order;
  }

  async getOrderByTable(tableId: string) {
    // Get the most recent active order for this table
    const order = await prisma.order.findFirst({
      where: {
        tableId,
        status: { notIn: ['paid'] },
      },
      orderBy: { createdAt: 'desc' },
    });
    return order;
  }

  async updateOrderItems(id: string, items: any[], total: number) {
    const order = await this.getOrder(id);

    // Check if within edit window
    if (!this.isWithinEditWindow(order)) {
      throw new BadRequestException('Order edit window has expired');
    }

    if (order.status !== 'pending') {
      throw new BadRequestException('Cannot modify order after confirmation');
    }

    return prisma.order.update({
      where: { id },
      data: { items, total },
    });
  }

  async updateOrderStatus(id: string, status: OrderStatus) {
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

    return prisma.order.update({
      where: { id },
      data,
    });
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
        results.push(created);
      }
    }
    return results;
  }
}
