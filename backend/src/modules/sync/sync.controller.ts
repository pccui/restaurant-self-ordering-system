import { Controller, Post, Body } from '@nestjs/common';
import { OrderService } from '../order/order.service';

@Controller('sync')
export class SyncController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async receive(@Body() batch: any[]) {
    return this.orderService.syncOrders(batch);
  }
}
