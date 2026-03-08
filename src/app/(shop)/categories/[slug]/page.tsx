/**
 * FLUTTER EQUIV: A Screen that receives a route parameter.
 *
 * In Flutter (GoRouter):
 *   GoRoute(
 *     path: '/categories/:slug',
 *     builder: (ctx, state) => CategoryDetailScreen(
 *       slug: state.pathParameters['slug']!,
 *     ),
 *   )
 *
 * In Next.js:
 *   File path: app/(shop)/categories/[slug]/page.tsx
 *   The [slug] in the filename = :slug in GoRouter.
 *   Next.js passes it as `params.slug` to the component.
 *
 * DYNAMIC METADATA:
 *   FLUTTER EQUIV: No direct equivalent — Flutter doesn't have page-level SEO.
 *   generateMetadata() runs on the SERVER before the page renders and
 *   produces the <title> and <meta> tags for this specific category URL.
 *   This is pure server-side code — no JS in the browser.
 *
 * notFound():
 *   FLUTTER EQUIV: GoRouter redirect or showing a 404 widget.
 *   In Next.js: calling notFound() renders the nearest not-found.tsx file
 *   and returns HTTP 404. The user sees your custom 404 page.
 */

import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import {
  findCategoryBySlug,
  HEALTH_CATEGORIES,
} from '@/domain/entities/category.entity';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ProductGrid } from '@/components/products/ProductGrid';
import type { ProductCardData } from '@/components/products/ProductCard';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

// ── Static params generation ──────────────────────────────────────────────────
//
// FLUTTER EQUIV: No direct equivalent.
// This tells Next.js to PRE-RENDER all 10 category pages at BUILD TIME
// (Static Site Generation). The result is 10 ultra-fast HTML files served
// from CDN — zero server cost per request.
//
// If you skip this, Next.js renders on-demand (like a normal server).

export async function generateStaticParams() {
  return HEALTH_CATEGORIES.map((cat) => ({ slug: cat.slug }));
}

// ── Dynamic metadata per category ────────────────────────────────────────────

interface Props {
  params: { slug: string };
}

export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  const category = findCategoryBySlug(params.slug);
  if (!category) return {};
  return {
    title: `${category.name} | Raphamel Health`,
    description: category.description,
  };
}

// ── Mock products per category ────────────────────────────────────────────────
//
// TODO: Replace with API call using fetchProductsByCategory(params.slug)
// from src/data/api/products.api.ts
//
// In production (Server Component with async data):
//   const { data: products } = await fetchProductsByCategory(params.slug);

