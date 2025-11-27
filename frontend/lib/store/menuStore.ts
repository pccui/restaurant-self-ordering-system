import { create } from 'zustand';
import { fetchMenu } from '@/lib/api/menu';
import { useDataMode } from '@/lib/store/useDataMode';
import type { MenuItem } from '@restaurant/shared/src/schemas/menu';

interface MenuState {
  menu: MenuItem[] | null;
  loading: boolean;
  error: string | null;
  loadMenu: () => Promise<void>;
}

export const useMenuStore = create<MenuState>((set) => ({
  menu: null,
  loading: false,
  error: null,

  loadMenu: async () => {
    set({ loading: true, error: null });
    try {
      // Get current data mode from the store
      const mode = useDataMode.getState().mode;
      const menu = await fetchMenu(mode);
      set({ menu, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load menu',
        loading: false
      });
    }
  }
}));
