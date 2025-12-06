
import { Module } from '@nestjs/common';
import { SyncController } from './sync.controller';
import { MenuModule } from '../menu/menu.module';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [MenuModule, OrderModule],
  controllers: [SyncController],
})
export class SyncModule { }
