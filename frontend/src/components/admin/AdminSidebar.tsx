'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, PlusCircle, ShoppingCart,
  Users, Tag, Ticket, Image as ImageIcon,
  BarChart3, Settings,
} from 'lucide-react';

const nav = [
  { label:'Dashboard',    href:'/admin',                 icon: LayoutDashboard },
  { label:'Products',     href:'/admin/products',        icon: Package },
  { label:'Add Product',  href:'/admin/products/add',    icon: PlusCircle },
  { label:'Orders',       href:'/admin/orders',          icon: ShoppingCart },
  { label:'Customers',    href:'/admin/customers',       icon: Users },
  { label:'Categories',   href:'/admin/categories',      icon: Tag },
  { label:'Coupons',      href:'/admin/coupons',         icon: Ticket },
  { label:'Banners',      href:'/admin/banners',         icon: ImageIcon },
  { label:'Reports',      href:'/admin/reports',         icon: BarChart3 },
  { label:'Settings',     href:'/admin/settings',        icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r bg-white md:flex">
      <div className="flex h-16 items-center gap-2 border-b px-5">
        <span className="text-xl">🛒</span>
        <div>
          <p className="text-sm font-bold text-green-700 leading-tight">Kirana Store</p>
          <p className="text-[10px] text-muted-foreground">Admin Panel</p>
        </div>
      </div>
      <nav className="flex flex-col gap-0.5 p-3 flex-1 overflow-y-auto">
        {nav.map(({ label, href, icon: Icon }) => (
          <Link key={href} href={href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
              ${isActive(href)
                ? 'bg-green-600 text-white'
                : 'text-gray-600 hover:bg-green-50 hover:text-green-700'}`}>
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="border-t p-4">
        <p className="text-xs text-muted-foreground text-center">Kirana Store v1.0</p>
      </div>
    </aside>
  );
}
