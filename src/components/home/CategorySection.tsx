/**
 * FLUTTER EQUIV: StatelessWidget rendering a GridView of category chips.
 *
 * In Flutter:
 *   GridView.builder(
 *     gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 5),
 *     itemBuilder: (ctx, i) => CategoryChip(category: categories[i]),
 *   )
 *
 * In React: CSS Grid via Tailwind classes. No builder pattern needed — we
 * just map() over the array and return JSX elements.
 *
 * KEY CONCEPT — 'use client' vs Server Component:
 *   Flutter: all widgets run on the device (always "client")
 *   Next.js: components can run on the SERVER (no JS sent to browser!) OR client.
 *   This component needs 'use client' ONLY because framer-motion uses browser APIs.
 *   Without animation, this could be a zero-JS Server Component.
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { HEALTH_CATEGORIES } from '@/domain/entities/category.entity';

// ── Animation variants ────────────────────────────────────────────────────────
//
// FLUTTER EQUIV: AnimationController + staggered Interval animations
//
// In framer-motion:
//   - "container" variant orchestrates children (staggerChildren = delay between each)
//   - "item" variant is applied to each child automatically

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, scale: 0.9, y: 10 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.35 } },
};

export function CategorySection() {
  return (
    <section className="section">
      <div className="container">
        {/* Section header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
              Browse
            </p>
            <h2 className="section-title mb-0">Shop by Specialty</h2>
          </div>
          <Link
            href="/categories"
            className="flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all"
          >
            All Categories <ChevronRight size={16} />
          </Link>
        </div>

        {/*
         * FLUTTER EQUIV: GridView.builder with SliverGridDelegate
         *
         * In Tailwind: grid-cols-2 sm:grid-cols-5 lg:grid-cols-10
         * means: 2 columns on mobile, 5 on tablet, 10 on desktop.
         *
         * The `motion.div` wrapper adds stagger animation via the container variant.
         * FLUTTER EQUIV: ListView.separated with AnimationController.
         */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3"
        >
          {HEALTH_CATEGORIES.map((cat) => (
            <motion.div key={cat.slug} variants={item}>
              {/*
               * FLUTTER EQUIV: InkWell wrapping a Column with image + text
               * In Next.js: <Link> = navigation + <a> tag in one
               */}
              <Link
                href={`/categories/${cat.slug}`}
                className="flex flex-col items-center gap-2.5 p-3 rounded-[10px] hover:shadow-lg transition-all group"
                style={{ backgroundColor: cat.color }}
              >
                {/* Category icon image — FLUTTER EQUIV: ClipOval(child: CachedNetworkImage) */}
                <div className="w-14 h-14 rounded-full overflow-hidden bg-white shadow-sm group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  {/*
                   * IMAGE NEEDED: See category.entity.ts for image specs per category.
                   * Recommended: 112x112 PNG icon (2x for retina) with transparent bg.
                   * Filename convention: icon-{slug}.png
                   * e.g. icon-hospital-consumables.png
                   */}
                  <Image
                    src={cat.image ?? '/images/categories/placeholder.jpg'}
                    alt={cat.name}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Label */}
                <div className="text-center">
                  <p className="text-[11px] font-semibold text-gray-900 leading-tight line-clamp-2">
                    {cat.name}
                  </p>
                  {cat.productCount !== undefined && (
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {cat.productCount.toLocaleString()}
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
