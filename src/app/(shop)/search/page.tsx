'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProductGrid } from '@/components/products/ProductGrid';
import { useProducts } from '@/features/catalog/hooks/useProducts';
import type { ProductEntity } from '@/domain/entities/product.entity';
import type { ProductCardData } from '@/components/products/ProductCard';

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

function SearchResults() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const q            = searchParams.get('q') ?? '';

  const { data: page, isLoading, isError, refetch } = useProducts(
    q.trim() ? { search: q.trim() } : {},
  );
  const products = (page?.data ?? []).map(toCardData);
  const total    = page?.meta.total ?? 0;

  return (
    <div className="page-enter">
      {/* Page header */}
      <div className="bg-gray-50 border-b border-gray-100 py-5">
        <div className="container">
          <h1 className="text-2xl font-bold text-gray-900">
            {q ? (
              <>
                Results for{' '}
                <span style={{ color: 'var(--color-primary)' }}>&ldquo;{q}&rdquo;</span>
              </>
            ) : (
              'Search Products'
            )}
          </h1>
          {!isLoading && q && (
            <p className="text-gray-500 text-sm mt-1">
              {total > 0
                ? `${total.toLocaleString()} product${total !== 1 ? 's' : ''} found`
                : 'No products matched your search'}
            </p>
          )}
        </div>
      </div>

      <div className="container py-8">
        {/* Search refinement bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const value = (fd.get('q') as string).trim();
            if (value) router.push(`/search?q=${encodeURIComponent(value)}`);
          }}
          className="flex gap-2 mb-8 max-w-lg"
        >
          <div className="relative flex-1">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Refine your search…"
              className="input-base pl-10 h-11 w-full"
            />
          </div>
          <button
            type="submit"
            className="px-5 h-11 rounded-[6px] text-white text-sm font-medium"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            Search
          </button>
        </form>

        {isError ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-3">Failed to load results.</p>
            <button
              onClick={() => refetch()}
              className="text-sm font-semibold"
              style={{ color: 'var(--color-primary)' }}
            >
              Retry
            </button>
          </div>
        ) : !isLoading && !q ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center py-20 text-gray-400"
          >
            <Search size={48} className="mb-4 opacity-30" />
            <p className="text-lg font-medium text-gray-500">Start typing to search</p>
            <p className="text-sm mt-1">Try &ldquo;surgical gloves&rdquo; or &ldquo;stethoscope&rdquo;</p>
          </motion.div>
        ) : !isLoading && products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center py-20 text-gray-400"
          >
            <Search size={48} className="mb-4 opacity-30" />
            <p className="text-lg font-medium text-gray-500">No results for &ldquo;{q}&rdquo;</p>
            <p className="text-sm mt-1">Try a different spelling or a more general term</p>
          </motion.div>
        ) : (
          <ProductGrid
            products={products}
            total={total}
            columns={4}
            loading={isLoading}
          />
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-gray-100 rounded" />
          <div className="h-10 w-full max-w-lg bg-gray-100 rounded" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-100 rounded-[6px]" />
            ))}
          </div>
        </div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
