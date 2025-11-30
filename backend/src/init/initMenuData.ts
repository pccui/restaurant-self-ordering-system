import { prisma } from '../lib/prisma';
import { readFileSync } from 'fs';
import path from 'path';

async function main() {
  const menuPath = path.resolve(process.cwd(), '../frontend/public/menu.json');
  let data: any[] = [];
  try {
    data = JSON.parse(readFileSync(menuPath, 'utf-8'));
  } catch (err) {
    console.error('Failed to read menu.json:', err);
    process.exit(1);
  }
  for (const item of data) {
    await prisma.menuItem.upsert({
      where: { id: item.id },
      update: { translations: item.translations, category: item.category, priceCents: item.priceCents, tastes: item.tastes || null, ingredients: item.ingredients || null, thumbnailUrl: item.thumbnailUrl || null, imageUrl: item.imageUrl || null, videoUrl: item.videoUrl || null, featured: item.featured || false },
      create: { id: item.id, translations: item.translations, category: item.category, priceCents: item.priceCents, tastes: item.tastes || null, ingredients: item.ingredients || null, thumbnailUrl: item.thumbnailUrl || null, imageUrl: item.imageUrl || null, videoUrl: item.videoUrl || null, featured: item.featured || false }
    });
    console.log('Upserted', item.id);
  }
  await prisma.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
