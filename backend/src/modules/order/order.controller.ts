import { Controller, Post, Get, Patch, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

interface SafeUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

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
    @CurrentUser() user: SafeUser,
  ) {
    return this.orderService.updateOrderStatus(id, dto.status as any, user);
  }

  // Protected: Mark order as paid (WAITER, ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('WAITER', 'ADMIN')
  @Patch(':id/pay')
  async markOrderAsPaid(
    @Param('id') id: string,
    @CurrentUser() user: SafeUser,
  ) {
    return this.orderService.markOrderAsPaid(id, user);
  }

  // Protected: Full order update (ADMIN only)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put(':id')
  async updateOrder(
    @Param('id') id: string,
    @Body() dto: { items?: any[]; total?: number; tableId?: string; status?: string },
    @CurrentUser() user: SafeUser,
  ) {
    return this.orderService.updateOrder(id, dto as any, user);
  }

  // Protected: Delete order (ADMIN only) - Soft delete
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async deleteOrder(
    @Param('id') id: string,
    @CurrentUser() user: SafeUser,
  ) {
    return this.orderService.deleteOrder(id, user);
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
