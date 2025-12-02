import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

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
  fetchOrderFromServer: (tableId: string) => Promise<void>;

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

// Helper to get table-specific storage key
const getStorageKey = (tableId: string) => `order-storage-${tableId}`;

// Helper to save order to table-specific storage
const saveOrderToStorage = (tableId: string | null, order: PlacedOrder | null) => {
  if (typeof window === 'undefined' || !tableId) return;
  const key = getStorageKey(tableId);
  if (order) {
    localStorage.setItem(key, JSON.stringify(order));
  } else {
    localStorage.removeItem(key);
  }
};

// Helper to load order from table-specific storage
const loadOrderFromStorage = (tableId: string): PlacedOrder | null => {
  if (typeof window === 'undefined') return null;
  const key = getStorageKey(tableId);
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
};

export const useOrderStore = create<OrderState>()(
  subscribeWithSelector((set, get) => ({
    tableId: null,
    activeOrder: null,

    setTableId: (tableId) => {
      // Load order for this specific table from localStorage first
      const currentOrder = loadOrderFromStorage(tableId);
      set({ tableId, activeOrder: currentOrder });
    },

    fetchOrderFromServer: async (tableId) => {
      try {
        const response = await fetch(`/api/online/order/table/${tableId}`);
        if (!response.ok) {
          if (response.status === 404) {
            // No active order for this table on server
            return;
          }
          throw new Error('Failed to fetch order');
        }

        const serverOrder = await response.json();
        if (serverOrder && serverOrder.status !== 'paid') {
          // Convert server order format to local format
          const localOrder: PlacedOrder = {
            id: serverOrder.id,
            tableId: serverOrder.tableId,
            items: serverOrder.items || [],
            placedAt: serverOrder.createdAt ? new Date(serverOrder.createdAt).getTime() : Date.now(),
            status: serverOrder.status,
            total: serverOrder.total || 0,
          };

          set({ activeOrder: localOrder });
          saveOrderToStorage(tableId, localOrder);
        }
      } catch (error) {
        console.warn('Failed to fetch order from server:', error);
      }
    },

    addItem: (item) => {
      const state = get();
      const tableId = state.tableId || 'unknown';

      if (!state.activeOrder) {
        // Create new pending order (not placed yet)
        const newOrder: PlacedOrder = {
          id: crypto.randomUUID(),
          tableId,
          items: [item],
          placedAt: 0,
          status: 'pending' as OrderStatus,
          total: item.priceCents * item.qty,
        };
        set({ activeOrder: newOrder });
        saveOrderToStorage(tableId, newOrder);
        return;
      }

      // Can only add if within edit window or not yet placed
      if (state.activeOrder.placedAt > 0 && !get().isWithinEditWindow()) {
        return;
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
      const newOrder: PlacedOrder = {
        ...state.activeOrder,
        items: newItems,
        total: newTotal,
      };

      set({ activeOrder: newOrder });
      saveOrderToStorage(state.tableId, newOrder);
    },

    removeItem: (id) => {
      const state = get();
      if (!state.activeOrder) return;
      if (state.activeOrder.placedAt > 0 && !get().isWithinEditWindow()) {
        return;
      }

      const newItems = state.activeOrder.items.filter(i => i.id !== id);

      if (newItems.length === 0) {
        set({ activeOrder: null });
        saveOrderToStorage(state.tableId, null);
        return;
      }

      const newTotal = newItems.reduce((sum, i) => sum + i.priceCents * i.qty, 0);
      const newOrder: PlacedOrder = {
        ...state.activeOrder,
        items: newItems,
        total: newTotal,
      };

      set({ activeOrder: newOrder });
      saveOrderToStorage(state.tableId, newOrder);
    },

    updateQty: (id, qty) => {
      const state = get();
      if (!state.activeOrder) return;
      if (state.activeOrder.placedAt > 0 && !get().isWithinEditWindow()) {
        return;
      }

      if (qty <= 0) {
        const newItems = state.activeOrder.items.filter(i => i.id !== id);
        if (newItems.length === 0) {
          set({ activeOrder: null });
          saveOrderToStorage(state.tableId, null);
          return;
        }
        const newTotal = newItems.reduce((sum, i) => sum + i.priceCents * i.qty, 0);
        const newOrder: PlacedOrder = {
          ...state.activeOrder,
          items: newItems,
          total: newTotal,
        };
        set({ activeOrder: newOrder });
        saveOrderToStorage(state.tableId, newOrder);
        return;
      }

      const newItems = state.activeOrder.items.map(i =>
        i.id === id ? { ...i, qty } : i
      );
      const newTotal = newItems.reduce((sum, i) => sum + i.priceCents * i.qty, 0);
      const newOrder: PlacedOrder = {
        ...state.activeOrder,
        items: newItems,
        total: newTotal,
      };

      set({ activeOrder: newOrder });
      saveOrderToStorage(state.tableId, newOrder);
    },

    clearCart: () => {
      const state = get();
      if (!state.activeOrder) return;
      if (state.activeOrder.placedAt > 0 && !get().isWithinEditWindow()) {
        return;
      }
      set({ activeOrder: null });
      saveOrderToStorage(state.tableId, null);
    },

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
      saveOrderToStorage(state.tableId, placedOrder);
      return placedOrder;
    },

    confirmOrder: () => {
      const state = get();
      if (!state.activeOrder) return;
      if (state.activeOrder.status !== 'pending') return;

      const confirmedOrder: PlacedOrder = {
        ...state.activeOrder,
        status: 'confirmed',
      };

      set({ activeOrder: confirmedOrder });
      saveOrderToStorage(state.tableId, confirmedOrder);
    },

    updateOrderFromServer: (order) => {
      const state = get();
      if (!state.activeOrder) return;

      const updatedOrder: PlacedOrder = {
        ...state.activeOrder,
        ...order,
      };

      set({ activeOrder: updatedOrder });
      saveOrderToStorage(state.tableId, updatedOrder);
    },

    resetOrder: () => {
      const state = get();
      set({ activeOrder: null });
      saveOrderToStorage(state.tableId, null);
    },

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
  }))
);

// Legacy alias
export const clear = () => useOrderStore.getState().clearCart();
