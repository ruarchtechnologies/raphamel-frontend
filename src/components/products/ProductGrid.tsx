'use client';

import { useState } from 'react';
import { LayoutGrid, LayoutList, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { ProductCard, type ProductCardData } from './ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Spinner';
import { cn } from '@/lib/utils';

const SORT_OPTIONS = [
  { label: 'Newest',       value: 'newest' },
  { label: 'Price: Low→High', value: 'price_asc' },
  { label: 'Price: High→Low', value: 'price_desc' },
  { label: 'Best Rating',  value: 'rating' },
  { label: 'Most Popular', value: 'popular' },
];

interface ProductGridProps {
  products: ProductCardData[];
  total?: number;
  loading?: boolean;
  columns?: 2 | 3 | 4 | 5;
  showToolbar?: boolean;
  onSortChange?: (sort: string) => void;
  onFilterOpen?: () => void;
}

const colClass = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
};

export function ProductGrid({
  products,
  total,
  loading = false,
  columns = 4,
  showToolbar = true,
  onSortChange,
  onFilterOpen,
}: ProductGridProps) {
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [sortOpen, setSortOpen] = useState(false);
  const [activeSort, setActiveSort] = useState('newest');

  const handleSort = (value: string) => {
    setActiveSort(value);
    setSortOpen(false);
    onSortChange?.(value);
  };

  return (
    <div>
      {/* Toolbar */}
      {showToolbar && (
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {onFilterOpen && (
              <button
                onClick={onFilterOpen}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors lg:hidden"
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>
            )}
            {total !== undefined && (
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">{total}</span> products
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 h-9 px-3 text-sm font-medium border border-gray-200 rounded-[6px] hover:border-gray-300 bg-white text-gray-700 transition-colors"
              >
                Sort: {SORT_OPTIONS.find((o) => o.value === activeSort)?.label}
                <ChevronDown size={14} className={cn('transition-transform', sortOpen && 'rotate-180')} />
              </button>
              {sortOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-100 rounded-[8px] shadow-lg py-1 z-20 min-w-[180px] animate-slide-down">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleSort(opt.value)}
                      className={cn(
                        'w-full text-left px-4 py-2 text-sm transition-colors',
                        activeSort === opt.value
                          ? 'text-primary font-medium bg-blue-50'
                          : 'text-gray-700 hover:bg-gray-50',
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Layout toggle */}
            <div className="hidden sm:flex items-center border border-gray-200 rounded-[6px] overflow-hidden">
              <button
                onClick={() => setLayout('grid')}
                className={cn(
                  'h-9 w-9 flex items-center justify-center transition-colors',
                  layout === 'grid' ? 'bg-primary text-white' : 'bg-white text-gray-500 hover:bg-gray-50',
                )}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setLayout('list')}
                className={cn(
                  'h-9 w-9 flex items-center justify-center transition-colors border-l border-gray-200',
                  layout === 'list' ? 'bg-primary text-white' : 'bg-white text-gray-500 hover:bg-gray-50',
                )}
              >
                <LayoutList size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid / List */}
      {loading ? (
        <div className={cn('grid gap-4', colClass[columns])}>
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No products found</h3>
          <p className="text-sm text-gray-500">Try adjusting your filters or search terms</p>
        </div>
      ) : layout === 'list' ? (
        <div className="space-y-3">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} layout="list" index={i} />
          ))}
        </div>
      ) : (
        <div className={cn('grid gap-4 md:gap-5', colClass[columns])}>
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} layout="grid" index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
