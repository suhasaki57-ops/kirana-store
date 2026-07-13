'use client';
import { useState } from 'react';
import { formatPrice, formatDate } from '@/lib/utils';
import { Search, ShieldOff, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

interface Customer {
  id: string; name: string; email: string; phone: string;
  orders: number; spent: number; joined: string; status: 'active'|'banned';
}

const INIT_CUSTOMERS: Customer[] = [
  { id:'1', name:'Ramesh Kumar',  email:'ramesh@example.com',  phone:'9876543210', orders:12, spent:8640,  joined:'2024-01-15', status:'active' },
  { id:'2', name:'Priya Sharma',  email:'priya@example.com',   phone:'9823456789', orders:7,  spent:3920,  joined:'2024-02-20', status:'active' },
  { id:'3', name:'Amit Patel',    email:'amit@example.com',    phone:'9712345678', orders:23, spent:14560, joined:'2023-11-08', status:'active' },
  { id:'4', name:'Sunita Devi',   email:'sunita@example.com',  phone:'9601234567', orders:4,  spent:1840,  joined:'2024-05-01', status:'active' },
  { id:'5', name:'Rajesh Singh',  email:'rajesh@example.com',  phone:'9534567890', orders:15, spent:9200,  joined:'2024-03-12', status:'banned' },
  { id:'6', name:'Meena Joshi',   email:'meena@example.com',   phone:'9445678901', orders:9,  spent:5430,  joined:'2024-04-22', status:'active' },
  { id:'7', name:'Karan Mehta',   email:'karan@example.com',   phone:'9356789012', orders:2,  spent:760,   joined:'2025-01-10', status:'active' },
  { id:'8', name:'Divya Rao',     email:'divya@example.com',   phone:'9267890123', orders:18, spent:11280, joined:'2023-09-30', status:'active' },
];

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(INIT_CUSTOMERS);
  const [search, setSearch]       = useState('');

  const toggleBan = (id: string) => {
    setCustomers(p => p.map(c => {
      if (c.id !== id) return c;
      const next = c.status === 'active' ? 'banned' : 'active';
      toast.success(`Customer ${next === 'banned' ? 'banned' : 'unbanned'} successfully`);
      return { ...c, status: next };
    }));
  };

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-sm text-muted-foreground">{customers.length} total customers registered</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="pl-9 pr-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-green-500 w-64" />
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label:'Total',   value: customers.length,                       color:'text-gray-700' },
          { label:'Active',  value: customers.filter(c=>c.status==='active').length, color:'text-green-700' },
          { label:'Banned',  value: customers.filter(c=>c.status==='banned').length, color:'text-red-700' },
          { label:'Revenue', value: formatPrice(customers.reduce((s,c)=>s+c.spent,0)), color:'text-blue-700' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border bg-white p-4 shadow-sm text-center">
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Customer','Email & Phone','Orders','Total Spent','Joined','Status','Action'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="py-10 text-center text-muted-foreground">No customers found</td></tr>
            ) : filtered.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                      {c.name.charAt(0)}
                    </div>
                    <p className="font-semibold">{c.name}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-xs">{c.email}</p>
                  <p className="text-xs text-muted-foreground">{c.phone}</p>
                </td>
                <td className="px-4 py-3 font-semibold">{c.orders}</td>
                <td className="px-4 py-3 font-bold text-green-700">{formatPrice(c.spent)}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{formatDate(c.joined)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold
                    ${c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleBan(c.id)}
                    className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold border transition-colors
                      ${c.status === 'active'
                        ? 'border-red-200 text-red-600 hover:bg-red-50'
                        : 'border-green-200 text-green-700 hover:bg-green-50'}`}>
                    {c.status === 'active'
                      ? <><ShieldOff className="h-3.5 w-3.5" /> Ban</>
                      : <><ShieldCheck className="h-3.5 w-3.5" /> Unban</>}
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
