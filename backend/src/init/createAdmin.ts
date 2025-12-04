/**
 * Create initial admin user for production deployment
 *
 * Usage:
 *   DATABASE_URL="your-supabase-url" npx tsx src/init/createAdmin.ts
 *
 * Or set environment variables and run:
 *   npx tsx src/init/createAdmin.ts
 */

import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma';
import { Role } from '../generated/prisma/enums';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@restaurant.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123!';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Administrator';

async function createAdmin() {
  console.log('Creating admin user...');
  console.log(`Email: ${ADMIN_EMAIL}`);

  // Check if admin already exists
  const existing = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  if (existing) {
    console.log('Admin user already exists. Skipping creation.');
    return;
  }

  // Hash password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, saltRounds);

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: ADMIN_EMAIL,
      passwordHash,
      name: ADMIN_NAME,
      role: Role.ADMIN,
    },
  });

  console.log(`✅ Admin user created successfully!`);
  console.log(`   ID: ${admin.id}`);
  console.log(`   Email: ${admin.email}`);
  console.log(`   Role: ${admin.role}`);
  console.log('\n⚠️  Remember to change the default password in production!');
}

createAdmin()
  .catch((error) => {
    console.error('Failed to create admin user:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
