import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

@Injectable()
export class OrderService {
  async createOrder(dto: any) {
    const order = await prisma.order.create({
      data: {
        tableId: dto.tableId || 'unknown',
        items: dto.items as any,
        status: 'pending',
        metadata: dto.metadata || {}
      }
    });
    return order;
  }

  async syncOrders(batch: any[]) {
    const created = [];
    for (const o of batch) {
      const c = await prisma.order.create({
        data: {
          tableId: o.tableId || 'unknown',
          items: o.items as any,
          status: 'pending',
          metadata: o.metadata || {}
        }
      });
      created.push(c);
    }
    return created;
  }
}
