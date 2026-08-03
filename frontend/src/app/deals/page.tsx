'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/products/ProductCard';
import { Timer } from 'lucide-react';

import { fetchProducts, normalizeProduct, type ApiProduct } from '@/lib/productsApi';

const COUNTDOWN_END = 23 * 3600 + 45 * 60 + 30;

function Countdown() {
  const [secs, setSecs] = useState(COUNTDOWN_END);

  useEffect(() => {
    const t = setInterval(() => setSecs(s => (s <= 1 ? COUNTDOWN_END : s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const h = String(Math.floor(secs / 3600)).padStart(2,'0');
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2,'0');
  const s = String(secs % 60).padStart(2,'0');

  return (
    <div className="flex items-center gap-1 text-white font-mono text-xl font-bold">
      <span className="bg-white/20 rounded px-2 py-1">{h}</span>
      <span>:</span>
      <span className="bg-white/20 rounded px-2 py-1">{m}</span>
      <span>:</span>
      <span className="bg-white/20 rounded px-2 py-1">{s}</span>
    </div>
  );
}

export default function DealsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts({ limit: 100 }).then(({ products: apiProducts }) => {
      setProducts(apiProducts.map(normalizeProduct));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero banner */}
        <div className="bg-gradient-to-r from-green-700 to-green-500 text-white py-8 px-4">
          <div className="container text-center">
            <p className="text-sm font-semibold uppercase tracking-widest opacity-80 mb-2">Limited Time Offers</p>
            <h1 className="text-3xl font-extrabold mb-3">Today&apos;s Best Deals 🔥</h1>
            <p className="text-sm opacity-90 mb-4">Grab the best grocery deals before they expire!</p>
            <div className="flex items-center justify-center gap-3">
              <Timer className="h-5 w-5" />
              <span className="text-sm font-medium mr-2">Ends in:</span>
              <Countdown />
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="container py-8">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-muted-foreground text-sm">Showing {products.length} deals</p>
            <span className="text-xs bg-green-100 text-green-700 font-semibold rounded-full px-3 py-1">
              Up to 30% off today!
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-64 rounded-xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No active deals right now. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
