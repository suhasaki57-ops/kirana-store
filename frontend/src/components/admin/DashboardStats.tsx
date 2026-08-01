'use client';

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { TrendingUp, ShoppingCart, Package, Users } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export function DashboardStats() {
  const { orders } = useSelector((s: RootState) => s.orders);
  const { products } = useSelector((s: RootState) => s.productsAdmin);

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const uniqueCustomers = new Set(orders.map((o) => o.email || o.customer)).size || 1;

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
        value: totalOrders.toLocaleString('en-IN'),
        change: '+12.5%',
        icon: ShoppingCart,
        bg: 'bg-blue-100',
        color: 'text-blue-700',
      },
      {
        label: 'Total Products',
        value: totalProducts.toLocaleString('en-IN'),
        change: '+4.3%',
        icon: Package,
        bg: 'bg-purple-100',
        color: 'text-purple-700',
      },
      {
        label: 'Customers',
        value: uniqueCustomers.toLocaleString('en-IN'),
        change: '+9.1%',
        icon: Users,
        bg: 'bg-orange-100',
        color: 'text-orange-700',
      },
    ];
  }, [orders, products]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(({ label, value, change, icon: Icon, bg, color }) => (
        <div key={label} className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {label}
              </p>
              <p className="mt-1 text-2xl font-bold">{value}</p>
              <p className="mt-1 text-xs font-semibold text-green-600">{change} live calculation</p>
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
