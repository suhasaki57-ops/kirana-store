'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { SalesChart } from '@/components/admin/SalesChart';
import { RecentOrders } from '@/components/admin/RecentOrders';
import { PlusCircle, ShoppingCart, Users, Package } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const quickActions = [
  { label:'Add Product',      href:'/admin/products/add', icon: PlusCircle, color:'bg-green-600' },
  { label:'View Orders',      href:'/admin/orders',       icon: ShoppingCart, color:'bg-blue-600' },
  { label:'View Customers',   href:'/admin/customers',    icon: Users,       color:'bg-purple-600' },
  { label:'All Products',     href:'/admin/products',     icon: Package,     color:'bg-orange-600' },
];

export default function AdminDashboard() {
  const { user } = useSelector((s: RootState) => s.auth);
  const [today, setToday] = useState('');

  useEffect(() => {
    setToday(new Date().toLocaleDateString('en-IN', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    }));
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back, {user?.name?.split(' ')[0] ?? 'Admin'}! 👋
          </h1>
          <p className="text-sm text-muted-foreground">{today}</p>
        </div>
        <Link href="/admin/products/add"
          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors">
          <PlusCircle className="h-4 w-4" />
          Add New Product
        </Link>
      </div>

      {/* Stats */}
      <DashboardStats />

      {/* Quick actions */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-700 uppercase tracking-wide">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickActions.map(({ label, href, icon: Icon, color }) => (
            <Link key={href} href={href}
              className={`flex flex-col items-center justify-center gap-2 rounded-xl py-5 text-white font-semibold text-sm shadow-sm hover:opacity-90 transition-opacity ${color}`}>
              <Icon className="h-6 w-6" />
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Charts + Recent orders */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SalesChart />
        <RecentOrders />
      </div>
    </div>
  );
}
