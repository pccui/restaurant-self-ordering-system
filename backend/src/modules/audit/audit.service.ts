import { Injectable } from '@nestjs/common';
import { prisma } from '../../lib/prisma';

type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE' | 'PAY';
type EntityType = 'Order' | 'User' | 'MenuItem';

export interface AuditLogParams {
  action: AuditAction;
  entityType: EntityType;
  entityId: string;
  user?: { id: string; email: string };
  changes?: {
    before?: Record<string, unknown>;
    after?: Record<string, unknown>;
  };
  metadata?: Record<string, unknown>;
}

@Injectable()
export class AuditService {
  /**
   * Log an audit entry. Failures are logged but don't throw to avoid
   * blocking business operations.
   */
  async log(params: AuditLogParams): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          action: params.action,
          entityType: params.entityType,
          entityId: params.entityId,
          userId: params.user?.id ?? null,
          userEmail: params.user?.email ?? null,
          changes: params.changes as object ?? null,
          metadata: params.metadata as object ?? null,
        },
      });
    } catch (error) {
      // Log error but don't throw - audit failure shouldn't break business flow
      console.error('Audit log failed:', error);
    }
  }

  /**
   * Get all audit logs for a specific entity
   */
  async getLogsForEntity(entityType: string, entityId: string) {
    return prisma.auditLog.findMany({
      where: { entityType, entityId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get all audit logs by a specific user
   */
  async getLogsByUser(userId: string) {
    return prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get all audit logs with optional filters
   */
  async getAllLogs(filters?: { entityType?: string; action?: string; limit?: number }) {
    return prisma.auditLog.findMany({
      where: {
        ...(filters?.entityType && { entityType: filters.entityType }),
        ...(filters?.action && { action: filters.action }),
      },
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 100,
    });
  }
}
