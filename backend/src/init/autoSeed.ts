import { prisma } from '../lib/prisma';
import * as bcrypt from 'bcrypt';

// Menu data embedded for production use (no file system dependency)
const MENU_DATA = [
  { id: '1', category: 'sichuan', priceCents: 2800, translations: { zh: { name: '麻婆豆腐' }, en: { name: 'Mapo Tofu' }, de: { name: 'Mapo Tofu' } } },
  { id: '2', category: 'sichuan', priceCents: 8800, translations: { zh: { name: '水煮鱼' }, en: { name: 'Water Boiled Fish' }, de: { name: 'Wassergekochter Fisch' } } },
  { id: '3', category: 'sichuan', priceCents: 4200, translations: { zh: { name: '回锅肉' }, en: { name: 'Twice-Cooked Pork' }, de: { name: 'Zweimal gekochtes Schweinefleisch' } } },
  { id: '4', category: 'sichuan', priceCents: 3800, translations: { zh: { name: '鱼香肉丝' }, en: { name: 'Yu Xiang Rou Si' }, de: { name: 'Yu Xiang Rou Si' } } },
  { id: '5', category: 'sichuan', priceCents: 3200, translations: { zh: { name: '宫保鸡丁' }, en: { name: 'Kung Pao Chicken' }, de: { name: 'Kung Pao Huhn' } } },
  { id: '6', category: 'sichuan', priceCents: 2600, translations: { zh: { name: '干煸四季豆' }, en: { name: 'Dry-Fried Green Beans' }, de: { name: 'Trocken gebratene grüne Bohnen' } } },
  { id: '7', category: 'sichuan', priceCents: 4500, translations: { zh: { name: '辣子鸡' }, en: { name: 'Spicy Diced Chicken' }, de: { name: 'Scharfes Hühnchen' } } },
  { id: '8', category: 'sichuan', priceCents: 3600, translations: { zh: { name: '蒜泥白肉' }, en: { name: 'Garlic White Pork' }, de: { name: 'Knoblauch Weißes Schweinefleisch' } } },
  { id: '9', category: 'sichuan', priceCents: 2400, translations: { zh: { name: '酸辣土豆丝' }, en: { name: 'Sour and Spicy Potato' }, de: { name: 'Saure und scharfe Kartoffel' } } },
  { id: '10', category: 'sichuan', priceCents: 5200, translations: { zh: { name: '毛血旺' }, en: { name: 'Mao Xue Wang' }, de: { name: 'Mao Xue Wang' } } },
  { id: '11', category: 'xian', priceCents: 1800, translations: { zh: { name: '肉夹馍' }, en: { name: 'Rou Jia Mo' }, de: { name: 'Rou Jia Mo' } } },
  { id: '12', category: 'xian', priceCents: 1600, translations: { zh: { name: '凉皮' }, en: { name: 'Liang Pi' }, de: { name: 'Liang Pi' } } },
  { id: '13', category: 'xian', priceCents: 2200, translations: { zh: { name: '羊肉泡馍' }, en: { name: 'Lamb Pao Mo' }, de: { name: 'Lamm Pao Mo' } } },
  { id: '14', category: 'xian', priceCents: 1400, translations: { zh: { name: '油泼面' }, en: { name: 'You Po Mian' }, de: { name: 'You Po Mian' } } },
  { id: '15', category: 'xian', priceCents: 1200, translations: { zh: { name: 'Biang Biang 面' }, en: { name: 'Biang Biang Noodles' }, de: { name: 'Biang Biang Nudeln' } } },
];

const DEFAULT_USERS = [
  { email: 'admin@restaurant.local', password: 'admin123', name: 'Administrator', role: 'ADMIN' as const },
  { email: 'kitchen@restaurant.local', password: 'kitchen123', name: 'Kitchen Staff', role: 'KITCHEN' as const },
  { email: 'waiter@restaurant.local', password: 'waiter123', name: 'Waiter', role: 'WAITER' as const },
];

/**
 * Auto-seed database on startup if data is missing
 * This ensures the demo app works even if manual seeding wasn't run
 */
export async function autoSeedIfEmpty(): Promise<void> {
  try {
    // Check if menu items exist
    const menuCount = await prisma.menuItem.count();
    if (menuCount === 0) {
      console.log('📦 No menu items found, auto-seeding...');
      for (const item of MENU_DATA) {
        await prisma.menuItem.create({
          data: {
            id: item.id,
            category: item.category,
            priceCents: item.priceCents,
            translations: item.translations,
          },
        });
      }
      console.log(`✅ Seeded ${MENU_DATA.length} menu items`);
    } else {
      console.log(`ℹ️  Menu already has ${menuCount} items`);
    }

    // Check if users exist
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      console.log('👤 No users found, creating default users...');
      for (const user of DEFAULT_USERS) {
        const passwordHash = await bcrypt.hash(user.password, 10);
        await prisma.user.create({
          data: {
            email: user.email,
            passwordHash,
            name: user.name,
            role: user.role,
          },
        });
        console.log(`✅ Created user: ${user.email}`);
      }
    } else {
      console.log(`ℹ️  Users already exist (${userCount} users)`);
    }
  } catch (error) {
    console.error('⚠️  Auto-seed failed (non-fatal):', error);
    // Don't exit - the app can still run, just without seed data
  }
}
