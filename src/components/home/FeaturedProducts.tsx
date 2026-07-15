'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { ProductGrid } from '@/components/products/ProductGrid';
import { useFeaturedProducts, useProductsByCategoryId } from '@/features/catalog/hooks/useProducts';
import { useCategories } from '@/features/categories/hooks/useCategories';
import type { ProductCardData } from '@/components/products/ProductCard';
import type { ProductEntity } from '@/domain/entities/product.entity';
import type { CategoryEntity } from '@/domain/entities/category.entity';
import { cn } from '@/lib/utils';

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

export function FeaturedProducts() {
  const [activeCategory, setActiveCategory] = useState<CategoryEntity | null>(null);

  const { data: categories, isLoading: catsLoading } = useCategories();
  const { data: featured, isLoading: featuredLoading } = useFeaturedProducts(8);
  const { data: catResult, isLoading: catLoading } = useProductsByCategoryId(
    activeCategory?.id ?? '',
    { limit: 8 },
  );

  const isLoading = activeCategory ? catLoading : featuredLoading;
  const raw: ProductEntity[] = activeCategory ? (catResult?.data ?? []) : (featured ?? []);
  const cards = raw.map(toCardData);

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

        {/* Category chips */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {catsLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 h-9 w-24 rounded-full bg-gray-200 animate-pulse" />
            ))
          ) : (
            <>
              <button
                type="button"
                onClick={() => setActiveCategory(null)}
                className={cn(
                  'flex-shrink-0 h-9 px-4 text-sm font-semibold rounded-full transition-all',
                  activeCategory === null
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary',
                )}
              >
                All
              </button>
              {(categories ?? []).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    'flex-shrink-0 h-9 px-4 text-sm font-semibold rounded-full transition-all',
                    activeCategory?.id === cat.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary',
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </>
          )}
        </div>

        <ProductGrid
          products={cards}
          total={cards.length}
          columns={4}
          showToolbar={false}
          loading={isLoading}
        />
      </div>
    </section>
  );
}
