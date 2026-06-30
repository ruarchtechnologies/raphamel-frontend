'use client';

import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { CategoryCard } from '@/features/categories/components/CategoryCard';
import { useCategories } from '@/features/categories/hooks/useCategories';

function CategorySkeleton() {
  return (
    <div className="rounded-[12px] border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-44 bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  const { data: categories, isLoading, isError } = useCategories();

  return (
    <div className="page-enter">
      {/* Page header */}
      <div className="bg-gray-50 border-b border-gray-100 py-8">
        <div className="container">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Categories' }]} />
          <div className="mt-3">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Browse</p>
            <h1 className="text-3xl font-bold text-gray-900">Medical Supply Categories</h1>
            <p className="text-gray-500 mt-2 max-w-xl">
              {isLoading
                ? 'Loading categories…'
                : `Source from ${categories?.length ?? 0} specialised healthcare product categories. All suppliers are NAFDAC-registered and business-verified.`}
            </p>
          </div>
        </div>
      </div>

      {/* Categories grid */}
      <div className="container py-10">
        {isError ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">Failed to load categories. Please try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => <CategorySkeleton key={i} />)
              : categories?.map((category, index) => (
                  <CategoryCard key={category.slug} category={category} index={index} priority={index === 0} />
                ))}
          </div>
        )}

        {/* B2B CTA */}
        {!isLoading && !isError && (
          <div className="mt-12 bg-gradient-to-r from-primary to-[#005bb5] rounded-[12px] p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              Can&apos;t find what you need?
            </h2>
            <p className="text-blue-100 mb-6">
              Our procurement team will source it from our verified supplier network.
            </p>
            <a
              href="mailto:procurement@raphamel.health"
              className="inline-flex items-center h-12 px-8 bg-[#FACC15] text-gray-900 text-sm font-bold rounded-[6px] hover:bg-[#e6b800] transition-colors"
            >
              Contact Procurement Team
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
