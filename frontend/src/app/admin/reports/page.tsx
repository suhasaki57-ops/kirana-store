'use client';
import { formatPrice } from '@/lib/utils';

const monthly = [
  { month:'January',  orders:145, revenue:78500,  products:890  },
  { month:'February', orders:168, revenue:91200,  products:1020 },
  { month:'March',    orders:192, revenue:105600, products:1180 },
  { month:'April',    orders:210, revenue:118900, products:1350 },
  { month:'May',      orders:185, revenue:98700,  products:1150 },
  { month:'June',     orders:230, revenue:132400, products:1520 },
  { month:'July',     orders:256, revenue:148200, products:1690 },
];

const topProducts = [
  { name:'India Gate Basmati Rice 5kg', sold:892, revenue:444908 },
  { name:'Amul Pure Ghee 500ml',        sold:645, revenue:190275 },
  { name:'Tata Salt Iodised 1kg',       sold:1200, revenue:33600 },
  { name:'Tata Chai Premium Tea 500g',  sold:780, revenue:183300 },
  { name:'Parle-G Biscuits 1kg',        sold:1050, revenue:89250 },
];

export default function AdminReportsPage() {
  const totalRevenue = monthly.reduce((s,m) => s+m.revenue,0);
  const totalOrders  = monthly.reduce((s,m) => s+m.orders,0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Sales Reports</h1>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-sm text-center">
          <p className="text-2xl font-bold text-green-700">{formatPrice(totalRevenue)}</p>
          <p className="text-xs text-muted-foreground mt-1">Total Revenue (2025)</p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm text-center">
          <p className="text-2xl font-bold text-blue-700">{totalOrders.toLocaleString('en-IN')}</p>
          <p className="text-xs text-muted-foreground mt-1">Total Orders (2025)</p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm text-center">
          <p className="text-2xl font-bold text-purple-700">{formatPrice(Math.round(totalRevenue/totalOrders))}</p>
          <p className="text-xs text-muted-foreground mt-1">Average Order Value</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Monthly table */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold">Monthly Breakdown</h3>
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Month','Orders','Revenue','Items Sold'].map(h => (
                  <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {monthly.map(m => (
                <tr key={m.month} className="hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium">{m.month}</td>
                  <td className="px-3 py-2">{m.orders}</td>
                  <td className="px-3 py-2 font-semibold text-green-700">{formatPrice(m.revenue)}</td>
                  <td className="px-3 py-2">{m.products.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top products */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold">Top Selling Products</h3>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white
                    ${i===0?'bg-yellow-500':i===1?'bg-gray-400':i===2?'bg-amber-600':'bg-green-600'}`}>
                    {i+1}
                  </span>
                  <p className="text-sm font-medium line-clamp-1">{p.name}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-green-700">{formatPrice(p.revenue)}</p>
                  <p className="text-xs text-muted-foreground">{p.sold} sold</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
