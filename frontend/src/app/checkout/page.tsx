'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { CheckCircle, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { clearCart } from '@/store/slices/cartSlice';
import { placeOrder } from '@/store/slices/ordersSlice';

const addressSchema = z.object({
  name:    z.string().min(2, 'Name must be at least 2 characters'),
  phone:   z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  line1:   z.string().min(5, 'Address is required'),
  line2:   z.string().optional(),
  city:    z.string().min(2, 'City is required'),
  state:   z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit pincode'),
});
type AddressForm = z.infer<typeof addressSchema>;

const DELIVERY_CHARGE = 49;

export default function CheckoutPage() {
  const router   = useRouter();
  const dispatch = useDispatch();

  const cartItems = useSelector((s: RootState) => s.cart.items);

  const [step,         setStep]        = useState<1 | 2>(1);
  const [savedAddress, setSavedAddress] = useState<AddressForm | null>(null);

  // Only Cash on Delivery is available
  const paymentMethod = 'COD';

  const { register, handleSubmit, formState: { errors } } =
    useForm<AddressForm>({ resolver: zodResolver(addressSchema) });

  const displayItems = cartItems.length > 0
    ? cartItems.map(i => ({ name: i.name, qty: (i as any).quantity, price: i.price }))
    : [
        { name: 'India Gate Basmati Rice 5kg', qty: 1, price: 499 },
        { name: 'Amul Pure Ghee 500ml',        qty: 1, price: 295 },
      ];

  const displaySubtotal = displayItems.reduce((s, i) => s + i.price * i.qty, 0);
  const displayShipping = displaySubtotal >= 500 ? 0 : DELIVERY_CHARGE;
  const displayTotal    = displaySubtotal + displayShipping;

  const onAddressSubmit = (data: AddressForm) => {
    setSavedAddress(data);
    setStep(2);
  };

  const handlePlaceOrder = () => {
    if (!savedAddress) return;

    const addrStr = `${savedAddress.name}, ${savedAddress.line1}${savedAddress.line2 ? ', ' + savedAddress.line2 : ''}, ${savedAddress.city} - ${savedAddress.pincode}, ${savedAddress.state} | Ph: ${savedAddress.phone}`;

    dispatch(placeOrder({
      customer:     savedAddress.name,
      phone:        savedAddress.phone,
      email:        'customer@kirana.com',
      address:      addrStr,
      items:        displayItems,
      itemsSummary: displayItems.map(i => i.name.split(' ').slice(0, 3).join(' ')).join(', '),
      total:        displayTotal,
      method:       paymentMethod,
    }));

    dispatch(clearCart());

    toast.success('Order placed successfully! 🎉', {
      duration: 3000,
      style: { fontWeight: '600' },
    });

    setTimeout(() => router.push('/orders'), 1200);
  };

  const steps = [
    { n: 1, label: 'Delivery Address' },
    { n: 2, label: 'Confirm Order'    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container max-w-4xl py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        {/* Step indicator */}
        <div className="flex items-center mb-8">
          {steps.map((s, i) => (
            <div key={s.n} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold border-2 transition-all duration-300
                  ${step >= s.n ? 'bg-green-600 border-green-600 text-white scale-110' : 'border-gray-300 text-gray-400 bg-white'}`}>
                  {step > s.n ? <CheckCircle className="h-5 w-5" /> : s.n}
                </div>
                <span className={`mt-1 text-xs font-medium whitespace-nowrap transition-colors ${step >= s.n ? 'text-green-700' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-4 transition-colors duration-500 ${step > s.n ? 'bg-green-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: steps */}
          <div className="lg:col-span-2">

            {/* ── Step 1: Address ─────────────────── */}
            {step === 1 && (
              <div className="rounded-2xl border bg-white p-6 shadow-sm animate-fade-in">
                <h2 className="text-lg font-semibold mb-5">Delivery Address</h2>
                <form onSubmit={handleSubmit(onAddressSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Full Name *</label>
                      <input {...register('name')} placeholder="Raj Sharma"
                        className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone *</label>
                      <input {...register('phone')} placeholder="9876543210"
                        className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                      {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Address Line 1 *</label>
                    <input {...register('line1')} placeholder="Flat/House No., Building, Street"
                      className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                    {errors.line1 && <p className="text-xs text-red-500 mt-1">{errors.line1.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Address Line 2 (optional)</label>
                    <input {...register('line2')} placeholder="Area, Colony, Landmark"
                      className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">City *</label>
                      <input {...register('city')} placeholder="Mumbai"
                        className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                      {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">State *</label>
                      <input {...register('state')} placeholder="Maharashtra"
                        className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                      {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state.message}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Pincode *</label>
                      <input {...register('pincode')} placeholder="400001"
                        className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                      {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode.message}</p>}
                    </div>
                  </div>
                  <button type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-bold text-white hover:bg-green-700 transition-all active:scale-95">
                    Continue to Review <ChevronRight className="h-4 w-4" />
                  </button>
                </form>
              </div>
            )}

            {/* ── Step 2: Confirm ──────────────────── */}
            {step === 2 && (
              <div className="rounded-2xl border bg-white p-6 shadow-sm animate-fade-in space-y-4">
                <h2 className="text-lg font-semibold">Confirm Your Order</h2>

                {/* Address */}
                <div className="rounded-xl bg-gray-50 border p-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Delivery Address</p>
                  {savedAddress && (
                    <p className="text-sm text-gray-700">
                      {savedAddress.name} · {savedAddress.phone}<br />
                      {savedAddress.line1}{savedAddress.line2 ? `, ${savedAddress.line2}` : ''}<br />
                      {savedAddress.city}, {savedAddress.state} – {savedAddress.pincode}
                    </p>
                  )}
                </div>

                {/* Payment — COD only */}
                <div className="rounded-xl bg-green-50 border border-green-200 p-4 flex items-center gap-3">
                  <span className="text-2xl">💵</span>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Payment Method</p>
                    <p className="text-sm font-semibold text-green-700 mt-0.5">Cash on Delivery (COD)</p>
                    <p className="text-xs text-gray-500">Pay with cash when your order arrives</p>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {displayItems.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.name} × {item.qty}</span>
                      <span className="font-medium">{formatPrice(item.price * item.qty)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm text-muted-foreground border-t pt-2">
                    <span>Delivery</span>
                    <span>{displayShipping === 0 ? 'FREE' : formatPrice(displayShipping)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t pt-2">
                    <span>Total</span>
                    <span className="text-green-700">{formatPrice(displayTotal)}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setStep(1)}
                    className="flex-1 rounded-xl border py-3 text-sm font-semibold hover:bg-gray-50 transition-colors">
                    Back
                  </button>
                  <button onClick={handlePlaceOrder}
                    className="flex-1 rounded-xl bg-green-600 py-3 text-sm font-bold text-white hover:bg-green-700 transition-all active:scale-95">
                    🎉 Place Order
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: price summary */}
          <div className="rounded-2xl border bg-white p-5 shadow-sm h-fit sticky top-24">
            <h3 className="font-semibold mb-4 text-gray-800">Price Details</h3>
            <div className="space-y-2.5 text-sm">
              {displayItems.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-gray-600 line-clamp-1">{item.name} ×{item.qty}</span>
                  <span className="font-medium ml-2 whitespace-nowrap">{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
              <div className="flex justify-between text-gray-500 border-t pt-2">
                <span>Delivery</span>
                <span className={displayShipping === 0 ? 'text-green-600 font-medium' : ''}>
                  {displayShipping === 0 ? 'FREE' : formatPrice(displayShipping)}
                </span>
              </div>
              {displayShipping > 0 && (
                <p className="text-xs text-green-700 bg-green-50 rounded-lg px-2 py-1">
                  Add {formatPrice(500 - displaySubtotal)} more for free delivery
                </p>
              )}
              <div className="flex justify-between font-bold text-base border-t pt-2.5">
                <span>Total</span>
                <span className="text-green-700">{formatPrice(displayTotal)}</span>
              </div>
            </div>
            {/* Payment badge */}
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-3 py-2">
              <span>💵</span>
              <span className="text-xs font-semibold text-green-700">Cash on Delivery</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
