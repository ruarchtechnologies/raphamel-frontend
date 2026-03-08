/**
 * FLUTTER EQUIV: StatefulWidget with TabController
 *
 * In Flutter:
 *   class FeaturedProducts extends StatefulWidget { ... }
 *   class _FeaturedProductsState extends State<FeaturedProducts>
 *       with SingleTickerProviderStateMixin {
 *     late TabController _tabController;
 *     ...
 *   }
 *
 * In React:
 *   'use client' + useState for the active tab.
 *   No TickerProvider or SingleTickerProviderStateMixin — React's model is simpler:
 *   just a string in state.
 *
 * NOTE: The MOCK_PRODUCTS below are placeholders.
 * In production, replace with: const { data } = useFeaturedProducts();
 * from src/features/catalog/hooks/useProducts.ts
 */

'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { ProductGrid } from '@/components/products/ProductGrid';
import type { ProductCardData } from '@/components/products/ProductCard';
import { cn } from '@/lib/utils';

// ── Healthcare mock products ──────────────────────────────────────────────────
//
// IMAGE NEEDED per product — replace with real product photos:
// Filename convention: product-{slug}.jpg | Size: 400x500 (4:5 ratio)

const MOCK_PRODUCTS: ProductCardData[] = [
  {
    id: '1',
    slug: 'disposable-latex-surgical-gloves-100',
    name: 'Disposable Latex Surgical Gloves — Box of 100',
    price: 8500,
    compareAtPrice: 12000,
    // IMAGE NEEDED: product-disposable-gloves.jpg | Size: 400x500
    // Content: Box of blue nitrile/latex surgical gloves, clinical setting
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=500&fit=crop',
    rating: 4.7,
    reviewCount: 234,
    vendorName: 'MediSupply NG',
    isNew: false,
  },
  {
    id: '2',
    slug: 'digital-blood-pressure-monitor-auto',
    name: 'Digital Blood Pressure Monitor — Fully Automatic Upper Arm',
    price: 45000,
    compareAtPrice: 60000,
    // IMAGE NEEDED: product-bp-monitor.jpg | Size: 400x500
    // Content: Automatic blood pressure cuff and digital display, white background
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=500&fit=crop',
    rating: 4.5,
    reviewCount: 189,
    vendorName: 'DiagnosPro NG',
    isNew: true,
  },
  {
    id: '3',
    slug: 'n95-ffp2-respirator-masks-50',
    name: 'N95 FFP2 Respirator Masks — Pack of 50 (NIOSH Approved)',
    price: 35000,
    // IMAGE NEEDED: product-n95-masks.jpg | Size: 400x500
    // Content: Stack of white N95 masks in clear packaging
    image: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=400&h=500&fit=crop',
    rating: 4.8,
    reviewCount: 412,
    vendorName: 'SafeGuard PPE',
    isNew: false,
  },
  {
    id: '4',
    slug: 'adult-manual-wheelchair-foldable',
    name: 'Adult Manual Wheelchair — Foldable, Lightweight Aluminium Frame',
    price: 125000,
    compareAtPrice: 150000,
    // IMAGE NEEDED: product-wheelchair.jpg | Size: 400x500
    // Content: Lightweight foldable wheelchair, clean white background
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=500&fit=crop',
    rating: 4.6,
    reviewCount: 88,
    vendorName: 'MobileCare NG',
  },
  {
    id: '5',
    slug: 'littmann-classic-iii-stethoscope',
    name: '3M Littmann Classic III Stethoscope — Dual Head',
    price: 95000,
    compareAtPrice: 115000,
    // IMAGE NEEDED: product-stethoscope.jpg | Size: 400x500
    // Content: 3M Littmann stethoscope coiled on white surface
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=500&fit=crop',
    rating: 4.9,
    reviewCount: 531,
    vendorName: 'DiagnosPro NG',
  },
  {
    id: '6',
    slug: 'iv-administration-set-50pcs',
    name: 'IV Administration Set with Flow Regulator — Box of 50',
    price: 18000,
    compareAtPrice: 24000,
    // IMAGE NEEDED: product-iv-set.jpg | Size: 400x500
    // Content: Sterile IV drip administration set, packaged in clear poly bag
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=500&fit=crop',
    rating: 4.4,
    reviewCount: 167,
    vendorName: 'MediSupply NG',
    stock: 0, // Out of stock — card will show "Out of Stock" badge
  },
  {
    id: '7',
    slug: 'fingertip-pulse-oximeter-display',
    name: 'Fingertip Pulse Oximeter with OLED Display',
    price: 12000,
    // IMAGE NEEDED: product-oximeter.jpg | Size: 400x500
    // Content: White fingertip pulse oximeter showing SpO2 reading on display
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=500&fit=crop',
    rating: 4.3,
    reviewCount: 298,
    vendorName: 'DiagnosPro NG',
    isNew: true,
  },
  {
    id: '8',
    slug: 'hydraulic-examination-table-3-section',
    name: 'Hydraulic Examination Table — 3-Section Adjustable',
    price: 380000,
    compareAtPrice: 450000,
    // IMAGE NEEDED: product-exam-table.jpg | Size: 400x500
    // Content: Medical examination table in clinical setting, adjustable 3-section design
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=500&fit=crop',
    rating: 4.7,
    reviewCount: 43,
    vendorName: 'ClinicalFurnish NG',
  },
];

const TABS = [
  { label: 'Featured', key: 'featured' },
  { label: 'New Arrivals', key: 'new' },
  { label: 'On Sale', key: 'sale' },
  { label: 'Top Rated', key: 'rated' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

function filterProducts(tab: TabKey, products: ProductCardData[]): ProductCardData[] {
  switch (tab) {
    case 'new':
      return products.filter((p) => p.isNew);
    case 'sale':
      return products.filter((p) => p.compareAtPrice);
    case 'rated':
      return [...products].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    default:
      return products;
  }
}

export function FeaturedProducts() {
  /*
   * FLUTTER EQUIV: String _activeTab = 'featured'; (inside StatefulWidget state)
   * useState returns [currentValue, setter]. Calling setter re-renders.
   */
  const [activeTab, setActiveTab] = useState<TabKey>('featured');
  const filtered = filterProducts(activeTab, MOCK_PRODUCTS);

  return (
    <section className="section bg-gray-50">
      <div className="container">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
              Products
            </p>
            <h2 className="section-title mb-0">Discover Medical Supplies</h2>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all self-start sm:self-auto"
          >
            View All <ChevronRight size={16} />
          </Link>
        </div>

        {/* Tab bar — FLUTTER EQUIV: TabBar */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex-shrink-0 h-9 px-4 text-sm font-semibold rounded-full transition-all',
                activeTab === tab.key
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product grid — FLUTTER EQUIV: TabBarView → GridView */}
        <ProductGrid
          products={filtered}
          total={filtered.length}
          columns={4}
          showToolbar={false}
        />
      </div>
    </section>
  );
}
