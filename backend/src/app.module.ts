import { Module } from '@nestjs/common';
import { MenuModule } from './modules/menu/menu.module';
import { SyncModule } from './modules/sync/sync.module';
import { TablesModule } from './modules/tables/tables.module';
import { OrderModule } from './modules/order/order.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AuditModule } from './modules/audit/audit.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    AuditModule,
    HealthModule,
    OrderModule,
    MenuModule,
    SyncModule,
    TablesModule,
  ],
})
export class AppModule { }
