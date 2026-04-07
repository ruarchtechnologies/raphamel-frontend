/**
 * FLUTTER EQUIV: A StatefulWidget Screen with Filter Sheet
 *
 * State:
 *   - filterOpen: bool  (bottom sheet / drawer open)
 *   - selectedCat: String
 *   - selectedPrice: String?
 *   - minRating: int?
 *   - openSections: List<String>
 *
 * In Flutter you'd use showModalBottomSheet for the filter panel on mobile.
 * In Next.js we use our custom Drawer component (from the left side).
 *
 * IMPORTANT ARCHITECTURE NOTE:
 * This page is 'use client' because it has UI state (filter open/closed, tab).
 * In a production app with React Query, you'd split this into:
 *   - ProductsPage (Server Component) — fetches initial data on server
 *   - ProductsClient (Client Component) — handles filter UI state
 * This is the "partial hydration" pattern (no direct Flutter equivalent).
 */

'use client';

import { useState } from 'react';
import { SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/Button';
import { Drawer } from '@/components/layout/Drawer';
import { cn } from '@/lib/utils';
import type { ProductCardData } from '@/components/products/ProductCard';
import { HEALTH_CATEGORIES } from '@/domain/entities/category.entity';

// ── Mock healthcare products ──────────────────────────────────────────────────
// TODO: Replace with useProducts() from src/features/catalog/hooks/useProducts.ts

const PRODUCTS: ProductCardData[] = [
  { id: '1', slug: 'disposable-latex-surgical-gloves-100', name: 'Disposable Latex Surgical Gloves — Box of 100', price: 8500, compareAtPrice: 12000, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=500&fit=crop', rating: 4.7, reviewCount: 234, vendorName: 'MediSupply NG' },
  { id: '2', slug: 'digital-bp-monitor-auto', name: 'Digital Blood Pressure Monitor — Automatic Upper Arm', price: 45000, compareAtPrice: 60000, image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=500&fit=crop', rating: 4.5, reviewCount: 189, vendorName: 'DiagnosPro NG', isNew: true },
  { id: '3', slug: 'n95-ffp2-respirator-masks-50', name: 'N95 FFP2 Respirator Masks — Pack of 50', price: 35000, image: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=400&h=500&fit=crop', rating: 4.8, reviewCount: 412, vendorName: 'SafeGuard PPE' },
  { id: '4', slug: 'adult-manual-wheelchair-foldable', name: 'Adult Manual Wheelchair — Foldable Aluminium', price: 125000, compareAtPrice: 150000, image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=500&fit=crop', rating: 4.6, reviewCount: 88, vendorName: 'MobileCare NG' },
  { id: '5', slug: 'littmann-classic-iii-stethoscope', name: '3M Littmann Classic III Stethoscope', price: 95000, compareAtPrice: 115000, image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=500&fit=crop', rating: 4.9, reviewCount: 531, vendorName: 'DiagnosPro NG' },
  { id: '6', slug: 'iv-administration-set-50pcs', name: 'IV Administration Set — Box of 50', price: 18000, compareAtPrice: 24000, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=500&fit=crop', rating: 4.4, reviewCount: 167, vendorName: 'MediSupply NG', stock: 0 },
  { id: '7', slug: 'fingertip-pulse-oximeter-display', name: 'Fingertip Pulse Oximeter with OLED Display', price: 12000, image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=500&fit=crop', rating: 4.3, reviewCount: 298, vendorName: 'DiagnosPro NG', isNew: true },
  { id: '8', slug: 'hydraulic-exam-table-3-section', name: 'Hydraulic Examination Table — 3-Section', price: 380000, compareAtPrice: 450000, image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=500&fit=crop', rating: 4.7, reviewCount: 43, vendorName: 'ClinicalFurnish NG' },
  { id: '9', slug: 'stainless-scalpel-handle-set', name: 'Stainless Steel Scalpel Handle Set — #3 #4 #7', price: 35000, compareAtPrice: 45000, image: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=400&h=500&fit=crop', rating: 4.8, reviewCount: 67, vendorName: 'SurgiTech Africa' },
  { id: '10', slug: 'foley-catheter-16fr-box', name: 'Foley Catheter 16Fr — Box of 10', price: 15000, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=500&fit=crop', rating: 4.3, reviewCount: 89, vendorName: 'NigerMed Supplies', isNew: true },
  { id: '11', slug: 'tens-unit-pain-relief', name: 'TENS Unit — Dual Channel, 20 Modes Pain Relief', price: 55000, compareAtPrice: 70000, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop', rating: 4.5, reviewCount: 112, vendorName: 'RehabCare Solutions' },
  { id: '12', slug: 'lab-centrifuge-bench-top', name: 'Bench-Top Lab Centrifuge — 12 x 1.5ml, 6000 RPM', price: 320000, compareAtPrice: 400000, image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=500&fit=crop', rating: 4.6, reviewCount: 29, vendorName: 'LabEquip Nigeria' },
];

// ── Filter configuration ──────────────────────────────────────────────────────
//
// In production: derive these from the API response (aggregations/facets).

const CATEGORY_OPTIONS = ['All', ...HEALTH_CATEGORIES.map((c) => c.name)];

const PRICE_RANGES = [
  { label: 'Under ₦10,000',            min: 0,       max: 10_000 },
  { label: '₦10,000 – ₦50,000',        min: 10_000,  max: 50_000 },
  { label: '₦50,000 – ₦200,000',       min: 50_000,  max: 200_000 },
  { label: '₦200,000 – ₦1,000,000',    min: 200_000, max: 1_000_000 },
  { label: 'Over ₦1,000,000',           min: 1_000_000, max: Infinity },
];

// ── Filter panel (reused in sidebar + mobile drawer) ─────────────────────────

function FilterPanel({ onClose }: { onClose?: () => void }) {
  const [openSections, setOpenSections] = useState(['category', 'price']);
  const [selectedCat, setSelectedCat]   = useState('All');
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [minRating, setMinRating]         = useState<number | null>(null);

  const toggle = (key: string) =>
    setOpenSections((s) =>
      s.includes(key) ? s.filter((k) => k !== key) : [...s, key],
    );

  /*
   * FLUTTER EQUIV: ExpansionTile
   * This inline component creates a collapsible section.
   * IMPORTANT: defining a component inside another function is fine for small
   * helpers like this, but avoid it for components that hold their own state
   * (they'd reset on every parent render).
   */
  const Section = ({
    id,
    title,
    children,
  }: {
    id: string;
    title: string;
    children: React.ReactNode;
  }) => (
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
        <button
          className="text-xs text-primary hover:underline"
          onClick={() => {
            setSelectedCat('All');
            setSelectedPrice(null);
            setMinRating(null);
          }}
        >
          Reset All
        </button>
      </div>

      <Section id="category" title="Category">
        <ul className="space-y-1 max-h-64 overflow-y-auto">
          {CATEGORY_OPTIONS.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => setSelectedCat(cat)}
                className={cn(
                  'flex items-center justify-between w-full text-left py-1.5 px-2 rounded-[6px] transition-colors',
                  selectedCat === cat
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
                  checked={selectedPrice === r.label}
                  onChange={() => setSelectedPrice(r.label)}
                  className="accent-primary"
                />
                <span className="text-gray-600 group-hover:text-gray-900 transition-colors">
                  {r.label}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="rating" title="Minimum Rating">
        <ul className="space-y-2">
          {[4, 3, 2, 1].map((r) => (
            <li key={r}>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="rating"
                  checked={minRating === r}
                  onChange={() => setMinRating(r)}
                  className="accent-primary"
                />
                <span className="text-gray-600 group-hover:text-gray-900 flex items-center gap-1">
                  {'★'.repeat(r)}
                  <span className="text-gray-400">& up</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      </Section>

      {onClose && (
        <div className="pt-4">
          <Button variant="primary" size="base" className="w-full" onClick={onClose}>
            Show Results
          </Button>
        </div>
      )}
    </div>
  );
}

// ── Main page component ───────────────────────────────────────────────────────

export default function ProductsPage() {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="page-enter">
      {/* Page header */}
      <div className="bg-gray-50 border-b border-gray-100 py-5">
        <div className="container">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Products' }]} />
          <h1 className="text-2xl font-bold text-gray-900 mt-2">All Medical Products</h1>
          <p className="text-gray-500 text-sm mt-1">
            {PRODUCTS.length}+ NAFDAC-verified medical products {/* DISABLED: was 'from NAFDAC-verified suppliers' — vendor/supplier feature removed */}
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex gap-7">
          {/* Sidebar filter — desktop */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-28">
              <FilterPanel />
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            <ProductGrid
              products={PRODUCTS}
              total={PRODUCTS.length}
              columns={3}
              showToolbar
              onFilterOpen={() => setFilterOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <Drawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        side="left"
        title="Filter Products"
        width="300px"
      >
        <div className="px-5 py-4">
          <FilterPanel onClose={() => setFilterOpen(false)} />
        </div>
      </Drawer>
    </div>
  );
}
