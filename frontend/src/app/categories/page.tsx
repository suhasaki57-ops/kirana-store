'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const categories = [
  {
    emoji: '🌾',
    name: 'Grains & Pulses',
    slug: 'grains-pulses',
    itemCount: 85,
    description: 'Rice, wheat, dal, atta and more',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-700',
  },
  {
    emoji: '🌶️',
    name: 'Spices & Masala',
    slug: 'spices-masala',
    itemCount: 120,
    description: 'All Indian spices and masalas',
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
  },
  {
    emoji: '🫙',
    name: 'Oils & Ghee',
    slug: 'oils-ghee',
    itemCount: 45,
    description: 'Cooking oils, ghee and vanaspati',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
  },
  {
    emoji: '🧹',
    name: 'Cleaning & Home',
    slug: 'cleaning-home',
    itemCount: 70,
    description: 'Detergents, soaps and cleaners',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
  },
  {
    emoji: '🧴',
    name: 'Personal Care',
    slug: 'personal-care',
    itemCount: 95,
    description: 'Soaps, shampoo and hygiene items',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
  },
  {
    emoji: '🍵',
    name: 'Snacks & Beverages',
    slug: 'snacks-beverages',
    itemCount: 110,
    description: 'Biscuits, tea, coffee and drinks',
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
  },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        <div className="container max-w-5xl mx-auto px-4 py-10">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Shop by Category</h1>
            <p className="mt-2 text-muted-foreground">
              Find everything you need for your home — groceries, spices, cleaning essentials and more.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className={`group flex flex-col items-center text-center rounded-2xl border-2 ${cat.border} ${cat.bg} p-8 shadow-sm hover:shadow-md transition-all hover:-translate-y-1`}
              >
                <span className="text-6xl mb-4">{cat.emoji}</span>
                <h2 className={`text-xl font-bold ${cat.text}`}>{cat.name}</h2>
                <p className="mt-2 text-sm text-gray-600">{cat.description}</p>
                <span className="mt-4 inline-block rounded-full bg-white border border-gray-200 text-xs font-semibold text-gray-500 px-3 py-1">
                  {cat.itemCount} items
                </span>
                <span className={`mt-3 text-xs font-semibold ${cat.text} group-hover:underline`}>
                  Browse Now →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
