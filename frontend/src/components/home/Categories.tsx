'use client';

import Link from 'next/link';

const categories = [
  { name: 'Grains & Pulses',    slug: 'grains-pulses',    count: 85,  emoji: '🌾' },
  { name: 'Spices & Masala',    slug: 'spices-masala',    count: 120, emoji: '🌶️' },
  { name: 'Oils & Ghee',        slug: 'oils-ghee',        count: 45,  emoji: '🫙' },
  { name: 'Cleaning & Home',    slug: 'cleaning-home',    count: 70,  emoji: '🧹' },
  { name: 'Personal Care',      slug: 'personal-care',    count: 95,  emoji: '🧴' },
  { name: 'Snacks & Beverages', slug: 'snacks-beverages', count: 110, emoji: '🍵' },
];

export function Categories() {
  return (
    <section className="container section-padding">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Shop by Category</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            All your daily kirana needs in one place
          </p>
        </div>
        <Link href="/categories" className="text-sm text-primary hover:underline">
          View All
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className="group relative overflow-hidden rounded-lg border bg-card p-6 text-center transition-all hover:border-primary hover:shadow-lg"
          >
            <div className="mb-2 text-3xl">{category.emoji}</div>
            <h3 className="text-sm font-semibold leading-tight group-hover:text-primary">
              {category.name}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">{category.count} items</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
