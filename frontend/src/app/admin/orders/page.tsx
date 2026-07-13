'use client';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { updateOrderStatus, type OrderStatus } from '@/store/slices/ordersSlice';
import { useState } from 'react';
import { formatPrice, formatDate } from '@/lib/utils';
import { Search, Package } from 'lucide-react';

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending:    'bg-yellow-100 text-yellow-800',
  confirmed:  'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  packed:     'bg-orange-100 text-orange-800',
  shipped:    'bg-indigo-100 text-indigo-800',
  delivered:  'bg-green-100 text-green-800',
  cancelled:  'bg-red-100 text-red-800',
};

const STATUSES: OrderStatus[] = ['pending','confirmed','processing','packed','shipped','delivered','cancelled'];
const TABS: (OrderStatus|'all')[] = ['all','pending','confirmed','shipped','delivered','cancelled'];

export default function AdminOrdersPage() {
  const dispatch  = useDispatch();
  const orders    = useSelector((s: RootState) => s.orders.orders);
  const [tab,     setTab]    = useState<OrderStatus|'all'>('all');
  const [search,  setSearch] = useState('');

  const filtered = orders.filter(o => {
    const matchTab = tab === 'all' || o.status === tab;
    const matchSearch = !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Orders Management</h1>
          <p className="text-sm text-muted-foreground">{orders.length} total orders</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search order ID or customer..."
            className="pl-9 pr-3 py-2 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-green-500 w-64 bg-white shadow-sm" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-all duration-150 active:scale-95
              ${tab === t ? 'bg-green-600 text-white shadow-sm' : 'bg-white border text-gray-600 hover:border-green-400 hover:text-green-700'}`}>
            {t}
            <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold
              ${tab === t ? 'bg-white/20' : 'bg-gray-100'}`}>
              {t === 'all' ? orders.length : orders.filter(o => o.status === t).length}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Order #','Customer','Items','Total','Payment','Date','Status','Update Status'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-14 text-center">
                  <Package className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                  <p className="text-gray-400 font-medium">No orders found</p>
                </td>
              </tr>
            ) : filtered.map(o => (
              <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-bold text-green-700">{o.id}</td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-sm">{o.customer}</p>
                  <p className="text-xs text-muted-foreground">{o.phone}</p>
                </td>
                <td className="px-4 py-3 max-w-[160px]">
                  <p className="truncate text-xs text-gray-600">{o.itemsSummary}</p>
                </td>
                <td className="px-4 py-3 font-bold text-green-700">{formatPrice(o.total)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${o.method === 'COD' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                    {o.method}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{formatDate(o.date)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${STATUS_COLORS[o.status]}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={o.status}
                    onChange={e => dispatch(updateOrderStatus({ id: o.id, status: e.target.value as OrderStatus }))}
                    className="rounded-lg border px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-green-500 cursor-pointer bg-white shadow-sm">
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
