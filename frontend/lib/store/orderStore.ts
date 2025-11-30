import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface OrderItem {
  id: string;
  name: string;
  priceCents: number;
  qty: number;
  imageUrl?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'completed' | 'paid';

export interface PlacedOrder {
  id: string;
  tableId: string;
  items: OrderItem[];
  placedAt: number; // timestamp, 0 = not placed yet
  status: OrderStatus;
  total: number; // in cents
}

// 5 minutes in milliseconds (editable window)
const ORDER_EDIT_WINDOW = 5 * 60 * 1000;

interface OrderState {
  // Table ID from URL
  tableId: string | null;
  // Single active order
  activeOrder: PlacedOrder | null;

  // Table actions
  setTableId: (tableId: string) => void;

  // Item actions
  addItem: (item: OrderItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  totalCents: () => number;

  // Order actions
  placeOrder: () => PlacedOrder | null;
  confirmOrder: () => void;
  updateOrderFromServer: (order: Partial<PlacedOrder>) => void;
  resetOrder: () => void;

  // Helpers
  isWithinEditWindow: () => boolean;
  getEditTimeRemaining: () => number;
  canEditOrder: () => boolean;
  isOrderPlaced: () => boolean;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      tableId: null,
      activeOrder: null,

      setTableId: (tableId) => set({ tableId }),

      addItem: (item) => set((state) => {
        const tableId = state.tableId || 'unknown';

        if (!state.activeOrder) {
          // Create new pending order (not placed yet)
          return {
            activeOrder: {
              id: crypto.randomUUID(),
              tableId,
              items: [item],
              placedAt: 0,
              status: 'pending' as OrderStatus,
              total: item.priceCents * item.qty,
            },
          };
        }

        // Can only add if within edit window or not yet placed
        if (state.activeOrder.placedAt > 0 && !get().isWithinEditWindow()) {
          return state;
        }

        const existing = state.activeOrder.items.find(i => i.id === item.id);
        let newItems: OrderItem[];

        if (existing) {
          newItems = state.activeOrder.items.map(i =>
            i.id === item.id ? { ...i, qty: i.qty + item.qty } : i
          );
        } else {
          newItems = [...state.activeOrder.items, item];
        }

        const newTotal = newItems.reduce((sum, i) => sum + i.priceCents * i.qty, 0);

        return {
          activeOrder: {
            ...state.activeOrder,
            items: newItems,
            total: newTotal,
          },
        };
      }),

      removeItem: (id) => set((state) => {
        if (!state.activeOrder) return state;
        if (state.activeOrder.placedAt > 0 && !get().isWithinEditWindow()) {
          return state;
        }

        const newItems = state.activeOrder.items.filter(i => i.id !== id);

        if (newItems.length === 0) {
          return { activeOrder: null };
        }

        const newTotal = newItems.reduce((sum, i) => sum + i.priceCents * i.qty, 0);

        return {
          activeOrder: {
            ...state.activeOrder,
            items: newItems,
            total: newTotal,
          },
        };
      }),

      updateQty: (id, qty) => set((state) => {
        if (!state.activeOrder) return state;
        if (state.activeOrder.placedAt > 0 && !get().isWithinEditWindow()) {
          return state;
        }

        if (qty <= 0) {
          const newItems = state.activeOrder.items.filter(i => i.id !== id);
          if (newItems.length === 0) {
            return { activeOrder: null };
          }
          const newTotal = newItems.reduce((sum, i) => sum + i.priceCents * i.qty, 0);
          return {
            activeOrder: {
              ...state.activeOrder,
              items: newItems,
              total: newTotal,
            },
          };
        }

        const newItems = state.activeOrder.items.map(i =>
          i.id === id ? { ...i, qty } : i
        );
        const newTotal = newItems.reduce((sum, i) => sum + i.priceCents * i.qty, 0);

        return {
          activeOrder: {
            ...state.activeOrder,
            items: newItems,
            total: newTotal,
          },
        };
      }),

      clearCart: () => set((state) => {
        if (!state.activeOrder) return state;
        if (state.activeOrder.placedAt > 0 && !get().isWithinEditWindow()) {
          return state;
        }
        return { activeOrder: null };
      }),

      totalCents: () => {
        const state = get();
        return state.activeOrder?.total || 0;
      },

      placeOrder: () => {
        const state = get();
        if (!state.activeOrder || state.activeOrder.items.length === 0) return null;
        if (state.activeOrder.placedAt > 0) return state.activeOrder;

        const placedOrder: PlacedOrder = {
          ...state.activeOrder,
          placedAt: Date.now(),
          status: 'pending',
        };

        set({ activeOrder: placedOrder });
        return placedOrder;
      },

      confirmOrder: () => {
        const state = get();
        if (!state.activeOrder) return;
        if (state.activeOrder.status !== 'pending') return;

        set({
          activeOrder: {
            ...state.activeOrder,
            status: 'confirmed',
          },
        });
      },

      updateOrderFromServer: (order) => set((state) => {
        if (!state.activeOrder) return state;
        return {
          activeOrder: {
            ...state.activeOrder,
            ...order,
          },
        };
      }),

      resetOrder: () => set({ activeOrder: null }),

      isWithinEditWindow: () => {
        const state = get();
        if (!state.activeOrder) return false;
        if (state.activeOrder.placedAt === 0) return true;
        return Date.now() - state.activeOrder.placedAt < ORDER_EDIT_WINDOW;
      },

      getEditTimeRemaining: () => {
        const state = get();
        if (!state.activeOrder || state.activeOrder.placedAt === 0) return ORDER_EDIT_WINDOW;
        const elapsed = Date.now() - state.activeOrder.placedAt;
        return Math.max(0, ORDER_EDIT_WINDOW - elapsed);
      },

      canEditOrder: () => {
        const state = get();
        if (!state.activeOrder) return true;
        if (state.activeOrder.placedAt === 0) return true;
        if (state.activeOrder.status !== 'pending') return false;
        return get().isWithinEditWindow();
      },

      isOrderPlaced: () => {
        const state = get();
        return state.activeOrder !== null && state.activeOrder.placedAt > 0;
      },
    }),
    {
      name: 'order-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        tableId: state.tableId,
        activeOrder: state.activeOrder,
      }),
    }
  )
);

// Legacy alias
export const clear = () => useOrderStore.getState().clearCart();
