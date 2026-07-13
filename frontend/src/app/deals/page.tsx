'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/products/ProductCard';
import { Timer } from 'lucide-react';

const dealProducts = [
  { _id:'1',  name:'India Gate Basmati Rice 5kg',      slug:'india-gate-basmati-rice-5kg',      price:499, comparePrice:580, images:[{url:'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'}], averageRating:4.7, numReviews:540, stock:200 },
  { _id:'2',  name:'Amul Pure Ghee 500ml',              slug:'amul-pure-ghee-500ml',              price:295, comparePrice:340, images:[{url:'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400'}], averageRating:4.8, numReviews:910, stock:180 },
  { _id:'3',  name:'Surf Excel Easy Wash 1kg',          slug:'surf-excel-easy-wash-1kg',          price:138, comparePrice:180, images:[{url:'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400'}], averageRating:4.6, numReviews:750, stock:300 },
  { _id:'4',  name:'Tata Chai Premium Tea 500g',        slug:'tata-chai-premium-tea-500g',        price:235, comparePrice:295, images:[{url:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'}], averageRating:4.7, numReviews:720, stock:280 },
  { _id:'5',  name:'Parle-G Biscuits 1kg',              slug:'parle-g-biscuits-1kg',              price:85,  comparePrice:110, images:[{url:'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400'}], averageRating:4.8, numReviews:1540, stock:600 },
  { _id:'6',  name:'Fortune Sunflower Oil 1L',          slug:'fortune-sunflower-oil-1l',          price:142, comparePrice:180, images:[{url:'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400'}], averageRating:4.4, numReviews:320, stock:250 },
  { _id:'7',  name:'MDH Chana Masala 100g',             slug:'mdh-chana-masala-100g',             price:55,  comparePrice:75,  images:[{url:'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400'}], averageRating:4.6, numReviews:680, stock:400 },
  { _id:'8',  name:'Lifebuoy Soap Pack of 4',           slug:'lifebuoy-soap-pack-of-4',           price:96,  comparePrice:130, images:[{url:'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400'}], averageRating:4.5, numReviews:880, stock:500 },
];

function Countdown() {
  const END = 23 * 3600 + 45 * 60 + 30;
  const [secs, setSecs] = useState(END);

  useEffect(() => {
    const t = setInterval(() => setSecs(s => (s <= 1 ? END : s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const h = String(Math.floor(secs / 3600)).padStart(2,'0');
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2,'0');
  const s = String(secs % 60).padStart(2,'0');

  return (
    <div className="flex items-center gap-1 text-white font-mono text-xl font-bold">
      <span className="bg-white/20 rounded px-2 py-1">{h}</span>
      <span>:</span>
      <span className="bg-white/20 rounded px-2 py-1">{m}</span>
      <span>:</span>
      <span className="bg-white/20 rounded px-2 py-1">{s}</span>
    </div>
  );
}

export default function DealsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero banner */}
        <div className="bg-gradient-to-r from-green-700 to-green-500 text-white py-8 px-4">
          <div className="container text-center">
            <p className="text-sm font-semibold uppercase tracking-widest opacity-80 mb-2">Limited Time Offers</p>
            <h1 className="text-3xl font-extrabold mb-3">Today's Best Deals 🔥</h1>
            <p className="text-sm opacity-90 mb-4">Grab the best grocery deals before they expire!</p>
            <div className="flex items-center justify-center gap-3">
              <Timer className="h-5 w-5" />
              <span className="text-sm font-medium mr-2">Ends in:</span>
              <Countdown />
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="container py-8">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-muted-foreground text-sm">Showing {dealProducts.length} deals</p>
            <span className="text-xs bg-green-100 text-green-700 font-semibold rounded-full px-3 py-1">
              Up to 30% off today!
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {dealProducts.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
