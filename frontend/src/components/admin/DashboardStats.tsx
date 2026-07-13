'use client';
import { TrendingUp, ShoppingCart, Package, Users } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const stats = [
  { label:'Total Revenue',   value: formatPrice(124560), change:'+18.2%', icon: TrendingUp, bg:'bg-green-100', color:'text-green-700' },
  { label:'Total Orders',    value: '2,350',             change:'+12.5%', icon: ShoppingCart, bg:'bg-blue-100', color:'text-blue-700' },
  { label:'Total Products',  value: '128',               change:'+4.3%',  icon: Package,   bg:'bg-purple-100', color:'text-purple-700' },
  { label:'Customers',       value: '856',               change:'+9.1%',  icon: Users,     bg:'bg-orange-100', color:'text-orange-700' },
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(({ label, value, change, icon: Icon, bg, color }) => (
        <div key={label} className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
              <p className="mt-1 text-2xl font-bold">{value}</p>
              <p className="mt-1 text-xs font-semibold text-green-600">{change} this month</p>
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
