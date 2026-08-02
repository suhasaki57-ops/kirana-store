'use client';

import { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { formatPrice } from '@/lib/utils';

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// Fixed base distribution — same on server and client (no Redux dependency)
const BASE = [1500, 2200, 1800, 3100, 2800, 4200, 3900, 4800, 4100, 5200, 5800, 6400];
const BASE_TOTAL = BASE.reduce((a, b) => a + b, 0);

export function SalesChart() {
  const { orders } = useSelector((s: RootState) => s.orders);

  // Only true on the client — prevents SSR/client HTML mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const { monthlyData, totalSales } = useMemo(() => {
    if (!mounted) {
      // Server render — use static base values only (no Redux)
      return { monthlyData: BASE, totalSales: BASE_TOTAL };
    }

    const data = new Array(12).fill(0);
    orders.forEach((o) => {
      const date = o.date ? new Date(o.date) : new Date();
      const idx  = date.getMonth();
      if (idx >= 0 && idx < 12) data[idx] += o.total || 0;
    });

    const combined = data.map((val, i) => val + BASE[i]);
    const total    = combined.reduce((a, b) => a + b, 0);
    return { monthlyData: combined, totalSales: total };
  }, [orders, mounted]);

  const max = Math.max(...monthlyData, 100);

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Sales Overview</h3>
          <p className="text-xs text-muted-foreground">Monthly revenue (INR)</p>
        </div>
        <span className="text-sm font-bold text-green-700">
          {formatPrice(totalSales)}
        </span>
      </div>

      <div className="flex h-48 items-end gap-1">
        {monthlyData.map((v, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1 group relative">
            {/* Tooltip — only rendered on client so no hydration issue */}
            {mounted && (
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-[10px] rounded px-1.5 py-0.5 whitespace-nowrap z-10">
                {formatPrice(v)}
              </div>
            )}
            <div
              className="w-full rounded-t bg-green-500 hover:bg-green-600 transition-all cursor-pointer"
              style={{ height: `${(v / max) * 100}%` }}
            />
            <span className="text-[9px] text-muted-foreground">{months[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
