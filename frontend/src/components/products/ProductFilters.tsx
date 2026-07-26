'use client';

import { useState } from 'react';
import { SlidersHorizontal, ChevronDown, ChevronUp, Star, RotateCcw, Check } from 'lucide-react';

const CATEGORIES = [
  { name: 'Grains & Pulses',    slug: 'grains-pulses',    emoji: '🌾', count: 85 },
  { name: 'Spices & Masala',    slug: 'spices-masala',    emoji: '🌶️', count: 120 },
  { name: 'Oils & Ghee',        slug: 'oils-ghee',        emoji: '🫙', count: 45 },
  { name: 'Cleaning & Home',    slug: 'cleaning-home',    emoji: '🧹', count: 70 },
  { name: 'Personal Care',      slug: 'personal-care',    emoji: '🧴', count: 95 },
  { name: 'Snacks & Beverages', slug: 'snacks-beverages', emoji: '🍵', count: 110 },
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

export function ProductFilters({
  cats,
  setCats,
  maxPrice,
  setMaxPrice,
  minRating,
  setMinRating,
  activeCount,
  onClear,
}: Props) {
  const [openCat, setOpenCat] = useState(true);
  const [openPrice, setOpenPrice] = useState(true);
  const [openRating, setOpenRating] = useState(true);

  const toggleCat = (catName: string, catSlug: string) => {
    const isSelected = cats.some(
      (c) => c.toLowerCase() === catName.toLowerCase() || c.toLowerCase() === catSlug.toLowerCase()
    );
    if (isSelected) {
      setCats(
        cats.filter(
          (c) => c.toLowerCase() !== catName.toLowerCase() && c.toLowerCase() !== catSlug.toLowerCase()
        )
      );
    } else {
      setCats([...cats, catName]);
    }
  };

  return (
    <div className="rounded-2xl border bg-white shadow-sm overflow-hidden sticky top-20">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-gradient-to-r from-green-50 to-white px-4 py-3.5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white shadow-sm">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">Filters</h3>
          {activeCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-[11px] font-bold text-white shadow-xs">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Clear All
          </button>
        )}
      </div>

      <div className="divide-y divide-gray-100">
        {/* ── Categories ─────────────────────────────── */}
        <div>
          <button
            onClick={() => setOpenCat(!openCat)}
            className="flex w-full items-center justify-between px-4 py-3 hover:bg-gray-50/80 transition-colors"
          >
            <span className="text-sm font-bold text-gray-800">Category</span>
            {openCat ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
          </button>

          {openCat && (
            <div className="space-y-1 px-3 pb-3">
              {CATEGORIES.map(({ name, slug, emoji, count }) => {
                const active = cats.some(
                  (c) => c.toLowerCase() === name.toLowerCase() || c.toLowerCase() === slug.toLowerCase()
                );
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggleCat(name, slug)}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-all duration-150 active:scale-[0.98] ${
                      active
                        ? 'bg-green-600 text-white font-semibold shadow-sm'
                        : 'text-gray-700 hover:bg-green-50 hover:text-green-800'
                    }`}
                  >
                    <span className="text-lg leading-none">{emoji}</span>
                    <span className="flex-1 text-left">{name}</span>
                    {active && <Check className="h-4 w-4 text-white mr-1 shrink-0" />}
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
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
            className="flex w-full items-center justify-between px-4 py-3 hover:bg-gray-50/80 transition-colors"
          >
            <span className="text-sm font-bold text-gray-800">Price Range</span>
            {openPrice ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
          </button>

          {openPrice && (
            <div className="px-4 pb-4 space-y-3.5">
              {/* Range Slider */}
              <div className="space-y-2">
                <input
                  type="range"
                  min={30}
                  max={600}
                  step={10}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600 focus:outline-none"
                />
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-500">₹0</span>
                  <span className="font-bold text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full">
                    Up to ₹{maxPrice}
                  </span>
                </div>
              </div>

              {/* Quick price chips */}
              <div className="flex gap-1.5 flex-wrap">
                {[100, 200, 300, 500].map((p) => {
                  const active = maxPrice === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setMaxPrice(active ? 600 : p)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold border transition-all duration-150 active:scale-95 ${
                        active
                          ? 'bg-green-600 text-white border-green-600 shadow-xs'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-green-400 hover:bg-green-50 hover:text-green-700'
                      }`}
                    >
                      Under ₹{p}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Customer Rating ─────────────────────────── */}
        <div>
          <button
            onClick={() => setOpenRating(!openRating)}
            className="flex w-full items-center justify-between px-4 py-3 hover:bg-gray-50/80 transition-colors"
          >
            <span className="text-sm font-bold text-gray-800">Customer Rating</span>
            {openRating ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
          </button>

          {openRating && (
            <div className="space-y-1.5 px-3 pb-3">
              {[4, 3, 2, 1].map((r) => {
                const active = minRating === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setMinRating(active ? 0 : r)}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-all duration-150 active:scale-[0.98] ${
                      active
                        ? 'bg-yellow-50 border border-yellow-300 text-yellow-900 font-semibold'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i <= r ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium">{r}.0 & above</span>
                    {active && <span className="ml-auto text-[11px] font-bold text-yellow-700">✓ Active</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Reset/Clear Action ────────────────────────────── */}
        <div className="px-4 py-3.5 bg-gray-50/80">
          <button
            type="button"
            onClick={onClear}
            disabled={activeCount === 0}
            className={`w-full rounded-xl py-2.5 text-sm font-bold transition-all duration-200 ${
              activeCount > 0
                ? 'bg-green-600 text-white hover:bg-green-700 shadow-sm active:scale-[0.98]'
                : 'border border-gray-200 bg-white text-gray-400 cursor-not-allowed'
            }`}
          >
            {activeCount > 0 ? `Reset All Filters (${activeCount})` : 'Filters Applied'}
          </button>
        </div>
      </div>
    </div>
  );
}
