'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const ALL_PRODUCTS = [
  { _id:'1',  name:'India Gate Basmati Rice 5kg',      slug:'india-gate-basmati-rice-5kg',      price:499, comparePrice:580, category:'Grains & Pulses',    images:[{url:'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'}], averageRating:4.7, numReviews:540,  stock:200 },
  { _id:'2',  name:'Aashirvaad Whole Wheat Atta 10kg', slug:'aashirvaad-whole-wheat-atta-10kg', price:380, comparePrice:420, category:'Grains & Pulses',    images:[{url:'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'}], averageRating:4.6, numReviews:820,  stock:150 },
  { _id:'3',  name:'Toor Dal (Arhar) 1kg',             slug:'toor-dal-arhar-1kg',               price:145, comparePrice:165, category:'Grains & Pulses',    images:[{url:'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400'}], averageRating:4.4, numReviews:310,  stock:300 },
  { _id:'4',  name:'Sugar (Chini) 1kg - Refined',      slug:'sugar-chini-1kg-refined',          price:52,  comparePrice:60,  category:'Grains & Pulses',    images:[{url:'https://images.unsplash.com/photo-1559561853-08451507cbe7?w=400'}], averageRating:4.3, numReviews:215,  stock:500 },
  { _id:'5',  name:'Tata Salt Iodised 1kg',            slug:'tata-salt-iodised-1kg',            price:28,  comparePrice:32,  category:'Grains & Pulses',    images:[{url:'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400'}], averageRating:4.8, numReviews:1020, stock:800 },
  { _id:'6',  name:'MDH Chana Masala 100g',            slug:'mdh-chana-masala-100g',            price:55,  comparePrice:65,  category:'Spices & Masala',    images:[{url:'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400'}], averageRating:4.6, numReviews:680,  stock:400 },
  { _id:'7',  name:'Everest Turmeric Powder 200g',     slug:'everest-turmeric-haldi-powder-200g',price:48, comparePrice:58,  category:'Spices & Masala',    images:[{url:'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400'}], averageRating:4.5, numReviews:445,  stock:350 },
  { _id:'8',  name:'Fortune Sunflower Oil 1 Litre',    slug:'fortune-sunflower-oil-1-litre',    price:142, comparePrice:168, category:'Oils & Ghee',        images:[{url:'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400'}], averageRating:4.4, numReviews:320,  stock:250 },
  { _id:'9',  name:'Amul Pure Ghee 500ml',             slug:'amul-pure-ghee-500ml',             price:295, comparePrice:340, category:'Oils & Ghee',        images:[{url:'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400'}], averageRating:4.8, numReviews:910,  stock:180 },
  { _id:'10', name:'Surf Excel Easy Wash 1kg',         slug:'surf-excel-easy-wash-detergent-1kg',price:138,comparePrice:160, category:'Cleaning & Home',    images:[{url:'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400'}], averageRating:4.6, numReviews:750,  stock:300 },
  { _id:'11', name:'Vim Dishwash Bar (Pack of 3)',     slug:'vim-dishwash-bar-200g-pack-of-3',  price:75,  comparePrice:90,  category:'Cleaning & Home',    images:[{url:'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400'}], averageRating:4.4, numReviews:560,  stock:400 },
  { _id:'12', name:'Phenyl Floor Cleaner 1L',          slug:'phenyl-floor-cleaner-1-litre',     price:89,  comparePrice:110, category:'Cleaning & Home',    images:[{url:'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400'}], averageRating:4.3, numReviews:290,  stock:200 },
  { _id:'13', name:'Lifebuoy Total Soap (Pack of 4)',  slug:'lifebuoy-total-soap-100g-pack-of-4',price:96, comparePrice:112, category:'Personal Care',      images:[{url:'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400'}], averageRating:4.5, numReviews:880,  stock:500 },
  { _id:'14', name:'Colgate Strong Teeth 200g',        slug:'colgate-strong-teeth-toothpaste-200g',price:118,comparePrice:135,category:'Personal Care',     images:[{url:'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400'}], averageRating:4.6, numReviews:1100, stock:350 },
  { _id:'15', name:'Tata Chai Premium Tea 500g',       slug:'tata-chai-premium-tea-500g',       price:235, comparePrice:270, category:'Snacks & Beverages', images:[{url:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'}], averageRating:4.7, numReviews:720,  stock:280 },
  { _id:'16', name:'Parle-G Glucose Biscuits 1kg',     slug:'parle-g-original-glucose-biscuits-1kg',price:85,comparePrice:100,category:'Snacks & Beverages',images:[{url:'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400'}], averageRating:4.8, numReviews:1540, stock:600 },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get('search') || '';
  const urlCategory = searchParams.get('category') || '';

  const [search, setSearch] = useState(urlSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(urlSearch);
  const [sortBy, setSortBy] = useState('featured');
  const [cats, setCats] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(600);
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

  const filtered = useMemo(() => {
    let list = [...ALL_PRODUCTS];
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
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
  }, [search, cats, maxPrice, minRating, sortBy]);

  const activeFilterCount = cats.length + (maxPrice < 600 ? 1 : 0) + (minRating > 0 ? 1 : 0);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container py-6">
        {/* Page header */}
        <div className={`mb-6 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-2xl font-bold text-gray-800">All Grocery Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sugar, Salt, Atta, Dal, Oils, Soaps, Detergents and more
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
              onClear={() => { setCats([]); setMaxPrice(600); setMinRating(0); }}
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
                {maxPrice < 600 && (
                  <span className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    Under ₹{maxPrice}
                    <button onClick={() => setMaxPrice(600)}><X className="h-3 w-3" /></button>
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
                <button onClick={() => { setSearch(''); setCats([]); setMaxPrice(600); setMinRating(0); }}
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
