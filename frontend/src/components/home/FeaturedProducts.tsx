'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from '../products/ProductCard';
import { fetchFeaturedProducts, normalizeProduct, type ApiProduct } from '@/lib/productsApi';

const STATIC_FEATURED = [
  { _id:'fp1', name:'India Gate Basmati Rice 5kg',  slug:'india-gate-basmati-rice-5kg',  price:499, comparePrice:580, images:[{url:'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop'}], averageRating:4.7, numReviews:540,  stock:200 },
  { _id:'fp2', name:'Amul Pure Ghee 500ml',          slug:'amul-pure-ghee-500ml',          price:295, comparePrice:340, images:[{url:'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&auto=format&fit=crop'}], averageRating:4.8, numReviews:910,  stock:180 },
  { _id:'fp3', name:'Surf Excel Easy Wash 1kg',      slug:'surf-excel-easy-wash-1kg',      price:138, comparePrice:160, images:[{url:'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&auto=format&fit=crop'}], averageRating:4.6, numReviews:750,  stock:300 },
  { _id:'fp4', name:'Tata Chai Premium Tea 500g',    slug:'tata-chai-premium-tea-500g',    price:235, comparePrice:270, images:[{url:'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&auto=format&fit=crop'}], averageRating:4.7, numReviews:720,  stock:280 },
];

export function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetchFeaturedProducts().then((apiProducts: ApiProduct[]) => {
      setProducts(apiProducts.map(normalizeProduct).slice(0, 8));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section className="container section-padding">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold">Featured Products</h2>
        <p className="mt-2 text-muted-foreground">
          Handpicked daily essentials at the best prices
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
