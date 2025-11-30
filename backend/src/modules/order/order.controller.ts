import { Controller, Post, Get, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';

@Controller('online/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Public endpoints (for customer ordering)
  @Public()
  @Post()
  async createOrder(@Body() dto: any) {
    return this.orderService.createOrder(dto);
  }

  @Public()
  @Get(':id')
  async getOrder(@Param('id') id: string) {
    return this.orderService.getOrder(id);
  }

  @Public()
  @Get('table/:tableId')
  async getOrderByTable(@Param('tableId') tableId: string) {
    return this.orderService.getOrderByTable(tableId);
  }

  @Public()
  @Patch(':id/items')
  async updateOrderItems(
    @Param('id') id: string,
    @Body() dto: { items: any[]; total: number },
  ) {
    return this.orderService.updateOrderItems(id, dto.items, dto.total);
  }

  // Protected: Only KITCHEN and ADMIN can update order status
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('KITCHEN', 'ADMIN')
  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() dto: { status: string },
  ) {
    return this.orderService.updateOrderStatus(id, dto.status as any);
  }

  // Protected: Mark order as paid (WAITER, ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('WAITER', 'ADMIN')
  @Patch(':id/pay')
  async markOrderAsPaid(@Param('id') id: string) {
    return this.orderService.updateOrderStatus(id, 'paid');
  }

  @Public()
  @Post(':id/check-expire')
  async checkAndConfirmExpired(@Param('id') id: string) {
    return this.orderService.confirmOrderIfExpired(id);
  }

  // Dashboard: Get all orders (authenticated staff only)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllOrders(
    @Query('status') status?: string,
    @Query('tableId') tableId?: string,
  ) {
    return this.orderService.getAllOrders({ status, tableId });
  }
}
