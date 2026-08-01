'use client';

import { Provider, useDispatch } from 'react-redux';
import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';
import { store } from '@/store';
import { rehydrateAuth } from '@/store/slices/authSlice';
import { rehydrateCart } from '@/store/slices/cartSlice';

// Inner component — runs AFTER mount so localStorage/cookies are available
function Rehydrator() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Rehydrate auth state from cookies
    dispatch(rehydrateAuth());
    // Rehydrate cart state from localStorage
    dispatch(rehydrateCart());
  }, [dispatch]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <Rehydrator />
        {children}
      </ThemeProvider>
    </Provider>
  );
}
