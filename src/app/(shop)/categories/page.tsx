import type { Metadata } from 'next';
import Link from 'next/link';
import { CategoryCard } from '@/features/categories/components/CategoryCard';
import { fetchCategories } from '@/data/api/categories.api';

export const metadata: Metadata = {
  title: 'Medical Supply Categories',
  description:
    'Browse NAFDAC-registered healthcare product categories — hospital consumables, surgical equipment, diagnostic devices and more.',
};

export default async function CategoriesPage() {
  let categories: Awaited<ReturnType<typeof fetchCategories>> = [];
  let fetchError = false;

  try {
    categories = await fetchCategories();
  } catch {
    fetchError = true;
  }

  return (
    <div className="page-enter">
      {/* Page header */}
      <div className="bg-gray-50 border-b border-gray-100 py-8">
        <div className="container">
          <div className="mt-3">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Browse</p>
            <h1 className="text-3xl font-bold text-gray-900">Medical Supply Categories</h1>
            {!fetchError && (
              <p className="text-gray-500 mt-2 max-w-xl">
                Source from {categories.length} specialised healthcare product categories. All
                suppliers are NAFDAC-registered and business-verified.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Categories grid */}
      <div className="container py-10">
        {fetchError ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">Failed to load categories. Please try again.</p>
            <Link
              href="/categories"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Retry
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.slug}
                category={category}
                index={index}
                priority={index === 0}
              />
            ))}
          </div>
        )}

        {/* B2B CTA */}
        {!fetchError && categories.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-primary to-[#005bb5] rounded-[12px] p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              Can&apos;t find what you need?
            </h2>
            <p className="text-blue-100 mb-6">
              Our procurement team will source it from our verified supplier network.
            </p>
            <a
              href="mailto:procurement@raphamel.com"
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
