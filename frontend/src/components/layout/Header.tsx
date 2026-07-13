'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  ShoppingCart, Heart, User, Search, Menu, X,
  ChevronDown, Package, LogOut, LayoutDashboard,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';

const navLinks = [
  { label: 'Home',       href: '/'          },
  { label: 'Products',   href: '/products'  },
  { label: 'Categories', href: '/categories'},
  { label: 'Deals',      href: '/deals'     },
];

export function Header() {
  const router   = useRouter();
  const dispatch = useDispatch();
  const { items }                     = useSelector((s: RootState) => s.cart);
  const { isAuthenticated, user }     = useSelector((s: RootState) => s.auth);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [dropOpen,   setDropOpen]     = useState(false);
  const [query,      setQuery]        = useState('');

  const cartCount = items.reduce((n, i) => n + (i as any).quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/products?search=${encodeURIComponent(query.trim())}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    setDropOpen(false);
    toast.success('Logged out successfully');
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      {/* Promo strip */}
      <div className="bg-green-700 py-1 text-center text-xs text-white">
        Free delivery on orders above ₹500 &nbsp;|&nbsp; Use code{' '}
        <span className="font-bold">KIRANA10</span> for 10% off
      </div>

      <div className="container flex h-16 items-center gap-3">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="text-2xl">🛒</span>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-bold text-green-700">Kirana Store</p>
            <p className="text-[10px] text-muted-foreground">Your Daily Grocery Shop</p>
          </div>
        </Link>

        {/* Desktop search */}
        <form onSubmit={handleSearch} className="hidden flex-1 md:flex max-w-lg">
          <div className="relative flex w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search rice, dal, sugar, soap..."
              className="h-9 w-full rounded-l-md border bg-gray-50 pl-9 pr-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="h-9 rounded-r-md bg-green-600 px-4 text-sm font-semibold text-white hover:bg-green-700"
            >
              Search
            </button>
          </div>
        </form>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-green-700 transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-1">
          {/* Wishlist */}
          <Link href="/wishlist" title="Wishlist"
            className="relative flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100">
            <Heart className="h-5 w-5" />
          </Link>

          {/* Cart */}
          <Link href="/cart" title="Cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-[9px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User dropdown */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setDropOpen(!dropOpen)}
                className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm hover:bg-gray-100"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden max-w-[72px] truncate sm:block text-sm">
                  {user?.name?.split(' ')[0]}
                </span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>

              {dropOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropOpen(false)} />
                  <div className="absolute right-0 top-full z-20 mt-1 w-52 rounded-lg border bg-white shadow-lg">
                    <div className="border-b px-4 py-2.5">
                      <p className="text-sm font-semibold">{user?.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    {user?.role === 'admin' && (
                      <Link href="/admin" onClick={() => setDropOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-green-50">
                        <LayoutDashboard className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-700">Admin Dashboard</span>
                      </Link>
                    )}
                    <Link href="/profile" onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50">
                      <User className="h-4 w-4" /> My Profile
                    </Link>
                    <Link href="/orders" onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50">
                      <Package className="h-4 w-4" /> My Orders
                    </Link>
                    <Link href="/wishlist" onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50">
                      <Heart className="h-4 w-4" /> Wishlist
                    </Link>
                    <div className="border-t">
                      <button onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login"
                className="rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-gray-50">
                Login
              </Link>
              <Link href="/register"
                className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700">
                Register
              </Link>
            </div>
          )}

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100 lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-white px-4 py-3 lg:hidden">
          <form onSubmit={handleSearch} className="mb-3 flex">
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 rounded-l-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500" />
            <button type="submit" className="rounded-r-md bg-green-600 px-3 py-2 text-white">
              <Search className="h-4 w-4" />
            </button>
          </form>
          <nav className="flex flex-col gap-0.5">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-green-50 hover:text-green-700">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
