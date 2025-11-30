import { Controller, Post, Get, Patch, Body, Param, Query } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('api/online/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() dto: any) {
    return this.orderService.createOrder(dto);
  }

  @Get(':id')
  async getOrder(@Param('id') id: string) {
    return this.orderService.getOrder(id);
  }

  @Get('table/:tableId')
  async getOrderByTable(@Param('tableId') tableId: string) {
    return this.orderService.getOrderByTable(tableId);
  }

  @Patch(':id/items')
  async updateOrderItems(
    @Param('id') id: string,
    @Body() dto: { items: any[]; total: number },
  ) {
    return this.orderService.updateOrderItems(id, dto.items, dto.total);
  }

  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() dto: { status: string },
  ) {
    return this.orderService.updateOrderStatus(id, dto.status as any);
  }

  @Post(':id/check-expire')
  async checkAndConfirmExpired(@Param('id') id: string) {
    return this.orderService.confirmOrderIfExpired(id);
  }
}
