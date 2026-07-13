'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Heart, ShoppingCart, Trash2, Star } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface WishItem {
  id: string; name: string; slug: string; price: number;
  mrp: number; image: string; rating: number; reviews: number; stock: number;
}

const INITIAL: WishItem[] = [
  { id:'1', name:'India Gate Basmati Rice 5kg', slug:'india-gate-basmati-rice-5kg', price:499, mrp:580, image:'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300', rating:4.7, reviews:540, stock:200 },
  { id:'2', name:'Amul Pure Ghee 500ml',         slug:'amul-pure-ghee-500ml',         price:295, mrp:340, image:'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=300', rating:4.8, reviews:910, stock:50  },
  { id:'3', name:'MDH Chana Masala 100g',         slug:'mdh-chana-masala-100g',         price:55,  mrp:65,  image:'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300', rating:4.6, reviews:680, stock:400 },
  { id:'4', name:'Tata Chai Premium Tea 500g',    slug:'tata-chai-premium-tea-500g',    price:235, mrp:270, image:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300', rating:4.7, reviews:720, stock:280 },
];

export default function WishlistPage() {
  const [items, setItems] = useState<WishItem[]>(INITIAL);
  const [added, setAdded] = useState<string[]>([]);

  const remove = (id: string) => setItems(p => p.filter(i => i.id !== id));
  const addCart = (id: string) => {
    setAdded(p => [...p, id]);
    setTimeout(() => setAdded(p => p.filter(x => x !== id)), 2000);
  };

  if (items.length === 0) return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center gap-4">
        <Heart className="h-20 w-20 text-muted-foreground/30" />
        <h2 className="text-2xl font-bold">Your wishlist is empty</h2>
        <p className="text-muted-foreground">Save items you like for later.</p>
        <Link href="/products" className="mt-2 rounded-md bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700">
          Browse Products
        </Link>
      </main>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Wishlist ({items.length} items)</h1>
          <Link href="/products" className="text-sm text-green-700 hover:underline">
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map(item => {
            const discount = Math.round(((item.mrp - item.price) / item.mrp) * 100);
            const inCart   = added.includes(item.id);
            return (
              <div key={item.id} className="group relative rounded-lg border bg-white p-4 shadow-sm">
                {discount > 0 && (
                  <span className="absolute right-3 top-3 z-10 rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-bold text-white">
                    {discount}% OFF
                  </span>
                )}
                <button onClick={() => remove(item.id)}
                  className="absolute left-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow hover:bg-red-50 text-red-400">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>

                <Link href={`/products/${item.slug}`}>
                  <div className="relative mb-3 aspect-square overflow-hidden rounded-md bg-gray-50">
                    <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform" unoptimized />
                  </div>
                  <h3 className="line-clamp-2 text-sm font-semibold hover:text-green-700">{item.name}</h3>
                </Link>

                <div className="mt-1.5 flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">{item.rating}</span>
                  <span className="text-xs text-muted-foreground">({item.reviews})</span>
                </div>

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-base font-bold text-green-700">{formatPrice(item.price)}</span>
                  <span className="text-xs text-muted-foreground line-through">{formatPrice(item.mrp)}</span>
                </div>

                <button
                  onClick={() => addCart(item.id)}
                  disabled={item.stock === 0}
                  className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md bg-green-600 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  {inCart ? 'Added to Cart!' : 'Add to Cart'}
                </button>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
