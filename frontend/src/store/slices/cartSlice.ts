import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  comparePrice?: number;
  image: string;
  slug: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  subtotal: number;
  loading: boolean;
}

const saveCart = (items: CartItem[]) => {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem('kirana_cart', JSON.stringify(items)); } catch {}
};

const calcSubtotal = (items: CartItem[]) =>
  items.reduce((s, i) => s + i.price * i.quantity, 0);

// Always start empty on server — prevents SSR hydration mismatch.
// Rehydrated from localStorage on the client via rehydrateCart action.
const initialState: CartState = {
  items: [],
  subtotal: 0,
  loading: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.subtotal = calcSubtotal(state.items);
      saveCart(state.items);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items    = state.items.filter(i => i.id !== action.payload);
      state.subtotal = calcSubtotal(state.items);
      saveCart(state.items);
    },
    updateQty: (state, action: PayloadAction<{ id: string; qty: number }>) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) {
        item.quantity  = Math.max(1, action.payload.qty);
        state.subtotal = calcSubtotal(state.items);
        saveCart(state.items);
      }
    },
    clearCart: (state) => {
      state.items    = [];
      state.subtotal = 0;
      saveCart([]);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    // Legacy compat
    setCart: (state, action: PayloadAction<{ items: CartItem[]; subtotal: number }>) => {
      state.items    = action.payload.items;
      state.subtotal = action.payload.subtotal;
    },
    // Called client-side after mount to restore from localStorage
    rehydrateCart: (state) => {
      if (typeof window === 'undefined') return;
      try {
        const stored = localStorage.getItem('kirana_cart');
        if (stored) {
          const items: CartItem[] = JSON.parse(stored);
          state.items    = items;
          state.subtotal = calcSubtotal(items);
        }
      } catch {}
    },
  },
});

export const {
  addItem, removeItem, updateQty,
  clearCart, setLoading, setCart, rehydrateCart,
} = cartSlice.actions;
export default cartSlice.reducer;
