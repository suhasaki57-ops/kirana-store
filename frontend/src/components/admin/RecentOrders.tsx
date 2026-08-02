'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { formatPrice } from '@/lib/utils';

const statusCls: Record<string, string> = {
  delivered: 'bg-green-100 text-green-700',
  pending:   'bg-yellow-100 text-yellow-700',
  shipped:   'bg-blue-100 text-blue-700',
  confirmed: 'bg-indigo-100 text-indigo-700',
  cancelled: 'bg-red-100 text-red-700',
};

export function RecentOrders() {
  const { orders } = useSelector((s: RootState) => s.orders);

  // Render nothing from Redux on server — only after client mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const recentList = mounted ? orders.slice(0, 5) : [];
  const totalCount = mounted ? orders.length : 0;

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">Recent Orders</h3>
        <Link href="/admin/orders" className="text-xs text-green-700 font-medium hover:underline">
          View All ({totalCount})
        </Link>
      </div>
      <div className="space-y-3">
        {recentList.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            {mounted ? 'No orders placed yet.' : 'Loading...'}
          </p>
        ) : (
          recentList.map((o) => (
            <div
              key={o.id}
              className="flex items-center justify-between gap-3 border-b pb-3 last:border-0 last:pb-0"
            >
              <div>
                <p className="text-sm font-semibold">{o.id}</p>
                <p className="text-xs text-muted-foreground">
                  {o.customer} · {o.method || 'COD'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-green-700">{formatPrice(o.total)}</p>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    statusCls[o.status] ?? 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {o.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
