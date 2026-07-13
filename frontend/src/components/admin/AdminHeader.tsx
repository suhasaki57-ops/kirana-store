'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, LogOut, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';

export function AdminHeader() {
  const router   = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((s: RootState) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out');
    router.push('/login');
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm">
      <div>
        <h2 className="text-base font-semibold text-gray-800">Admin Dashboard</h2>
        <p className="text-xs text-muted-foreground">Kirana Store Management</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <Link href="/" className="text-xs text-green-700 hover:underline">View Store</Link>
        <div className="flex items-center gap-2 rounded-lg border bg-gray-50 px-3 py-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
            {user?.name?.charAt(0).toUpperCase() ?? 'A'}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold leading-tight">{user?.name ?? 'Admin'}</p>
            <p className="text-[10px] text-muted-foreground">Administrator</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors">
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
