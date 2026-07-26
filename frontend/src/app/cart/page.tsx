'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Trash2, Plus, Minus, ShoppingBag, Tag, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface CartItem {
  id: string; name: string; price: number; mrp: number;
  qty: number; image: string; stock: number;
}

const INITIAL: CartItem[] = [
  { id:'1', name:'India Gate Basmati Rice 5kg',    price:499, mrp:580, qty:2, image:'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200', stock:200 },
  { id:'2', name:'Amul Pure Ghee 500ml',            price:295, mrp:340, qty:1, image:'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200', stock:50  },
  { id:'3', name:'Surf Excel Easy Wash 1kg',        price:138, mrp:160, qty:1, image:'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=200', stock:100 },
];

const COUPONS: Record<string, { type:'pct'|'flat'; value:number; min:number }> = {
  KIRANA10: { type:'pct',  value:10,  min:200 },
  SAVE50:   { type:'flat', value:50,  min:500 },
  NAYA100:  { type:'flat', value:100, min:999 },
};

export default function CartPage() {
  const [items, setItems]     = useState<CartItem[]>(INITIAL);
  const [coupon, setCoupon]   = useState('');
  const [applied, setApplied] = useState<{ code:string; disc:number }|null>(null);
  const [err, setErr]         = useState('');

  const updateQty = (id: string, delta: number) =>
    setItems(p => p.map(i => i.id===id ? {...i, qty: Math.max(1, Math.min(i.stock, i.qty+delta))} : i));

  const remove = (id: string) => setItems(p => p.filter(i => i.id!==id));

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const totalSavings = items.reduce((s, i) => s + (i.mrp - i.price) * i.qty, 0);
  const shipping = subtotal >= 500 ? 0 : 49;

  const applyCoupon = () => {
    const c = COUPONS[coupon.toUpperCase()];
    if (!c) { setErr('Invalid coupon code'); return; }
    if (subtotal < c.min) { setErr(`Minimum order ₹${c.min} required`); return; }
    const disc = c.type==='pct' ? Math.round(subtotal*c.value/100) : c.value;
    setApplied({ code: coupon.toUpperCase(), disc });
    setErr('');
  };

  const couponDisc = applied?.disc ?? 0;
  const total = subtotal - couponDisc + shipping;

  if (items.length === 0) return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center gap-4">
        <ShoppingBag className="h-20 w-20 text-muted-foreground/30" />
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <p className="text-muted-foreground">Add grocery items to get started!</p>
        <Link href="/products" className="mt-2 rounded-md bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700">
          Shop Now
        </Link>
      </main>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <h1 className="mb-6 text-2xl font-bold">Shopping Cart ({items.length} items)</h1>
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex gap-4 rounded-lg border bg-white p-4 shadow-sm">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-gray-50">
                  <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/products/${item.id}`} className="text-sm font-semibold leading-snug hover:text-green-700 line-clamp-2">
                      {item.name}
                    </Link>
                    <button onClick={() => remove(item.id)} className="shrink-0 text-red-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-base font-bold text-green-700">{formatPrice(item.price)}</span>
                      <span className="ml-2 text-xs text-muted-foreground line-through">{formatPrice(item.mrp)}</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-md border">
                      <button onClick={() => updateQty(item.id, -1)} className="flex h-7 w-7 items-center justify-center hover:bg-gray-50 rounded-l-md">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="flex h-7 w-7 items-center justify-center hover:bg-gray-50 rounded-r-md">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="space-y-4">
            {/* Coupon */}
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <h3 className="mb-3 font-semibold flex items-center gap-2">
                <Tag className="h-4 w-4 text-green-600" /> Apply Coupon
              </h3>
              <div className="flex gap-2">
                <input
                  value={coupon}
                  onChange={e => { setCoupon(e.target.value.toUpperCase()); setErr(''); }}
                  placeholder="Enter coupon code"
                  className="flex-1 rounded-md border px-3 py-2 text-sm uppercase outline-none focus:ring-2 focus:ring-green-500"
                />
                <button onClick={applyCoupon}
                  className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
                  Apply
                </button>
              </div>
              {err && <p className="mt-1.5 text-xs text-red-500">{err}</p>}
              {applied && (
                <div className="mt-2 flex items-center justify-between rounded-md bg-green-50 px-3 py-2">
                  <p className="text-xs font-semibold text-green-700">
                    Code &quot;{applied.code}&quot; applied — saving {formatPrice(applied.disc)}!
                  </p>
                  <button onClick={() => { setApplied(null); setCoupon(''); }}
                    className="text-xs text-red-500 hover:text-red-700">Remove</button>
                </div>
              )}
              <p className="mt-2 text-xs text-muted-foreground">
                Try: KIRANA10 | SAVE50 | NAYA100
              </p>
            </div>

            {/* Summary */}
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <h3 className="mb-4 font-semibold">Price Summary</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({items.reduce((s,i)=>s+i.qty,0)} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Product Discount</span>
                  <span>- {formatPrice(totalSavings)}</span>
                </div>
                {couponDisc > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon ({applied?.code})</span>
                    <span>- {formatPrice(couponDisc)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Charges</span>
                  {shipping === 0
                    ? <span className="text-green-600 font-medium">FREE</span>
                    : <span>{formatPrice(shipping)}</span>}
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Add ₹{500 - subtotal} more for free delivery
                  </p>
                )}
                <div className="flex justify-between border-t pt-2.5 text-base font-bold">
                  <span>Total Payable</span>
                  <span className="text-green-700">{formatPrice(total)}</span>
                </div>
                <p className="text-xs font-medium text-green-600">
                  You save {formatPrice(totalSavings + couponDisc)} on this order!
                </p>
              </div>

              <Link href="/checkout"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-green-600 py-3 text-sm font-bold text-white hover:bg-green-700">
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/products"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-md border py-2.5 text-sm font-medium hover:bg-gray-50">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
