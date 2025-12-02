import { create } from 'zustand';
import { fetchMenu } from '@/lib/api/menu';
import type { MenuItem } from '@restaurant/shared/src/schemas/menu';
import type { DataMode } from '@/lib/hooks/useRouteMode';

interface MenuState {
  menu: MenuItem[] | null;
  loading: boolean;
  error: string | null;
  currentMode: DataMode;
  loadMenu: (mode?: DataMode) => Promise<void>;
}

export const useMenuStore = create<MenuState>((set, get) => ({
  menu: null,
  loading: false,
  error: null,
  currentMode: 'server',

  loadMenu: async (mode?: DataMode) => {
    // Use provided mode or keep current
    const targetMode = mode ?? get().currentMode;

    set({ loading: true, error: null, currentMode: targetMode });
    try {
      const menu = await fetchMenu(targetMode);
      set({ menu, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load menu',
        loading: false
      });
    }
  }
}));
