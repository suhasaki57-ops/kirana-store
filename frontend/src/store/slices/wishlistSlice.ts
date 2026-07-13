import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WishlistState {
  productIds: string[];
  loading: boolean;
}

const initialState: WishlistState = {
  productIds: [],
  loading: false,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlist: (state, action: PayloadAction<string[]>) => {
      state.productIds = action.payload;
    },
    addToWishlist: (state, action: PayloadAction<string>) => {
      if (!state.productIds.includes(action.payload)) {
        state.productIds.push(action.payload);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.productIds = state.productIds.filter((id) => id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setWishlist, addToWishlist, removeFromWishlist, setLoading } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;
