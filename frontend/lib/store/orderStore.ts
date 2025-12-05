import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { updateOrderItemsOnServer } from '@/lib/sync/localSync';

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
  // Track if there are unsaved changes
  hasUnsavedChanges: boolean;
  // Track if sync is in progress
  isSyncing: boolean;

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
  confirmOrder: () => Promise<void>;
  updateOrderFromServer: (order: Partial<PlacedOrder>) => void;
  resetOrder: () => void;
  syncOrderChanges: () => Promise<boolean>;

  // Helpers
  isWithinEditWindow: () => boolean;
  getEditTimeRemaining: () => number;
  canRemoveItems: () => boolean; // Can only remove within 5min window + pending status
  canAddItems: () => boolean;    // Can always add items
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
    hasUnsavedChanges: false,
    isSyncing: false,

    setTableId: (tableId) => {
      // Load order for this specific table from localStorage first
      const currentOrder = loadOrderFromStorage(tableId);
      set({ tableId, activeOrder: currentOrder, hasUnsavedChanges: false });
    },

    fetchOrderFromServer: async (tableId) => {
      // Don't fetch if there are unsaved changes
      if (get().hasUnsavedChanges) {
        console.log('Skipping server fetch - unsaved changes exist');
        return;
      }

      try {
        const response = await fetch(`/api/order/table/${tableId}`);
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
        // Silent fail - this is expected when server is unreachable
        // Local state from localStorage is used as fallback
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

      // Adding items is ALWAYS allowed (no time restriction)
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

      // Mark as having unsaved changes if order was already placed
      if (state.activeOrder.placedAt > 0) {
        set({ hasUnsavedChanges: true });
      }
    },

    removeItem: (id) => {
      const state = get();
      if (!state.activeOrder) return;
      // Can only remove within 5-min window AND status is pending
      if (state.activeOrder.placedAt > 0 && !get().canRemoveItems()) {
        return;
      }

      const newItems = state.activeOrder.items.filter(i => i.id !== id);
      const wasPlaced = state.activeOrder.placedAt > 0;

      if (newItems.length === 0) {
        set({ activeOrder: null });
        saveOrderToStorage(state.tableId, null);
        // Note: We don't sync empty orders - the order remains on server
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

      // Mark as having unsaved changes if order was already placed
      if (wasPlaced) {
        set({ hasUnsavedChanges: true });
      }
    },

    updateQty: (id, qty) => {
      const state = get();
      if (!state.activeOrder) return;

      const wasPlaced = state.activeOrder.placedAt > 0;
      const currentItem = state.activeOrder.items.find(i => i.id === id);
      if (!currentItem) return;

      const isDecreasing = qty < currentItem.qty;

      // Decreasing quantity or removing follows the same rules as removeItem
      if (isDecreasing && wasPlaced && !get().canRemoveItems()) {
        return;
      }

      if (qty <= 0) {
        // This is a removal - already checked canRemoveItems above
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
        if (wasPlaced) {
          set({ hasUnsavedChanges: true });
        }
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

      // Mark as having unsaved changes if order was already placed
      if (wasPlaced) {
        set({ hasUnsavedChanges: true });
      }
    },

    clearCart: () => {
      const state = get();
      if (!state.activeOrder) return;
      // Clearing cart is like removing all items - only within edit window
      if (state.activeOrder.placedAt > 0 && !get().canRemoveItems()) {
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

    confirmOrder: async () => {
      const state = get();
      if (!state.activeOrder) return;
      if (state.activeOrder.status !== 'pending') return;

      const confirmedOrder: PlacedOrder = {
        ...state.activeOrder,
        status: 'confirmed',
      };

      // Update local state immediately
      set({ activeOrder: confirmedOrder });
      saveOrderToStorage(state.tableId, confirmedOrder);

      // Sync to server
      try {
        await fetch(`/api/order/${state.activeOrder.id}/confirm`, {
          method: 'POST',
        });
      } catch (error) {
        console.error('Failed to confirm order on server:', error);
      }
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
      set({ activeOrder: null, hasUnsavedChanges: false });
      saveOrderToStorage(state.tableId, null);
    },

    syncOrderChanges: async () => {
      const state = get();
      if (!state.activeOrder || !state.hasUnsavedChanges) return true;
      if (state.activeOrder.placedAt === 0) return true; // Not yet placed

      set({ isSyncing: true });
      try {
        const items = state.activeOrder.items.map(i => ({ menuItemId: i.id, qty: i.qty }));
        const success = await updateOrderItemsOnServer(
          state.activeOrder.id,
          items,
          state.activeOrder.total
        );
        if (success) {
          set({ hasUnsavedChanges: false });
        }
        return success;
      } catch (error) {
        console.error('Failed to sync order changes:', error);
        return false;
      } finally {
        set({ isSyncing: false });
      }
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

    // Can remove items only within 5-min window AND status is pending
    canRemoveItems: () => {
      const state = get();
      if (!state.activeOrder) return true;
      if (state.activeOrder.placedAt === 0) return true; // Not placed yet
      if (state.activeOrder.status !== 'pending') return false;
      return get().isWithinEditWindow();
    },

    // Can always add items to an order
    canAddItems: () => {
      return true;
    },

    isOrderPlaced: () => {
      const state = get();
      return state.activeOrder !== null && state.activeOrder.placedAt > 0;
    },
  }))
);

// Legacy alias
export const clear = () => useOrderStore.getState().clearCart();