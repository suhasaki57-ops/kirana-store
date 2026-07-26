import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ArrowLeft, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl border shadow-sm">
          <div className="text-7xl mb-4">🔍</div>
          <h1 className="text-4xl font-extrabold text-gray-900">404</h1>
          <h2 className="text-xl font-bold text-gray-800 mt-2">Page Not Found</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Sorry, the page you are looking for does not exist or has been moved.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Search className="h-4 w-4" />
              Browse Products
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
