import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

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

const loadCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem('kirana_cart') || '[]'); } catch { return []; }
};

const saveCart = (items: CartItem[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('kirana_cart', JSON.stringify(items));
};

const calcSubtotal = (items: CartItem[]) =>
  items.reduce((s, i) => s + i.price * i.quantity, 0);

const initialItems = loadCart();

const initialState: CartState = {
  items: initialItems,
  subtotal: calcSubtotal(initialItems),
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
      state.items = state.items.filter(i => i.id !== action.payload);
      state.subtotal = calcSubtotal(state.items);
      saveCart(state.items);
    },
    updateQty: (state, action: PayloadAction<{ id: string; qty: number }>) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(1, action.payload.qty);
        state.subtotal = calcSubtotal(state.items);
        saveCart(state.items);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      saveCart([]);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    // Legacy compat
    setCart: (state, action: PayloadAction<{ items: CartItem[]; subtotal: number }>) => {
      state.items = action.payload.items;
      state.subtotal = action.payload.subtotal;
    },
  },
});

export const { addItem, removeItem, updateQty, clearCart, setLoading, setCart } = cartSlice.actions;
export default cartSlice.reducer;
