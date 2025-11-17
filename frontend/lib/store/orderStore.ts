import { create } from 'zustand';

export interface OrderItem {
  id: string;
  name: string;
  priceCents: number;
  qty: number;
}

interface OrderState {
  items: OrderItem[];
  addItem: (item: OrderItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  totalCents: () => number;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  items: [],

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

  clear: () => set({ items: [] }),

  totalCents: () => {
    const state = get();
    return state.items.reduce((sum, item) => sum + item.priceCents * item.qty, 0);
  }
}));
