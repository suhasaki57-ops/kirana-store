'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { removeItem, updateQty } from '@/store/slices/cartSlice';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Trash2, Plus, Minus, ShoppingBag, Tag, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

const COUPONS: Record<string, { type: 'pct' | 'flat'; value: number; min: number }> = {
  KIRANA10: { type: 'pct', value: 10, min: 200 },
  SAVE50: { type: 'flat', value: 50, min: 500 },
  NAYA100: { type: 'flat', value: 100, min: 999 },
};

export default function CartPage() {
  const dispatch = useDispatch();
  const { items: allItems } = useSelector((state: RootState) => state.cart);

  const [mounted, setMounted]   = useState(false);
  const [coupon, setCoupon]     = useState('');
  const [applied, setApplied]   = useState<{ code: string; disc: number } | null>(null);
  const [err, setErr]           = useState('');

  useEffect(() => { setMounted(true); }, []);

  // Only use Redux cart data after client mount to prevent hydration mismatch
  const items = mounted ? allItems : [];

  const handleUpdateQty = (id: string, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      handleRemove(id);
    } else {
      dispatch(updateQty({ id, qty: newQty }));
    }
  };

  const handleRemove = (id: string) => {
    dispatch(removeItem(id));
    toast.success('Item removed from cart');
  };

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalSavings = items.reduce(
    (s, i) => s + ((i.comparePrice || i.price * 1.15) - i.price) * i.quantity,
    0
  );
  const shipping = subtotal >= 500 || subtotal === 0 ? 0 : 49;

  const applyCoupon = () => {
    const c = COUPONS[coupon.toUpperCase()];
    if (!c) {
      setErr('Invalid coupon code');
      return;
    }
    if (subtotal < c.min) {
      setErr(`Minimum order ₹${c.min} required`);
      return;
    }
    const disc = c.type === 'pct' ? Math.round((subtotal * c.value) / 100) : c.value;
    setApplied({ code: coupon.toUpperCase(), disc });
    setErr('');
    toast.success(`Coupon ${coupon.toUpperCase()} applied!`);
  };

  const couponDisc = applied?.disc ?? 0;
  const total = Math.max(0, subtotal - couponDisc + shipping);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 py-16 px-4">
          <ShoppingBag className="h-20 w-20 text-muted-foreground/30" />
          <h2 className="text-2xl font-bold">Your cart is empty</h2>
          <p className="text-muted-foreground text-center">Add fresh groceries and daily essentials to get started!</p>
          <Link
            href="/products"
            className="mt-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-green-700 transition-all"
          >
            Explore Products
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container py-8">
        <h1 className="mb-6 text-2xl font-bold">Shopping Cart ({items.length} items)</h1>
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 rounded-xl border bg-white p-4 shadow-sm">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-50 border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200'}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/products/${item.slug || item.id}`}
                      className="text-sm font-semibold leading-snug hover:text-green-700 line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      className="shrink-0 text-red-400 hover:text-red-600 transition-colors p-1"
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-base font-bold text-green-700">{formatPrice(item.price)}</span>
                      {item.comparePrice && item.comparePrice > item.price && (
                        <span className="ml-2 text-xs text-muted-foreground line-through">
                          {formatPrice(item.comparePrice)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border bg-gray-50">
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.id, item.quantity, -1)}
                        className="flex h-8 w-8 items-center justify-center hover:bg-gray-200 rounded-l-lg transition-colors"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.id, item.quantity, 1)}
                        className="flex h-8 w-8 items-center justify-center hover:bg-gray-200 rounded-r-lg transition-colors"
                      >
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
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <h3 className="mb-3 font-semibold flex items-center gap-2">
                <Tag className="h-4 w-4 text-green-600" /> Apply Coupon
              </h3>
              <div className="flex gap-2">
                <input
                  value={coupon}
                  onChange={(e) => {
                    setCoupon(e.target.value.toUpperCase());
                    setErr('');
                  }}
                  placeholder="Enter coupon code"
                  className="flex-1 rounded-lg border px-3 py-2 text-sm uppercase outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
                >
                  Apply
                </button>
              </div>
              {err && <p className="mt-1.5 text-xs text-red-500">{err}</p>}
              {applied && (
                <div className="mt-2 flex items-center justify-between rounded-lg bg-green-50 px-3 py-2 border border-green-200">
                  <p className="text-xs font-semibold text-green-700">
                    Code &quot;{applied.code}&quot; applied — saving {formatPrice(applied.disc)}!
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setApplied(null);
                      setCoupon('');
                    }}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>
              )}
              <p className="mt-2 text-xs text-muted-foreground">Try: KIRANA10 | SAVE50 | NAYA100</p>
            </div>

            {/* Summary */}
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <h3 className="mb-4 font-semibold">Price Summary</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
                  </span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Product Discount</span>
                    <span>- {formatPrice(totalSavings)}</span>
                  </div>
                )}
                {couponDisc > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon ({applied?.code})</span>
                    <span>- {formatPrice(couponDisc)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Charges</span>
                  {shipping === 0 ? (
                    <span className="text-green-600 font-medium">FREE</span>
                  ) : (
                    <span>{formatPrice(shipping)}</span>
                  )}
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
                {totalSavings + couponDisc > 0 && (
                  <p className="text-xs font-medium text-green-600">
                    You save {formatPrice(totalSavings + couponDisc)} on this order!
                  </p>
                )}
              </div>

              <Link
                href="/checkout"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-bold text-white shadow-md hover:bg-green-700 transition-all active:scale-98"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/products"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
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
