'use client';

import Image from 'next/image';
import Link from 'next/link';
import { use } from 'react';
import { ChevronRight } from 'lucide-react';
import { ProductGrid } from '@/components/products/ProductGrid';
import { useCategoryBySlug } from '@/features/categories/hooks/useCategories';
import { useProductsByCategory } from '@/features/catalog/hooks/useProducts';
import { useCategories } from '@/features/categories/hooks/useCategories';
import type { ProductCardData } from '@/components/products/ProductCard';
import type { ProductEntity } from '@/domain/entities/product.entity';

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

// ── Skeletons ─────────────────────────────────────────────────────────────────

function HeroSkeleton() {
  return (
    <div className="border-b border-gray-100 py-10 animate-pulse bg-gray-50">
      <div className="container">
        <div className="h-4 w-40 bg-gray-200 rounded mb-4" />
        <div className="h-8 w-64 bg-gray-200 rounded mb-3" />
        <div className="h-4 w-96 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ slug: string }>;
}

export default function CategoryDetailPage({ params }: Props) {
  const { slug } = use(params);

  const { data: category, isLoading: catLoading } = useCategoryBySlug(slug);
  const { data: productsPage, isLoading: prodLoading, isError: prodError } = useProductsByCategory(slug);
  const { data: allCategories } = useCategories();

  const products = productsPage?.data ?? [];
  const isLoading = catLoading || prodLoading;

  // Not found state
  if (!catLoading && !category) {
    return (
      <div className="container py-20 text-center">
        <p className="text-2xl font-bold text-gray-900 mb-2">Category not found</p>
        <p className="text-gray-500 mb-6">This category does not exist or may have been removed.</p>
        <Link
          href="/categories"
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          Browse all categories <ChevronRight size={14} />
        </Link>
      </div>
    );
  }

  // Related = all other categories (max 4)
  const relatedCategories = (allCategories ?? [])
    .filter((c) => c.slug !== slug)
    .slice(0, 4);

  return (
    <div className="page-enter">
      {/* Category hero */}
      {catLoading ? (
        <HeroSkeleton />
      ) : (
        <div
          className="relative border-b border-gray-100 py-10 overflow-hidden"
          style={{ backgroundColor: category?.color ?? '#f9fafb' }}
        >
          {category?.image && (
            <div className="absolute inset-0 opacity-10">
              <Image
                src={category.image}
                alt=""
                fill
                className="object-cover"
                sizes="100vw"
                aria-hidden
              />
            </div>
          )}

          <div className="container relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold text-gray-900">{category?.name}</h1>
              {category?.description && (
                <p className="text-gray-600 mt-2 text-base leading-relaxed">
                  {category.description}
                </p>
              )}
              {productsPage?.meta.total !== undefined && (
                <p className="mt-3 text-sm font-semibold text-gray-500">
                  {productsPage.meta.total.toLocaleString()} products from verified suppliers
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Products */}
      <div className="container py-8">
        {isLoading ? (
          <ProductGrid products={[]} loading total={0} columns={4} showToolbar />
        ) : prodError ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">⚠️</p>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Could not load products</h2>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              There was a problem fetching products for this category. Please try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center h-11 px-6 bg-primary text-white text-sm font-bold rounded-[6px] hover:bg-[#005bb5] transition-colors"
            >
              Retry
            </button>
          </div>
        ) : products.length > 0 ? (
          <ProductGrid
            products={products.map(toCardData)}
            total={productsPage?.meta.total ?? products.length}
            columns={4}
            showToolbar
          />
        ) : (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🏥</p>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Products coming soon</h2>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              We&apos;re onboarding verified suppliers for this category.
              Contact us to source directly or be notified when products go live.
            </p>
            <a
              href="mailto:procurement@raphamel.health"
              className="inline-flex items-center h-11 px-6 bg-primary text-white text-sm font-bold rounded-[6px] hover:bg-[#005bb5] transition-colors"
            >
              Contact Procurement
            </a>
          </div>
        )}

        {/* Related categories */}
        {relatedCategories.length > 0 && (
          <div className="mt-14">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900">Browse Related Categories</h2>
              <Link
                href="/categories"
                className="flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all"
              >
                All Categories <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="flex flex-col items-center gap-3 p-4 rounded-[10px] hover:shadow-md transition-shadow text-center group"
                  style={{ backgroundColor: cat.color ?? '#f9fafb' }}
                >
                  {cat.image && (
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-sm group-hover:scale-110 transition-transform">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <p className="text-xs font-semibold text-gray-900 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {cat.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
