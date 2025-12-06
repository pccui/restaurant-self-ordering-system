import { Module, Global } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { RolesGuard } from '../../common/guards/roles.guard';

@Global()
@Module({
  controllers: [AuditController],
  providers: [AuditService, RolesGuard],
  exports: [AuditService, RolesGuard],
})
export class AuditModule { }
