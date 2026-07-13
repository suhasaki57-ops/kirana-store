import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',      // Faster font load — avoids invisible text flash
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: 'Kirana Store — Best Grocery Prices Online',
    template: '%s | Kirana Store',
  },
  description: 'Shop daily essentials — Rice, Dal, Sugar, Salt, Oils, Soaps & Detergents at the best prices. Fast delivery across India.',
  keywords: 'kirana, grocery, online grocery, rice, dal, sugar, salt, oil, soap, detergent, India',
  openGraph: {
    title: 'Kirana Store — Best Grocery Prices Online',
    description: 'Shop daily essentials at the best prices. Fast delivery across India.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              duration: 2500,
              style: {
                background: '#fff',
                color: '#1f2937',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                fontSize: '13px',
                fontWeight: '500',
                padding: '10px 14px',
              },
              success: {
                iconTheme: { primary: '#16a34a', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#dc2626', secondary: '#fff' },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
