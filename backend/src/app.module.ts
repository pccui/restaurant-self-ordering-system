import { Module } from '@nestjs/common';
import { MenuController } from './modules/menu/menu.controller';
import { SyncController } from './modules/sync/sync.controller';
import { TablesController } from './modules/tables/tables.controller';
import { MenuService } from './modules/menu/menu.service';
import { OrderModule } from './modules/order/order.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AuditModule } from './modules/audit/audit.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [AuthModule, UsersModule, AuditModule, HealthModule, OrderModule],
  controllers: [MenuController, SyncController, TablesController],
  providers: [MenuService],
})
export class AppModule {}
