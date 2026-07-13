'use client';
import { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Coupon {
  id: string; code: string; type: 'percentage'|'fixed'; value: number;
  minOrder: number; uses: number; limit: number; status: 'active'|'inactive';
}

const INIT: Coupon[] = [
  { id:'1', code:'KIRANA10', type:'percentage', value:10, minOrder:200, uses:45,  limit:500, status:'active'   },
  { id:'2', code:'SAVE50',   type:'fixed',      value:50, minOrder:500, uses:12,  limit:200, status:'active'   },
  { id:'3', code:'NAYA100',  type:'fixed',      value:100,minOrder:999, uses:8,   limit:300, status:'active'   },
  { id:'4', code:'OFF20',    type:'percentage', value:20, minOrder:300, uses:100, limit:100, status:'inactive' },
];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(INIT);
  const [adding, setAdding]   = useState(false);
  const [form, setForm]       = useState({ code:'', type:'percentage' as 'percentage'|'fixed', value:'', minOrder:'', limit:'' });

  const addCoupon = () => {
    if (!form.code || !form.value) { toast.error('Fill all required fields'); return; }
    setCoupons(p => [...p, {
      id: Date.now().toString(), code: form.code.toUpperCase(),
      type: form.type, value: Number(form.value),
      minOrder: Number(form.minOrder)||0, uses: 0, limit: Number(form.limit)||999,
      status: 'active',
    }]);
    setAdding(false);
    setForm({ code:'', type:'percentage', value:'', minOrder:'', limit:'' });
    toast.success('Coupon created!');
  };

  const deleteCoupon = (id: string) => {
    setCoupons(p => p.filter(c => c.id !== id));
    toast.success('Coupon deleted');
  };

  const toggleStatus = (id: string) =>
    setCoupons(p => p.map(c => c.id===id ? {...c, status: c.status==='active'?'inactive':'active'} : c));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <button onClick={() => setAdding(true)}
          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700">
          <PlusCircle className="h-4 w-4" /> Create Coupon
        </button>
      </div>

      {adding && (
        <div className="rounded-xl border bg-white p-5 shadow-sm space-y-4">
          <h3 className="font-semibold">Create New Coupon</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs font-medium">Coupon Code *</label>
              <input value={form.code} onChange={e => setForm(p => ({...p, code: e.target.value.toUpperCase()}))}
                placeholder="SAVE10"
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm uppercase outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="text-xs font-medium">Type</label>
              <select value={form.type} onChange={e => setForm(p => ({...p, type: e.target.value as 'percentage'|'fixed'}))}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium">Value *</label>
              <input type="number" value={form.value} onChange={e => setForm(p => ({...p, value: e.target.value}))}
                placeholder={form.type==='percentage'?'10':'50'}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="text-xs font-medium">Min Order (₹)</label>
              <input type="number" value={form.minOrder} onChange={e => setForm(p => ({...p, minOrder: e.target.value}))}
                placeholder="200"
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="text-xs font-medium">Usage Limit</label>
              <input type="number" value={form.limit} onChange={e => setForm(p => ({...p, limit: e.target.value}))}
                placeholder="500"
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={addCoupon} className="rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700">Create</button>
            <button onClick={() => setAdding(false)} className="rounded-lg border px-5 py-2 text-sm font-medium hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Code','Type','Discount','Min Order','Usage','Status','Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {coupons.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-bold text-green-700">{c.code}</td>
                <td className="px-4 py-3 capitalize text-xs">{c.type}</td>
                <td className="px-4 py-3 font-semibold">
                  {c.type === 'percentage' ? `${c.value}%` : formatPrice(c.value)}
                </td>
                <td className="px-4 py-3">{formatPrice(c.minOrder)}</td>
                <td className="px-4 py-3">{c.uses} / {c.limit}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleStatus(c.id)}
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold cursor-pointer
                      ${c.status==='active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {c.status}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => deleteCoupon(c.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-red-200 hover:bg-red-50">
                    <Trash2 className="h-3.5 w-3.5 text-red-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
