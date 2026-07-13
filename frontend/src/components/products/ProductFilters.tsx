'use client';

import { useState } from 'react';
import { SlidersHorizontal, ChevronDown, ChevronUp, Star, RotateCcw } from 'lucide-react';

const CATEGORIES = [
  { name:'Grains & Pulses',    emoji:'🌾', count:85  },
  { name:'Spices & Masala',    emoji:'🌶️', count:120 },
  { name:'Oils & Ghee',        emoji:'🫙', count:45  },
  { name:'Cleaning & Home',    emoji:'🧹', count:70  },
  { name:'Personal Care',      emoji:'🧴', count:95  },
  { name:'Snacks & Beverages', emoji:'🍵', count:110 },
];

interface Props {
  cats: string[];
  setCats: (cats: string[]) => void;
  maxPrice: number;
  setMaxPrice: (v: number) => void;
  minRating: number;
  setMinRating: (v: number) => void;
  activeCount: number;
  onClear: () => void;
}

export function ProductFilters({ cats, setCats, maxPrice, setMaxPrice, minRating, setMinRating, activeCount, onClear }: Props) {
  const [openCat,    setOpenCat]    = useState(true);
  const [openPrice,  setOpenPrice]  = useState(true);
  const [openRating, setOpenRating] = useState(true);

  const toggleCat = (cat: string) =>
    setCats(cats.includes(cat) ? cats.filter(c => c !== cat) : [...cats, cat]);

  const pricePercent = (maxPrice / 600) * 100;

  return (
    <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-gradient-to-r from-green-50 to-white px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
            <SlidersHorizontal className="h-4 w-4 text-white" />
          </div>
          <h3 className="font-bold text-gray-800">Filters</h3>
          {activeCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button onClick={onClear}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors">
            <RotateCcw className="h-3 w-3" /> Clear All
          </button>
        )}
      </div>

      <div className="divide-y">
        {/* ── Categories ─────────────────────────────── */}
        <div>
          <button
            onClick={() => setOpenCat(!openCat)}
            className="flex w-full items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-semibold text-gray-700">Category</span>
            {openCat ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
          </button>

          {openCat && (
            <div className="space-y-1 px-3 pb-3">
              {CATEGORIES.map(({ name, emoji, count }) => {
                const active = cats.includes(name);
                return (
                  <button key={name} onClick={() => toggleCat(name)}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-all duration-150 active:scale-95
                      ${active
                        ? 'bg-green-600 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-green-50 hover:text-green-700'}`}>
                    <span className="text-base leading-none">{emoji}</span>
                    <span className="flex-1 text-left font-medium">{name}</span>
                    <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold
                      ${active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Price Range ─────────────────────────────── */}
        <div>
          <button
            onClick={() => setOpenPrice(!openPrice)}
            className="flex w-full items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-semibold text-gray-700">Price Range</span>
            {openPrice ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
          </button>

          {openPrice && (
            <div className="px-4 pb-4 space-y-3">
              {/* Track */}
              <div className="relative h-2 rounded-full bg-gray-200">
                <div
                  className="absolute h-2 rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-150"
                  style={{ width: `${pricePercent}%` }}
                />
                <input
                  type="range" min={0} max={600} step={10} value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="absolute inset-0 h-2 w-full cursor-pointer opacity-0"
                />
                {/* Thumb */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-5 w-5 rounded-full border-2 border-green-600 bg-white shadow-md pointer-events-none transition-all duration-150"
                  style={{ left: `${pricePercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">₹0</span>
                <span className="rounded-lg bg-green-600 px-3 py-1 text-xs font-bold text-white">₹{maxPrice}</span>
              </div>

              {/* Quick price buttons */}
              <div className="flex gap-1.5 flex-wrap">
                {[100, 200, 300, 500].map(p => (
                  <button key={p} onClick={() => setMaxPrice(p)}
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold border transition-all duration-150 active:scale-95
                      ${maxPrice === p ? 'bg-green-600 text-white border-green-600' : 'border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-700'}`}>
                    Under ₹{p}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Customer Rating ─────────────────────────── */}
        <div>
          <button
            onClick={() => setOpenRating(!openRating)}
            className="flex w-full items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-semibold text-gray-700">Customer Rating</span>
            {openRating ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
          </button>

          {openRating && (
            <div className="space-y-1 px-3 pb-3">
              {[4, 3, 2, 1].map(r => (
                <button key={r} onClick={() => setMinRating(minRating === r ? 0 : r)}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-all duration-150 active:scale-95
                    ${minRating === r ? 'bg-yellow-50 border border-yellow-300' : 'hover:bg-gray-50'}`}>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i <= r ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-gray-600">{r}.0 & above</span>
                  {minRating === r && (
                    <span className="ml-auto text-[10px] font-bold text-yellow-600">✓ Active</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Apply button ────────────────────────────── */}
        <div className="px-4 py-3 bg-gray-50">
          <button onClick={onClear}
            className="w-full rounded-xl border-2 border-green-600 py-2.5 text-sm font-bold text-green-700 hover:bg-green-600 hover:text-white transition-all duration-200 active:scale-95">
            {activeCount > 0 ? `Clear ${activeCount} Filter${activeCount > 1 ? 's' : ''}` : 'No Active Filters'}
          </button>
        </div>
      </div>
    </div>
  );
}