const CATEGORY_PRODUCTS: Record<string, ProductCardData[]> = {
  'hospital-consumables': [
    {
      id: 'hc-1', slug: 'disposable-latex-surgical-gloves-100',
      name: 'Disposable Latex Surgical Gloves — Box of 100',
      price: 8500, compareAtPrice: 12000,
      // IMAGE NEEDED: product-disposable-gloves.jpg | Size: 400x500
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=500&fit=crop',
      rating: 4.7, reviewCount: 234, vendorName: 'MediSupply NG',
    },
    {
      id: 'hc-2', slug: 'iv-administration-set-50pcs',
      name: 'IV Administration Set with Flow Regulator — Box of 50',
      price: 18000, compareAtPrice: 24000,
      // IMAGE NEEDED: product-iv-set.jpg | Size: 400x500
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=500&fit=crop',
      rating: 4.4, reviewCount: 167, vendorName: 'MediSupply NG',
    },
    {
      id: 'hc-3', slug: 'foley-catheter-16fr-box-10',
      name: "Foley Catheter 16Fr — Box of 10",
      price: 15000,
      // IMAGE NEEDED: product-foley-catheter.jpg | Size: 400x500
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=500&fit=crop',
      rating: 4.3, reviewCount: 89, vendorName: 'NigerMed Supplies', isNew: true,
    },
    {
      id: 'hc-4', slug: 'surgical-face-mask-3ply-500',
      name: '3-Ply Surgical Face Mask — Box of 500',
      price: 28000, compareAtPrice: 38000,
      // IMAGE NEEDED: product-surgical-mask.jpg | Size: 400x500
      image: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=400&h=500&fit=crop',
      rating: 4.6, reviewCount: 312, vendorName: 'SafeGuard PPE',
    },
  ],
  'surgical-equipment': [
    {
      id: 'se-1', slug: 'stainless-scalpel-handle-set',
      name: 'Stainless Steel Scalpel Handle Set — #3 #4 #7',
      price: 35000, compareAtPrice: 45000,
      // IMAGE NEEDED: product-scalpel-set.jpg | Size: 400x500
      image: 'https://images.unsplash.com/photo-1551601651-2a8f10b8a0f8?w=400&h=500&fit=crop',
      rating: 4.8, reviewCount: 67, vendorName: 'SurgiTech Africa',
    },
    {
      id: 'se-2', slug: 'needle-holder-mayo-hegar-8',
      name: 'Mayo-Hegar Needle Holder — 8 inch, Tungsten Carbide Insert',
      price: 48000,
      // IMAGE NEEDED: product-needle-holder.jpg | Size: 400x500
      image: 'https://images.unsplash.com/photo-1551601651-2a8f10b8a0f8?w=400&h=500&fit=crop',
      rating: 4.7, reviewCount: 44, vendorName: 'SurgiTech Africa', isNew: true,
    },
  ],
  'diagnostic-devices': [
    {
      id: 'dd-1', slug: 'littmann-classic-iii-stethoscope',
      name: '3M Littmann Classic III Stethoscope',
      price: 95000, compareAtPrice: 115000,
      // IMAGE NEEDED: product-stethoscope.jpg | Size: 400x500
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=500&fit=crop',
      rating: 4.9, reviewCount: 531, vendorName: 'DiagnosPro NG',
    },
    {
      id: 'dd-2', slug: 'digital-blood-pressure-monitor-auto',
      name: 'Fully Automatic Digital Blood Pressure Monitor',
      price: 45000, compareAtPrice: 60000,
      // IMAGE NEEDED: product-bp-monitor.jpg | Size: 400x500
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=500&fit=crop',
      rating: 4.5, reviewCount: 189, vendorName: 'DiagnosPro NG', isNew: true,
    },
    {
      id: 'dd-3', slug: 'fingertip-pulse-oximeter-display',
      name: 'Fingertip Pulse Oximeter with OLED Display',
      price: 12000,
      // IMAGE NEEDED: product-oximeter.jpg | Size: 400x500
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=500&fit=crop',
      rating: 4.3, reviewCount: 298, vendorName: 'DiagnosPro NG', isNew: true,
    },
  ],
  'personal-protective-equipment': [
    {
      id: 'ppe-1', slug: 'n95-ffp2-respirator-masks-50',
      name: 'N95 FFP2 Respirator Masks — Pack of 50 (NIOSH)',
      price: 35000,
      // IMAGE NEEDED: product-n95-masks.jpg | Size: 400x500
      image: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=400&h=500&fit=crop',
      rating: 4.8, reviewCount: 412, vendorName: 'SafeGuard PPE',
    },
    {
      id: 'ppe-2', slug: 'nitrile-examination-gloves-xl-100',
      name: 'Nitrile Examination Gloves XL — Box of 100 (Powder-Free)',
      price: 9500, compareAtPrice: 13000,
      // IMAGE NEEDED: product-nitrile-gloves.jpg | Size: 400x500
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=500&fit=crop',
      rating: 4.6, reviewCount: 287, vendorName: 'SafeGuard PPE',
    },
  ],
};

// Fallback for categories with no mock data yet
const EMPTY_PRODUCTS: ProductCardData[] = [];

// ── Page component ────────────────────────────────────────────────────────────

export default function CategoryDetailPage({ params }: Props) {
  const category = findCategoryBySlug(params.slug);

  /*
   * FLUTTER EQUIV: if (category == null) return const NotFoundScreen();
   * In Next.js: notFound() throws a special error caught by the nearest
   * not-found.tsx file (we have one at app/not-found.tsx).
   */
  if (!category) notFound();

  const products = CATEGORY_PRODUCTS[params.slug] ?? EMPTY_PRODUCTS;

  // Related categories (excluding current)
  const relatedCategories = HEALTH_CATEGORIES
    .filter((c) => c.slug !== params.slug)
    .slice(0, 4);

  return (
    <div className="page-enter">
      {/* Category hero banner */}
      <div
        className="relative border-b border-gray-100 py-10 overflow-hidden"
        style={{ backgroundColor: category.color ?? '#f9fafb' }}
      >
        {/* Background image — faded */}
        {category.image && (
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
          <Breadcrumb
            items={[
              { label: 'Home',       href: '/' },
              { label: 'Categories', href: '/categories' },
              { label: category.name },
            ]}
          />
          <div className="mt-3 max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
            {category.description && (
              <p className="text-gray-600 mt-2 text-base leading-relaxed">
                {category.description}
              </p>
            )}
            {category.productCount !== undefined && (
              <p className="mt-3 text-sm font-semibold text-gray-500">
                {category.productCount.toLocaleString()} products from verified suppliers
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="container py-8">
        {products.length > 0 ? (
          <ProductGrid
            products={products}
            total={products.length}
            columns={4}
            showToolbar
          />
        ) : (
          /* Empty state — FLUTTER EQUIV: EmptyWidget / placeholder */
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🏥</p>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Products coming soon
            </h2>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              We&apos;re onboarding verified suppliers for this category.
              Contact us to be notified or to source directly.
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
                style={{ backgroundColor: cat.color }}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-sm group-hover:scale-110 transition-transform">
                  <Image
                    src={cat.image ?? '/images/categories/placeholder.jpg'}
                    alt={cat.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs font-semibold text-gray-900 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {cat.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
