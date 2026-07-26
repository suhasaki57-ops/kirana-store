'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/products/ProductCard';
import { Search, ArrowLeft, SlidersHorizontal } from 'lucide-react';

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

export default function CategoryDetailPage() {
  const routeParams = useParams();
  const slug = typeof routeParams?.slug === 'string' ? routeParams.slug : Array.isArray(routeParams?.slug) ? routeParams.slug[0] : '';
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  const catInfo = (slug && CATEGORY_MAP[slug]) || {
    name: slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Category',
    emoji: '📦',
    description: 'Explore our wide collection of kirana products in this category.',
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
  };

  const products = useMemo(() => {
    let list = ALL_PRODUCTS.filter(p => p.category.toLowerCase() === catInfo.name.toLowerCase());
    if (search) {
      list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (sortBy === 'price-asc')  list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating')     list.sort((a, b) => b.averageRating - a.averageRating);
    return list;
  }, [catInfo.name, search, sortBy]);

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
          {products.length === 0 ? (
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
