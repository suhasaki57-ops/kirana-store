'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ProductCard } from '../products/ProductCard';

// Static fallback shown on server (no Redux / no localStorage dependency)
const STATIC_FEATURED = [
  { _id:'fp1', name:'India Gate Basmati Rice 5kg',  slug:'india-gate-basmati-rice-5kg',  price:499, comparePrice:580, images:[{url:'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'}], averageRating:4.7, numReviews:540,  stock:200 },
  { _id:'fp2', name:'Amul Pure Ghee 500ml',          slug:'amul-pure-ghee-500ml',          price:295, comparePrice:340, images:[{url:'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400'}], averageRating:4.8, numReviews:910,  stock:180 },
  { _id:'fp3', name:'Surf Excel Easy Wash 1kg',      slug:'surf-excel-easy-wash-1kg',      price:138, comparePrice:160, images:[{url:'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400'}], averageRating:4.6, numReviews:750,  stock:300 },
  { _id:'fp4', name:'Tata Chai Premium Tea 500g',    slug:'tata-chai-premium-tea-500g',    price:235, comparePrice:270, images:[{url:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'}], averageRating:4.7, numReviews:720,  stock:280 },
];

export function FeaturedProducts() {
  const { products: storeProducts } = useSelector((s: RootState) => s.productsAdmin);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Only compute from Redux / localStorage after client mount
  const featuredList = (() => {
    if (!mounted) return STATIC_FEATURED;

    // Try Redux store first, then localStorage fallback
    let rawList = storeProducts;
    if (!rawList || rawList.length === 0) {
      try {
        const stored = localStorage.getItem('kirana_admin_products');
        if (stored) rawList = JSON.parse(stored);
      } catch {}
    }

    // If still empty, use static list
    if (!rawList || rawList.length === 0) return STATIC_FEATURED;

    const mapped = rawList
      .filter((p: any) => p.status !== 'inactive')
      .map((p: any) => ({
        _id: String(p.id || p._id),
        name: p.name,
        slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        price: p.price,
        comparePrice: p.mrp || p.comparePrice || Math.round(p.price * 1.15),
        images: p.images?.length ? p.images : [{ url: p.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' }],
        averageRating: p.averageRating || 4.5,
        numReviews: p.numReviews || 100,
        stock: p.stock ?? 50,
      }));

    const featured = mapped.filter((p: any) => (storeProducts as any[]).find((sp: any) => String(sp.id || sp._id) === p._id)?.featured);
    return (featured.length > 0 ? featured : mapped).slice(0, 8);
  })();

  return (
    <section className="container section-padding">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold">Featured Products</h2>
        <p className="mt-2 text-muted-foreground">
          Handpicked daily essentials at the best prices
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
