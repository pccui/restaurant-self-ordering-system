import { Controller, Post, Body, Inject } from '@nestjs/common';
import { OrderService } from '../order/order.service';

@Controller('sync')
export class SyncController {
  constructor(
    @Inject(OrderService) private readonly orderService: OrderService
  ) { }

  @Post()
  async receive(@Body() batch: any[]) {
    return this.orderService.syncOrders(batch);
  }
}
