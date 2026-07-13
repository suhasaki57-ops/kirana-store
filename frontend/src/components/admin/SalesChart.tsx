'use client';
import { formatPrice } from '@/lib/utils';

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const data    = [28000,34000,31000,45000,38000,52000,47000,61000,55000,68000,72000,84000];
const max     = Math.max(...data);

export function SalesChart() {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Sales Overview</h3>
          <p className="text-xs text-muted-foreground">Monthly revenue (INR)</p>
        </div>
        <span className="text-sm font-bold text-green-700">{formatPrice(data.reduce((a,b)=>a+b,0))}</span>
      </div>
      <div className="flex h-48 items-end gap-1">
        {data.map((v, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1 group relative">
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-[10px] rounded px-1.5 py-0.5 whitespace-nowrap z-10">
              {formatPrice(v)}
            </div>
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
