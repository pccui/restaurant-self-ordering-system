import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL!;

// Create a native PG pool
const pool = new pg.Pool({
  connectionString,
});

// Create the Prisma adapter (required for Prisma 7)
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

export type { User, MenuItem, Order, AuditLog } from '../generated/prisma/client';
