'use client';

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ProductCard } from '../products/ProductCard';

export function FeaturedProducts() {
  const { products: storeProducts } = useSelector((s: RootState) => s.productsAdmin);

  const featuredList = useMemo(() => {
    let rawList = storeProducts;
    if (typeof window !== 'undefined' && (!rawList || rawList.length === 0)) {
      try {
        const stored = localStorage.getItem('kirana_admin_products');
        if (stored) rawList = JSON.parse(stored);
      } catch {}
    }

    if (!rawList || rawList.length === 0) return [];

    let list = rawList
      .filter((p: any) => p.status !== 'inactive')
      .map((p: any) => ({
        _id: p.id || p._id,
        name: p.name,
        slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        price: p.price,
        comparePrice: p.mrp || p.comparePrice || p.price * 1.15,
        category: p.category,
        images: p.images || [{ url: p.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' }],
        averageRating: p.averageRating || 4.7,
        numReviews: p.numReviews || 540,
        stock: p.stock ?? 100,
        featured: p.featured,
      }));

    // Prioritize products marked featured, or fallback to top 4 products
    let featured = list.filter((p: any) => p.featured);
    if (featured.length === 0) {
      featured = list.slice(0, 4);
    }
    return featured.slice(0, 8);
  }, [storeProducts]);

  return (
    <section className="container section-padding">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold">Featured Products</h2>
        <p className="mt-2 text-muted-foreground">
          Handpicked daily essentials & real seller products at the best prices
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featuredList.map((product: any) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
