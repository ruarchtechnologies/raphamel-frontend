/**
 * FLUTTER EQUIV: A StatelessWidget Screen — CategoriesScreen
 *
 * In Flutter (GoRouter):
 *   GoRoute(path: '/categories', builder: (ctx, state) => CategoriesScreen())
 *
 * In Next.js: creating this file at app/(shop)/categories/page.tsx
 * AUTOMATICALLY registers the /categories route. No route config needed.
 * This is the BIGGEST difference from Flutter's GoRouter:
 *   Flutter: you define routes explicitly in GoRouter configuration
 *   Next.js: file path = URL path (convention over configuration)
 *
 * SERVER COMPONENT: No 'use client' → this renders on the server.
 * FLUTTER ANALOGY: Like a const widget — if there's no setState, it's
 * effectively a server-rendered widget. Next.js sends only HTML to the browser;
 * no JS needed for this page.
 *
 * For dynamic data (live product counts from API), you'd add:
 *   const categories = await fetchCategories(); // server-side fetch
 * For now we use the static HEALTH_CATEGORIES constant.
 */

import type { Metadata } from 'next';
import { HEALTH_CATEGORIES } from '@/domain/entities/category.entity';
import { CategoryCard } from '@/features/categories/components/CategoryCard';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export const metadata: Metadata = {
  title: 'Medical Supply Categories',
  description:
    'Browse Raphamel\'s 10 specialised healthcare product categories — from hospital consumables and surgical equipment to diagnostic devices and PPE.',
};

/**
 * CategoriesPage — Server Component
 *
 * FLUTTER EQUIV:
 *   class CategoriesScreen extends StatelessWidget {
 *     @override
 *     Widget build(BuildContext context) {
 *       return Scaffold(
 *         appBar: AppBar(title: Text('Categories')),
 *         body: GridView.builder(
 *           itemCount: HEALTH_CATEGORIES.length,
 *           itemBuilder: (ctx, i) => CategoryCard(category: HEALTH_CATEGORIES[i]),
 *         ),
 *       );
 *     }
 *   }
 */
export default function CategoriesPage() {
  return (
    <div className="page-enter">
      {/* Page header */}
      <div className="bg-gray-50 border-b border-gray-100 py-8">
        <div className="container">
          {/*
           * FLUTTER EQUIV: BreadcrumbWidget — a Row of Text + Icon breadcrumbs.
           * This is a reusable component we already have in src/components/ui/.
           */}
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Categories' }]} />
          <div className="mt-3">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
              Browse
            </p>
            <h1 className="text-3xl font-bold text-gray-900">Medical Supply Categories</h1>
            <p className="text-gray-500 mt-2 max-w-xl">
              Source from {HEALTH_CATEGORIES.length} specialised healthcare product
              categories. All suppliers are NAFDAC-registered and business-verified.
            </p>
          </div>
        </div>
      </div>

      {/* Categories grid */}
      <div className="container py-10">
        {/*
         * FLUTTER EQUIV: GridView.builder with SliverGridDelegateWithFixedCrossAxisCount
         *
         * Tailwind grid classes:
         *   grid-cols-1         = 1 column on mobile
         *   sm:grid-cols-2      = 2 columns ≥ 640px (Flutter: small tablet)
         *   lg:grid-cols-3      = 3 columns ≥ 1024px (Flutter: tablet landscape)
         *   xl:grid-cols-4      = 4 columns ≥ 1280px (Flutter: desktop/large tablet)
         *   gap-6               = 24px gap between cells
         */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/*
           * FLUTTER EQUIV: itemBuilder: (ctx, i) => CategoryCard(category: list[i])
           *
           * In React: .map() replaces the builder pattern. Each item needs a
           * unique `key` prop — React uses this to efficiently update the DOM
           * (like Flutter's key parameter on widgets).
           */}
          {HEALTH_CATEGORIES.map((category, index) => (
            <CategoryCard key={category.slug} category={category} index={index} />
          ))}
        </div>

        {/* B2B CTA */}
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
      </div>
    </div>
  );
}
