import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Role = 'ADMIN' | 'WAITER' | 'KITCHEN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  _hasHydrated: boolean;

  // Actions
  setUser: (user: User | null, accessToken?: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  setHasHydrated: (state: boolean) => void;

  // Role checks
  isAdmin: () => boolean;
  isWaiter: () => boolean;
  isKitchen: () => boolean;
  hasRole: (roles: Role[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true,
      _hasHydrated: false,

      setUser: (user, accessToken) => set({
        user,
        // Only update token if provided (preserves existing token on partial updates if any)
        // For login, both are provided.
        ...(accessToken !== undefined && { accessToken }),
        isAuthenticated: !!user,
        isLoading: false,
      }),

      setLoading: (loading) => set({ isLoading: loading }),

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      logout: () => {
        // Clear persisted state from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
        }
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      // Role checks
      isAdmin: () => get().user?.role === 'ADMIN',
      isWaiter: () => get().user?.role === 'WAITER',
      isKitchen: () => get().user?.role === 'KITCHEN',
      hasRole: (roles) => {
        const userRole = get().user?.role;
        return userRole ? roles.includes(userRole) : false;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist user data and token, not loading state
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
