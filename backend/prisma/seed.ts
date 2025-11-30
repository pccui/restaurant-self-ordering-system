import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// Role enum values as string literals for Prisma v7+
const Role = {
  ADMIN: 'ADMIN',
  WAITER: 'WAITER',
  KITCHEN: 'KITCHEN',
} as const;

async function main() {
  console.log('🌱 Seeding database...');

  // Create default admin user
  const adminEmail = 'admin@restaurant.local';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        name: 'Administrator',
        role: Role.ADMIN,
      },
    });
    console.log(`✅ Created admin user: ${admin.email}`);
  } else {
    console.log(`ℹ️  Admin user already exists: ${existingAdmin.email}`);
  }

  // Create sample kitchen staff
  const kitchenEmail = 'kitchen@restaurant.local';
  const existingKitchen = await prisma.user.findUnique({
    where: { email: kitchenEmail },
  });

  if (!existingKitchen) {
    const passwordHash = await bcrypt.hash('kitchen123', 10);
    const kitchen = await prisma.user.create({
      data: {
        email: kitchenEmail,
        passwordHash,
        name: 'Kitchen Staff',
        role: Role.KITCHEN,
      },
    });
    console.log(`✅ Created kitchen user: ${kitchen.email}`);
  } else {
    console.log(`ℹ️  Kitchen user already exists: ${existingKitchen.email}`);
  }

  // Create sample waiter
  const waiterEmail = 'waiter@restaurant.local';
  const existingWaiter = await prisma.user.findUnique({
    where: { email: waiterEmail },
  });

  if (!existingWaiter) {
    const passwordHash = await bcrypt.hash('waiter123', 10);
    const waiter = await prisma.user.create({
      data: {
        email: waiterEmail,
        passwordHash,
        name: 'Waiter',
        role: Role.WAITER,
      },
    });
    console.log(`✅ Created waiter user: ${waiter.email}`);
  } else {
    console.log(`ℹ️  Waiter user already exists: ${existingWaiter.email}`);
  }

  console.log('🌱 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
