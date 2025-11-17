import { MenuSchema, type Menu } from '@restaurant/shared/src/schemas/menu';
import localforage from 'localforage';

export async function fetchMenuOnline(): Promise<Menu> {
  const res = await fetch('/api/online/menu').then(r => r.json()).catch(()=>[]);
  return MenuSchema.parse(res);
}

export async function fetchMenuOffline(): Promise<Menu> {
  const cached = await localforage.getItem('menu') as Menu | null;
  if (cached) return cached;
  const res = await fetch('/menu.json').then(r => r.json()).catch(()=>[]);
  const parsed = MenuSchema.parse(res);
  await localforage.setItem('menu', parsed);
  return parsed;
}

export async function fetchMenu(): Promise<Menu> {
  return await fetchMenuOffline().catch(async () => {
    return fetchMenuOnline();
  });
}

export async function fetchMenuItem(id: string) {
  const menu = await fetchMenu();
  return menu.find(m => m.id === id);
}

// New helper: returns localized view of menu items for given locale
export function localizeMenu(menu: Menu, locale: string) {
  return menu.map(item => {
    const translations = item.translations as Record<string, { name?: string; shortDescription?: string; detailedDescription?: string }>;
    const t = translations[locale] || translations['en'];
    return {
      ...item,
      localizedName: t?.name || '',
      localizedShort: t?.shortDescription || '',
      localizedDetailed: t?.detailedDescription || '',
      tastesLocalized: (item.tastes || []).map((x: Record<string, string>) => x[locale] || x.en),
      ingredientsLocalized: (item.ingredients || []).map((x: Record<string, string>) => x[locale] || x.en)
    }
  });
}
