import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import productReducer from './slices/productSlice';
import productsAdminReducer from './slices/productsAdminSlice';
import ordersReducer from './slices/ordersSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    auth:          authReducer,
    cart:          cartReducer,
    wishlist:      wishlistReducer,
    product:       productReducer,
    productsAdmin: productsAdminReducer,
    orders:        ordersReducer,
    settings:      settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState  = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
