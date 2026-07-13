'use client';

import Link from 'next/link';
import { ArrowRight, ShoppingBag, Tag } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-green-50 via-green-50/40 to-background">
      <div className="container section-padding">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center">
            {/* Badge */}
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
              <Tag className="h-3.5 w-3.5" />
              Trusted Kirana Store — Best Prices Daily
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl animate-fade-in">
              Your Daily Grocery
              <span className="block text-green-600">Best Prices Guaranteed!</span>
            </h1>

            <p className="mt-5 text-lg text-muted-foreground">
              Sugar, Salt, Atta, Dal, Oil, Soaps, Detergents &amp; more — 
              everything your home needs, delivered fresh at the best prices.
            </p>

            {/* Trust badges */}
            <div className="mt-5 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">✅ 100% Quality Products</span>
              <span className="flex items-center gap-1">🚚 Fast Delivery</span>
              <span className="flex items-center gap-1">↩️ Easy Returns</span>
            </div>

            {/* CTA buttons */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-green-600 px-8 py-3 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
              >
                <ShoppingBag className="h-4 w-4" />
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/products?featured=true"
                className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-green-600 px-8 py-3 text-sm font-semibold text-green-700 hover:bg-green-50 transition-colors"
              >
                Today's Deals
              </Link>
            </div>

            {/* Coupon highlight */}
            <div className="mt-6 rounded-lg border border-dashed border-green-400 bg-green-50 px-4 py-3 text-sm">
              🎫 Use code <span className="font-bold text-green-700">KIRANA10</span> — 10% off on orders above ₹200 &nbsp;|&nbsp;
              <span className="font-bold text-green-700">NAYA100</span> — ₹100 off on first order above ₹999
            </div>
          </div>

          {/* Right side visual */}
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
              {[
                { emoji: '🌾', label: 'Grains & Dal', sub: 'From ₹28' },
                { emoji: '🌶️', label: 'Spices & Masala', sub: 'From ₹48' },
                { emoji: '🫙', label: 'Oils & Ghee', sub: 'From ₹142' },
                { emoji: '🧴', label: 'Soaps & Care', sub: 'From ₹75' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center rounded-xl border bg-white p-4 text-center shadow-sm"
                >
                  <span className="text-3xl">{item.emoji}</span>
                  <p className="mt-2 text-xs font-semibold">{item.label}</p>
                  <p className="text-xs text-green-600 font-bold">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
