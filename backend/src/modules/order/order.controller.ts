import { Controller, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('api/online/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() dto: any) {
    return this.orderService.createOrder(dto);
  }
}
