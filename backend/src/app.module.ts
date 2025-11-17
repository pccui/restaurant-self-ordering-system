import { Module } from '@nestjs/common';
import { MenuController } from './modules/menu/menu.controller';
import { OrderController } from './modules/order/order.controller';
import { SyncController } from './modules/sync/sync.controller';
import { MenuService } from './modules/menu/menu.service';
import { OrderService } from './modules/order/order.service';

@Module({
  imports: [],
  controllers: [MenuController, OrderController, SyncController],
  providers: [MenuService, OrderService],
})
export class AppModule {}
