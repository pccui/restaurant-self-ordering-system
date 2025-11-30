import { Module } from '@nestjs/common';
import { MenuController } from './modules/menu/menu.controller';
import { OrderController } from './modules/order/order.controller';
import { SyncController } from './modules/sync/sync.controller';
import { TablesController } from './modules/tables/tables.controller';
import { MenuService } from './modules/menu/menu.service';
import { OrderService } from './modules/order/order.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [MenuController, OrderController, SyncController, TablesController],
  providers: [MenuService, OrderService],
})
export class AppModule {}
