import { SetMetadata } from '@nestjs/common';

// Role type for Prisma v7+
export type Role = 'ADMIN' | 'WAITER' | 'KITCHEN';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
