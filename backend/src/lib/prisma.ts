import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import pg from 'pg';
import dns from 'dns';
import { URL } from 'url';

// Force IPv4 resolution for database connection
// This fixes "connect ENETUNREACH" errors when localhost resolves to ::1 but DB is IPv4 only
const getDatabaseUrl = async () => {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error('DATABASE_URL is not defined');

  try {
    const url = new URL(dbUrl);
    const hostname = url.hostname;

    // Skip if it's already an IP address
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
      return dbUrl;
    }

    // Resolve to IPv4
    const addresses = await dns.promises.resolve4(hostname);
    if (addresses.length > 0) {
      url.hostname = addresses[0];
      return url.toString();
    }
  } catch (error) {
    console.warn('Failed to resolve database hostname to IPv4, using original URL:', error);
  }

  return dbUrl;
};

const connectionString = process.env.DATABASE_URL!;

// Create a pool that we can configure
// Force IPv4 by resolving hostname before connection
const pool = new pg.Pool({
  connectionString,
});

let resolvedConnectionString = connectionString;

try {
  const url = new URL(connectionString);
  if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(url.hostname)) {
    const addresses = await dns.promises.resolve4(url.hostname);
    if (addresses.length > 0) {
      url.hostname = addresses[0];
      resolvedConnectionString = url.toString();
      console.log(`Resolved database host to IPv4: ${addresses[0]}`);
    }
  }
} catch (e) {
  console.warn('DNS resolution failed, using original connection string', e);
}

const poolConfig = new pg.Pool({ connectionString: resolvedConnectionString });
const adapter = new PrismaPg(poolConfig);

export const prisma = new PrismaClient({ adapter });

export type { User, MenuItem, Order } from '../generated/prisma/client';
