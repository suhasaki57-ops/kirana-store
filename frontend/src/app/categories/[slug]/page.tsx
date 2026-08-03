'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/products/ProductCard';
import { Search, ArrowLeft, SlidersHorizontal } from 'lucide-react';
import { fetchProducts, normalizeProduct, type ApiProduct } from '@/lib/productsApi';

const CATEGORY_MAP: Record<string, { name: string; emoji: string; description: string; bg: string; border: string; text: string }> = {
  'grains-pulses': {
    name: 'Grains & Pulses',
    emoji: '🌾',
    description: 'Premium quality rice, wheat, dal, atta and staple food grains for your kitchen.',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
  },
  'spices-masala': {
    name: 'Spices & Masala',
    emoji: '🌶️',
    description: 'Authentic Indian spices, whole masalas, and blend powders for rich flavours.',
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
  },
  'oils-ghee': {
    name: 'Oils & Ghee',
    emoji: '🫙',
    description: 'Pure cow ghee, mustard oil, sunflower oil, and healthy cooking oils.',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-800',
  },
  'cleaning-home': {
    name: 'Cleaning & Home',
    emoji: '🧹',
    description: 'Detergent powders, dishwash bars, floor cleaners, and household hygiene.',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
  },
  'personal-care': {
    name: 'Personal Care',
    emoji: '🧴',
    description: 'Bathing soaps, toothpastes, shampoos, and daily hygiene essentials.',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-800',
  },
  'snacks-beverages': {
    name: 'Snacks & Beverages',
    emoji: '🍵',
    description: 'Finest Assam tea, biscuits, cold beverages, and daily tea-time snacks.',
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
  },
};

export default function CategoryDetailPage() {
  const routeParams = useParams();
  const slug = typeof routeParams?.slug === 'string' ? routeParams.slug : Array.isArray(routeParams?.slug) ? routeParams.slug[0] : '';
  const [apiProducts, setApiProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    setLoading(true);
    fetchProducts({ limit: 200 }).then(({ products }) => {
      setApiProducts(products);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const catInfo = (slug && CATEGORY_MAP[slug]) || {
    name: slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Category',
    emoji: '📦',
    description: 'Explore our wide collection of kirana products in this category.',
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
  };

  const normalized = useMemo(() => apiProducts.map(normalizeProduct), [apiProducts]);

  const products = useMemo(() => {
    let list = normalized.filter(p => String(p.category).toLowerCase().includes(catInfo.name.toLowerCase()) || catInfo.name.toLowerCase().includes(String(p.category).toLowerCase()));
    if (search) {
      list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (sortBy === 'price-asc')  list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating')     list.sort((a, b) => b.averageRating - a.averageRating);
    return list;
  }, [normalized, catInfo.name, search, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Banner */}
        <div className={`border-b ${catInfo.bg} ${catInfo.border} py-10 px-4`}>
          <div className="container max-w-6xl mx-auto">
            <Link
              href="/categories"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-green-700 mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to All Categories
            </Link>

            <div className="flex items-center gap-4">
              <span className="text-5xl sm:text-6xl p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                {catInfo.emoji}
              </span>
              <div>
                <h1 className={`text-2xl sm:text-3xl font-extrabold ${catInfo.text}`}>
                  {catInfo.name}
                </h1>
                <p className="mt-1 text-sm text-gray-600 max-w-2xl">
                  {catInfo.description}
                </p>
                <p className="mt-2 text-xs font-semibold text-muted-foreground">
                  Showing {products.length} items in stock
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="container max-w-6xl mx-auto px-4 py-8">
          {/* Controls Bar */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-xl border shadow-sm">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search in ${catInfo.name}...`}
                className="w-full rounded-lg border bg-gray-50 pl-9 pr-3 py-2 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-64 rounded-xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border bg-white py-16 text-center shadow-sm">
              <span className="text-5xl mb-4">🔍</span>
              <h3 className="text-lg font-semibold text-gray-800">No items found in {catInfo.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">Try clearing your search term</p>
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="mt-4 rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
