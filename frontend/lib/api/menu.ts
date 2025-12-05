import { MenuSchema, type Menu } from '@restaurant/shared/src/schemas/menu';
import localforage from 'localforage';

/**
 * Fetch menu from the server API
 * Used when data mode is 'server'
 */
export async function fetchMenuServer(): Promise<Menu> {
  const res = await fetch('/api/menu').then(r => r.json()).catch(()=>[]);
  return MenuSchema.parse(res);
}

/**
 * Fetch menu from local storage or static JSON file
 * Used when data mode is 'local' (default for demo)
 */
export async function fetchMenuLocal(): Promise<Menu> {
  const cached = await localforage.getItem('menu') as Menu | null;
  if (cached) return cached;
  const res = await fetch('/menu.json').then(r => r.json()).catch(()=>[]);
  const parsed = MenuSchema.parse(res);
  await localforage.setItem('menu', parsed);
  return parsed;
}

/**
 * Fetch menu based on current data mode
 * Falls back to local if server fails
 */
export async function fetchMenu(mode: 'local' | 'server' = 'local'): Promise<Menu> {
  if (mode === 'server') {
    return fetchMenuServer().catch(() => fetchMenuLocal());
  }
  return fetchMenuLocal();
}

// Legacy aliases for backward compatibility
export const fetchMenuOffline = fetchMenuLocal;
export const fetchMenuOnline = fetchMenuServer;

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
