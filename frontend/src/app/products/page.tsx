'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';
import { Search, SlidersHorizontal, X } from 'lucide-react';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get('search') || '';
  const urlCategory = searchParams.get('category') || '';

  const { products: storeProducts } = useSelector((s: RootState) => s.productsAdmin);

  const [search, setSearch] = useState(urlSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(urlSearch);
  const [sortBy, setSortBy] = useState('featured');
  const [cats, setCats] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [minRating, setMinRating] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 150);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setSearch(urlSearch);
    setDebouncedSearch(urlSearch);
    if (urlCategory) {
      setCats([urlCategory]);
    }
  }, [urlSearch, urlCategory]);

  // Combine products from Redux / LocalStorage
  const allProducts = useMemo(() => {
    let list: any[] = [];
    
    // Check localStorage fallback if store loading
    let rawList = storeProducts;
    if (typeof window !== 'undefined' && (!rawList || rawList.length === 0)) {
      try {
        const stored = localStorage.getItem('kirana_admin_products');
        if (stored) rawList = JSON.parse(stored);
      } catch {}
    }

    if (rawList && rawList.length > 0) {
      list = rawList
        .filter((p: any) => p.status !== 'inactive')
        .map((p: any) => ({
          _id: p.id || p._id,
          name: p.name,
          slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          price: p.price,
          comparePrice: p.mrp || p.comparePrice || p.price * 1.15,
          category: p.category,
          images: p.images || [{ url: p.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' }],
          averageRating: p.averageRating || 4.5,
          numReviews: p.numReviews || 48,
          stock: p.stock ?? 100,
          description: p.description,
          brand: p.brand,
          featured: p.featured,
        }));
    }

    return list;
  }, [storeProducts]);

  const filtered = useMemo(() => {
    let list = [...allProducts];
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || (p.category && p.category.toLowerCase().includes(q))
      );
    }
    if (cats.length) {
      list = list.filter((p) =>
        cats.some(
          (c) =>
            c.toLowerCase() === p.category.toLowerCase() ||
            c.toLowerCase() === p.category.toLowerCase().replace(/\s*&\s*/g, '-').replace(/\s+/g, '-')
        )
      );
    }
    list = list.filter((p) => p.price <= maxPrice);
    if (minRating) {
      list = list.filter((p) => p.averageRating >= minRating);
    }
    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') list.sort((a, b) => b.averageRating - a.averageRating);
    return list;
  }, [allProducts, debouncedSearch, cats, maxPrice, minRating, sortBy]);

  const activeFilterCount = cats.length + (maxPrice < 2000 ? 1 : 0) + (minRating > 0 ? 1 : 0);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container py-6">
        {/* Page header */}
        <div className={`mb-6 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-2xl font-bold text-gray-800">All Grocery & Marketplace Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Explore authentic items added by verified local sellers & suppliers
          </p>
        </div>

        {/* Search bar - mobile */}
        <div className="mb-4 flex gap-2 md:hidden">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-xl border bg-white pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button onClick={() => setShowFilter(!showFilter)}
            className={`relative flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-medium shadow-sm transition-colors ${showFilter ? 'bg-green-600 text-white border-green-600' : 'bg-white hover:bg-gray-50'}`}>
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Filters sidebar */}
          <aside className={`lg:col-span-1 ${showFilter ? 'block' : 'hidden'} md:block`}>
            <ProductFilters
              cats={cats}
              setCats={setCats}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              minRating={minRating}
              setMinRating={setMinRating}
              activeCount={activeFilterCount}
              onClear={() => { setCats([]); setMaxPrice(2000); setMinRating(0); }}
            />
          </aside>

          {/* Products grid */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm">
              {/* Desktop search */}
              <div className="relative hidden md:block w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-lg border bg-gray-50 pl-9 pr-8 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3 ml-auto">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-gray-800">{filtered.length}</span> products
                </p>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  className="rounded-lg border bg-gray-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500">
                  <option value="featured">Sort: Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {cats.map(c => (
                  <span key={c} className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    {c}
                    <button onClick={() => setCats(p => p.filter(x => x !== c))}><X className="h-3 w-3" /></button>
                  </span>
                ))}
                {maxPrice < 2000 && (
                  <span className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    Under ₹{maxPrice}
                    <button onClick={() => setMaxPrice(2000)}><X className="h-3 w-3" /></button>
                  </span>
                )}
                {minRating > 0 && (
                  <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                    {minRating}★ & up
                    <button onClick={() => setMinRating(0)}><X className="h-3 w-3" /></button>
                  </span>
                )}
              </div>
            )}

            {/* Empty state */}
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border bg-white py-16 text-center shadow-sm">
                <span className="text-5xl mb-4">🔍</span>
                <h3 className="text-lg font-semibold text-gray-800">No products found</h3>
                <p className="mt-1 text-sm text-muted-foreground">Try a different search or clear the filters</p>
                <button onClick={() => { setSearch(''); setCats([]); setMaxPrice(2000); setMinRating(0); }}
                  className="mt-4 rounded-lg bg-green-600 px-6 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((product, i) => (
                  <div
                    key={product._id}
                    className="transition-all duration-300"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
