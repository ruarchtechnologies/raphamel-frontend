'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { ProductGrid } from '@/components/products/ProductGrid';
import { useFeaturedProducts } from '@/features/catalog/hooks/useProducts';
import type { ProductCardData } from '@/components/products/ProductCard';
import type { ProductEntity } from '@/domain/entities/product.entity';
import { cn } from '@/lib/utils';

const TABS = [
  { label: 'Featured',     key: 'featured' },
  { label: 'New Arrivals', key: 'new'      },
  { label: 'On Sale',      key: 'sale'     },
] as const;

type TabKey = (typeof TABS)[number]['key'];

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

function filterProducts(tab: TabKey, products: ProductCardData[], raw: ProductEntity[]): ProductCardData[] {
  switch (tab) {
    case 'new':
      // newest first (raw has createdAt)
      return [...products].sort((a, b) => {
        const ra = raw.find((p) => p.id === a.id);
        const rb = raw.find((p) => p.id === b.id);
        return new Date(rb?.createdAt ?? 0).getTime() - new Date(ra?.createdAt ?? 0).getTime();
      });
    case 'sale':
      return products.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price);
    default:
      return products;
  }
}

export function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState<TabKey>('featured');
  const { data: products, isLoading } = useFeaturedProducts(8);

  const cards = (products ?? []).map(toCardData);
  const filtered = filterProducts(activeTab, cards, products ?? []);

  return (
    <section className="section bg-gray-50">
      <div className="container">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Products</p>
            <h2 className="section-title mb-0">Discover Medical Supplies</h2>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all self-start sm:self-auto"
          >
            View All <ChevronRight size={16} />
          </Link>
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
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

        <ProductGrid
          products={filtered}
          total={filtered.length}
          columns={4}
          showToolbar={false}
          loading={isLoading}
        />
      </div>
    </section>
  );
}
