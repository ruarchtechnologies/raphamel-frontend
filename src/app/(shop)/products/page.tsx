'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/Button';
import { Drawer } from '@/components/layout/Drawer';
import { cn } from '@/lib/utils';
import { useProducts, useProductsByCategory } from '@/features/catalog/hooks/useProducts';
import { HEALTH_CATEGORIES } from '@/domain/entities/category.entity';
import type { ProductEntity } from '@/domain/entities/product.entity';
import type { ProductCardData } from '@/components/products/ProductCard';
import type { ProductFilters } from '@/types/index';

// ── Mapper ────────────────────────────────────────────────────────────────────

function toCardData(p: ProductEntity): ProductCardData {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    image: p.images[0] ?? '/images/product-placeholder.png',
    images: p.images,
    vendorName: p.vendorName || undefined,
    stock: p.stock,
    variantId: p.variants?.[0]?.id,
  };
}

// ── Filter configuration ──────────────────────────────────────────────────────

const CATEGORY_OPTIONS = ['All', ...HEALTH_CATEGORIES.map((c) => c.name)];

const PRICE_RANGES = [
  { label: 'Under ₦10,000',          min: 0,         max: 10_000 },
  { label: '₦10,000 – ₦50,000',      min: 10_000,    max: 50_000 },
  { label: '₦50,000 – ₦200,000',     min: 50_000,    max: 200_000 },
  { label: '₦200,000 – ₦1,000,000',  min: 200_000,   max: 1_000_000 },
  { label: 'Over ₦1,000,000',         min: 1_000_000, max: Infinity },
];

const SORT_OPTIONS: { label: string; value: ProductFilters['sortBy'] }[] = [
  { label: 'Newest',           value: 'newest' },
  { label: 'Price: Low–High',  value: 'price_asc' },
  { label: 'Price: High–Low',  value: 'price_desc' },
];

// ── Filter panel ──────────────────────────────────────────────────────────────

interface FilterPanelProps {
  pendingCat: string;
  pendingPrice: string | null;
  onCatChange: (c: string) => void;
  onPriceChange: (p: string | null) => void;
  onApply: () => void;
  onReset: () => void;
}

function FilterPanel({ pendingCat, pendingPrice, onCatChange, onPriceChange, onApply, onReset }: FilterPanelProps) {
  const [openSections, setOpenSections] = useState(['category', 'price']);

  const toggle = (key: string) =>
    setOpenSections((s) => s.includes(key) ? s.filter((k) => k !== key) : [...s, key]);

  const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
    <div className="border-b border-gray-100 py-4">
      <button
        onClick={() => toggle(id)}
        className="w-full flex items-center justify-between text-sm font-semibold text-gray-900 mb-3"
      >
        {title}
        {openSections.includes(id) ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
      {openSections.includes(id) && children}
    </div>
  );

  return (
    <div className="text-sm">
      <div className="flex items-center justify-between mb-2">
        <p className="font-semibold text-gray-900">Filters</p>
        <button className="text-xs text-primary hover:underline" onClick={onReset}>
          Reset All
        </button>
      </div>

      <Section id="category" title="Category">
        <ul className="space-y-1 max-h-64 overflow-y-auto">
          {CATEGORY_OPTIONS.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => onCatChange(cat)}
                className={cn(
                  'flex items-center justify-between w-full text-left py-1.5 px-2 rounded-[6px] transition-colors',
                  pendingCat === cat
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                )}
              >
                <span className="truncate">{cat}</span>
              </button>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="price" title="Price Range">
        <ul className="space-y-2">
          {PRICE_RANGES.map((r) => (
            <li key={r.label}>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="price"
                  checked={pendingPrice === r.label}
                  onChange={() => onPriceChange(pendingPrice === r.label ? null : r.label)}
                  className="accent-primary"
                />
                <span className="text-gray-600 group-hover:text-gray-900 transition-colors">{r.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </Section>

      <div className="pt-4">
        <Button variant="primary" size="base" className="w-full" onClick={onApply}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const [filterOpen, setFilterOpen] = useState(false);

  // Pending — reflects current panel selections before Apply is clicked
  const [pendingCat, setPendingCat] = useState('All');
  const [pendingPrice, setPendingPrice] = useState<string | null>(null);

  // Applied — drives the actual queries
  const [appliedCat, setAppliedCat] = useState('All');
  const [appliedPrice, setAppliedPrice] = useState<string | null>(null);

  // Sort fires immediately — no Apply needed
  const [sortBy, setSortBy] = useState<ProductFilters['sortBy']>('newest');

  const catSlug = appliedCat === 'All'
    ? null
    : HEALTH_CATEGORIES.find((c) => c.name === appliedCat)?.slug ?? null;

  const { data: allPage,  isLoading: allLoading,  isError: allError  } = useProducts({ sortBy });
  const { data: catPage,  isLoading: catLoading,  isError: catError  } = useProductsByCategory(catSlug ?? '', { sortBy });

  const activePage = catSlug ? catPage  : allPage;
  const isLoading  = catSlug ? catLoading : allLoading;
  const isError    = catSlug ? catError   : allError;

  const products = (activePage?.data ?? []).map(toCardData);
  const priceRange = PRICE_RANGES.find((r) => r.label === appliedPrice);
  const displayed = priceRange
    ? products.filter((p) => p.price >= priceRange.min && p.price <= priceRange.max)
    : products;

  function handleApply() {
    setAppliedCat(pendingCat);
    setAppliedPrice(pendingPrice);
    setFilterOpen(false);
  }

  function handleReset() {
    setPendingCat('All');
    setPendingPrice(null);
    setAppliedCat('All');
    setAppliedPrice(null);
  }

  return (
    <div className="page-enter">
      {/* Page header */}
      <div className="bg-gray-50 border-b border-gray-100 py-5">
        <div className="container">
          <h1 className="text-2xl font-bold text-gray-900">All Medical Products</h1>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex gap-7">
          {/* Sidebar filter — desktop */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-28">
              <FilterPanel
                pendingCat={pendingCat}
                pendingPrice={pendingPrice}
                onCatChange={setPendingCat}
                onPriceChange={setPendingPrice}
                onApply={handleApply}
                onReset={handleReset}
              />
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {isError ? (
              <div className="text-center py-20">
                <p className="text-gray-500 mb-3">Failed to load products.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Retry
                </button>
              </div>
            ) : (
              <ProductGrid
                products={displayed}
                total={displayed.length}
                columns={3}
                showToolbar
                loading={isLoading}
                onFilterOpen={() => setFilterOpen(true)}
                onSortChange={(s) => setSortBy(s as ProductFilters['sortBy'])}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <Drawer open={filterOpen} onClose={() => setFilterOpen(false)} side="left" title="Filter Products" width="300px">
        <div className="px-5 py-4">
          <FilterPanel
            pendingCat={pendingCat}
            pendingPrice={pendingPrice}
            onCatChange={setPendingCat}
            onPriceChange={setPendingPrice}
            onApply={handleApply}
            onReset={handleReset}
          />
        </div>
      </Drawer>
    </div>
  );
}
