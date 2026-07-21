'use client';

import { useTransition, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { label: 'All Collections', value: 'all' },
  { label: 'Protein Bars',    value: 'protein-bars' },
  { label: 'Nuts & Seeds',    value: 'nuts-seeds' },
  { label: 'Combos',          value: 'combos' },
] as const;

const SORT_OPTIONS = [
  { label: 'Best Sellers',     value: 'best-sellers' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest Arrival',   value: 'newest' },
] as const;

function ShopFiltersBarContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeCategory = searchParams.get('category') ?? 'all';
  const activeSort = searchParams.get('sort') ?? 'best-sellers';

  function updateParam(key: string, value: string) {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === 'all' && key === 'category') {
        params.delete('category');
      } else {
        params.set(key, value);
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <div
      className={cn(
        'sticky top-20 z-40',
        'bg-[#121317]/95 backdrop-blur-md',
        'border-y border-[#594045]/30',
        'py-4 px-6 mb-12',
        isPending && 'opacity-60 pointer-events-none',
        'transition-opacity duration-150',
      )}
      aria-label="Shop filters"
    >
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* ── Category Filter Chips ─────────────────────────────── */}
        <div
          className="flex overflow-x-auto gap-3 w-full md:w-auto pb-1 md:pb-0"
          role="group"
          aria-label="Filter by category"
          style={{ scrollbarWidth: 'none' }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => updateParam('category', cat.value)}
                aria-pressed={isActive}
                className={cn(
                  'px-6 py-2 font-body text-label-bold text-sm tracking-widest uppercase whitespace-nowrap',
                  'transition-all duration-200 active:scale-95',
                  isActive
                    ? 'bg-[#c41e5c] text-[#ffdee3] rounded-full'
                    : 'border border-[#594045]/50 hover:border-[#c41e5c] text-[#e1bec3] hover:text-white',
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* ── Sort Dropdown ─────────────────────────────────────── */}
        <div className="relative w-full md:w-auto">
          <select
            value={activeSort}
            onChange={(e) => updateParam('sort', e.target.value)}
            aria-label="Sort products"
            className={cn(
              'appearance-none w-full',
              'bg-[#1e1f23] border border-[#594045]/30',
              'text-[#e3e2e7] px-6 py-2 pr-10 rounded-full',
              'font-body text-label-bold text-xs tracking-widest uppercase',
              'focus:ring-2 focus:ring-[#c41e5c] focus:outline-none cursor-pointer',
            )}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                Sort By: {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#e1bec3]"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}

export function ShopFiltersBar() {
  return (
    <Suspense fallback={
      <div className="sticky top-20 z-40 bg-[#121317]/95 border-y border-[#594045]/30 py-4 px-6 mb-12 h-[72px]" />
    }>
      <ShopFiltersBarContent />
    </Suspense>
  );
}
