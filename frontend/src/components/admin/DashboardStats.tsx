'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { TrendingUp, ShoppingCart, Package, Users } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export function DashboardStats() {
  const { orders }   = useSelector((s: RootState) => s.orders);
  const { products } = useSelector((s: RootState) => s.productsAdmin);

  // Prevent SSR/client hydration mismatch by only rendering real values on client
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const stats = useMemo(() => {
    const totalRevenue      = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrders       = orders.length;
    const totalProducts     = products.length;
    const uniqueCustomers   = new Set(orders.map((o) => o.email || o.customer)).size || 0;

    return [
      {
        label: 'Total Revenue',
        value: formatPrice(totalRevenue),
        change: '+18.2%',
        icon: TrendingUp,
        bg: 'bg-green-100',
        color: 'text-green-700',
      },
      {
        label: 'Total Orders',
        value: String(totalOrders),
        change: '+12.5%',
        icon: ShoppingCart,
        bg: 'bg-blue-100',
        color: 'text-blue-700',
      },
      {
        label: 'Total Products',
        value: String(totalProducts),
        change: '+4.3%',
        icon: Package,
        bg: 'bg-purple-100',
        color: 'text-purple-700',
      },
      {
        label: 'Customers',
        value: String(uniqueCustomers),
        change: '+9.1%',
        icon: Users,
        bg: 'bg-orange-100',
        color: 'text-orange-700',
      },
    ];
  }, [orders, products]);

  // Static placeholder values shown on server (prevents mismatch)
  const placeholder = [
    { label: 'Total Revenue',  value: '₹0',  change: '+18.2%', icon: TrendingUp,  bg: 'bg-green-100',  color: 'text-green-700'  },
    { label: 'Total Orders',   value: '0',   change: '+12.5%', icon: ShoppingCart,bg: 'bg-blue-100',   color: 'text-blue-700'   },
    { label: 'Total Products', value: '0',   change: '+4.3%',  icon: Package,     bg: 'bg-purple-100', color: 'text-purple-700' },
    { label: 'Customers',      value: '0',   change: '+9.1%',  icon: Users,       bg: 'bg-orange-100', color: 'text-orange-700' },
  ];

  const display = mounted ? stats : placeholder;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {display.map(({ label, value, change, icon: Icon, bg, color }) => (
        <div key={label} className="rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {label}
              </p>
              <p className="mt-1 text-2xl font-bold">{value}</p>
              <p className="mt-1 text-xs font-semibold text-green-600">
                {change} this month
              </p>
            </div>
            <div className={`rounded-full p-3 ${bg}`}>
              <Icon className={`h-6 w-6 ${color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
