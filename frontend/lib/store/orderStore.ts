import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface OrderItem {
  id: string;
  name: string;
  priceCents: number;
  qty: number;
  imageUrl?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'completed';

export interface PlacedOrder {
  id: string;
  items: OrderItem[];
  placedAt: number; // timestamp
  status: OrderStatus;
  total: number; // in cents
}

// 10 minutes in milliseconds
const ORDER_LOCK_DURATION = 10 * 60 * 1000;
// Maximum orders to keep in history
const MAX_ORDER_HISTORY = 5;

interface OrderState {
  // Cart: items not yet placed
  items: OrderItem[];
  // Single active order (can only have one at a time)
  activeOrder: PlacedOrder | null;
  // Order history (last 5 completed orders)
  orderHistory: PlacedOrder[];

  // Cart actions
  addItem: (item: OrderItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  totalCents: () => number;

  // Order actions
  placeOrder: () => PlacedOrder | null;
  addToOrder: () => boolean;
  confirmOrder: () => void;
  clearActiveOrder: () => void;
  clearHistory: () => void;

  // Helpers
  isOrderLocked: () => boolean;
  getOrderTimeRemaining: () => number; // milliseconds remaining
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      items: [],
      activeOrder: null,
      orderHistory: [],

      // Cart actions
      addItem: (item) => set((state) => {
        const existing = state.items.find(i => i.id === item.id);
        if (existing) {
          return {
            items: state.items.map(i =>
              i.id === item.id ? { ...i, qty: i.qty + item.qty } : i
            )
          };
        }
        return { items: [...state.items, item] };
      }),

      removeItem: (id) => set((state) => ({
        items: state.items.filter(i => i.id !== id)
      })),

      updateQty: (id, qty) => set((state) => ({
        items: state.items.map(i =>
          i.id === id ? { ...i, qty } : i
        )
      })),

      clearCart: () => set({ items: [] }),

      totalCents: () => {
        const state = get();
        return state.items.reduce((sum, item) => sum + item.priceCents * item.qty, 0);
      },

      // Place a new order (moves cart items to active order)
      placeOrder: () => {
        const state = get();
        if (state.items.length === 0) return null;
        if (state.activeOrder) return null; // Already have an active order

        const newOrder: PlacedOrder = {
          id: crypto.randomUUID(),
          items: [...state.items],
          placedAt: Date.now(),
          status: 'pending',
          total: state.totalCents(),
        };

        set({
          items: [],
          activeOrder: newOrder,
        });

        return newOrder;
      },

      // Add current cart items to existing active order
      addToOrder: () => {
        const state = get();
        if (state.items.length === 0) return false;
        if (!state.activeOrder) return false;

        // Merge items into active order
        const existingItems = [...state.activeOrder.items];

        for (const newItem of state.items) {
          const existingIdx = existingItems.findIndex(i => i.id === newItem.id);
          if (existingIdx >= 0) {
            existingItems[existingIdx] = {
              ...existingItems[existingIdx],
              qty: existingItems[existingIdx].qty + newItem.qty,
            };
          } else {
            existingItems.push({ ...newItem });
          }
        }

        const newTotal = existingItems.reduce((sum, item) => sum + item.priceCents * item.qty, 0);

        set({
          items: [],
          activeOrder: {
            ...state.activeOrder,
            items: existingItems,
            total: newTotal,
          },
        });

        return true;
      },

      // Confirm the active order (manual or auto after 10 min)
      confirmOrder: () => {
        const state = get();
        if (!state.activeOrder) return;

        const confirmedOrder: PlacedOrder = {
          ...state.activeOrder,
          status: 'confirmed',
        };

        // Add to history, keep only last MAX_ORDER_HISTORY
        const newHistory = [confirmedOrder, ...state.orderHistory].slice(0, MAX_ORDER_HISTORY);

        set({
          activeOrder: null,
          orderHistory: newHistory,
        });
      },

      clearActiveOrder: () => set({ activeOrder: null }),

      clearHistory: () => set({ orderHistory: [] }),

      // Check if order is locked (within 10 minute window)
      isOrderLocked: () => {
        const state = get();
        if (!state.activeOrder) return false;
        return Date.now() - state.activeOrder.placedAt < ORDER_LOCK_DURATION;
      },

      // Get remaining time in milliseconds
      getOrderTimeRemaining: () => {
        const state = get();
        if (!state.activeOrder) return 0;
        const elapsed = Date.now() - state.activeOrder.placedAt;
        return Math.max(0, ORDER_LOCK_DURATION - elapsed);
      },
    }),
    {
      name: 'order-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist certain fields
      partialize: (state) => ({
        items: state.items,
        activeOrder: state.activeOrder,
        orderHistory: state.orderHistory,
      }),
    }
  )
);

// Legacy alias for backward compatibility
export const clear = () => useOrderStore.getState().clearCart();
