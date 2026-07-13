'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { formatPrice, formatDate } from '@/lib/utils';
import { ChevronDown, ChevronUp, Package, ShoppingBag } from 'lucide-react';
import { RootState } from '@/store';
import type { OrderStatus } from '@/store/slices/ordersSlice';

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string; icon: string }> = {
  pending:    { label:'Pending',    className:'bg-yellow-100 text-yellow-800 border border-yellow-200', icon:'⏳' },
  confirmed:  { label:'Confirmed',  className:'bg-blue-100   text-blue-800   border border-blue-200',   icon:'✅' },
  processing: { label:'Processing', className:'bg-purple-100 text-purple-800 border border-purple-200', icon:'⚙️' },
  packed:     { label:'Packed',     className:'bg-orange-100 text-orange-800 border border-orange-200', icon:'📦' },
  shipped:    { label:'Shipped',    className:'bg-indigo-100 text-indigo-800 border border-indigo-200', icon:'🚚' },
  delivered:  { label:'Delivered',  className:'bg-green-100  text-green-800  border border-green-200',  icon:'🎉' },
  cancelled:  { label:'Cancelled',  className:'bg-red-100    text-red-800    border border-red-200',    icon:'❌' },
};

export default function OrdersPage() {
  const orders           = useSelector((s: RootState) => s.orders.orders);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container max-w-3xl py-8 px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
            <p className="text-sm text-muted-foreground">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
          </div>
          <Link href="/products"
            className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors">
            <ShoppingBag className="h-4 w-4" /> Shop Now
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border bg-white py-20 text-center shadow-sm">
            <Package className="h-16 w-16 text-gray-200 mb-4" />
            <h2 className="text-lg font-semibold text-gray-700">No orders yet</h2>
            <p className="text-sm text-muted-foreground mt-1 mb-5">Place your first order to see it here!</p>
            <Link href="/products"
              className="rounded-xl bg-green-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-green-700 transition-colors">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const cfg        = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const isExpanded = expanded === order.id;
              return (
                <div key={order.id} className="overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-200 hover:shadow-md">
                  {/* Header row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-5">
                    <div className="space-y-1">
                      <p className="font-bold text-green-700 text-sm">{order.id}</p>
                      <p className="text-xs text-muted-foreground">Placed on {formatDate(order.date)}</p>
                      <p className="text-xs text-muted-foreground">{order.method}</p>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{order.items.length} item(s)</p>
                        <p className="text-base font-bold text-green-700">{formatPrice(order.total)}</p>
                      </div>
                      <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${cfg.className}`}>
                        {cfg.icon} {cfg.label}
                      </span>
                      <button
                        onClick={() => setExpanded(isExpanded ? null : order.id)}
                        className="flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-semibold hover:bg-gray-50 transition-colors"
                      >
                        {isExpanded ? 'Hide' : 'View Details'}
                        {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="border-t bg-gray-50 px-5 py-4 space-y-4">
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Order Items</p>
                        <div className="space-y-1.5">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <span className="text-gray-700">
                                {item.name}
                                <span className="ml-1 text-muted-foreground text-xs">× {item.qty}</span>
                              </span>
                              <span className="font-semibold">{formatPrice(item.price * item.qty)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 flex justify-between border-t pt-2 text-sm font-bold">
                          <span>Order Total</span>
                          <span className="text-green-700">{formatPrice(order.total)}</span>
                        </div>
                      </div>
                      {order.address && (
                        <div className="rounded-xl bg-white border p-3">
                          <p className="text-xs font-bold text-gray-500 uppercase mb-1">Delivery Address</p>
                          <p className="text-sm text-gray-600">{order.address}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
