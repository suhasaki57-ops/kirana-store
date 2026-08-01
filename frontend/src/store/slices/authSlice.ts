import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

// Always start with empty state to prevent SSR/client hydration mismatch.
// The Providers component rehydrates auth from cookies on mount (client-only).
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string; refreshToken: string }>
    ) => {
      state.user            = action.payload.user;
      state.token           = action.payload.token;
      state.isAuthenticated = true;
      if (typeof window !== 'undefined') {
        Cookies.set('token',        action.payload.token,        { expires: 1 / 96 }); // 15 min
        Cookies.set('refreshToken', action.payload.refreshToken, { expires: 7 });
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    // Rehydrate from cookies on client after mount
    rehydrateAuth: (state) => {
      if (typeof window === 'undefined') return;
      const token = Cookies.get('token') || null;
      state.token           = token;
      state.isAuthenticated = !!token;
    },
    logout: (state) => {
      state.user            = null;
      state.token           = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        Cookies.remove('token');
        Cookies.remove('refreshToken');
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setCredentials, setUser, rehydrateAuth, logout, setLoading } =
  authSlice.actions;
export default authSlice.reducer;
