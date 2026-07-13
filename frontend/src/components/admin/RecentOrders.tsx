'use client';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

const orders = [
  { id:'ORD-001', customer:'Ramesh Kumar',   total:1293, status:'delivered',  method:'COD' },
  { id:'ORD-002', customer:'Priya Sharma',   total:567,  status:'pending',    method:'Online' },
  { id:'ORD-003', customer:'Amit Patel',     total:840,  status:'shipped',    method:'Online' },
  { id:'ORD-004', customer:'Sunita Devi',    total:325,  status:'confirmed',  method:'COD' },
  { id:'ORD-005', customer:'Rajesh Singh',   total:1120, status:'delivered',  method:'Online' },
];

const statusCls: Record<string, string> = {
  delivered: 'bg-green-100 text-green-700',
  pending:   'bg-yellow-100 text-yellow-700',
  shipped:   'bg-blue-100 text-blue-700',
  confirmed: 'bg-indigo-100 text-indigo-700',
  cancelled: 'bg-red-100 text-red-700',
};

export function RecentOrders() {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">Recent Orders</h3>
        <Link href="/admin/orders" className="text-xs text-green-700 font-medium hover:underline">View All</Link>
      </div>
      <div className="space-y-3">
        {orders.map(o => (
          <div key={o.id} className="flex items-center justify-between gap-3 border-b pb-3 last:border-0 last:pb-0">
            <div>
              <p className="text-sm font-semibold">{o.id}</p>
              <p className="text-xs text-muted-foreground">{o.customer} · {o.method}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-green-700">{formatPrice(o.total)}</p>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusCls[o.status] ?? ''}`}>
                {o.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
