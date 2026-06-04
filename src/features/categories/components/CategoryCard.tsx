/**
 * FLUTTER EQUIV: A StatelessWidget — pure display, no internal state.
 *
 * In Flutter:
 *   class CategoryCard extends StatelessWidget {
 *     final CategoryEntity category;
 *     const CategoryCard({required this.category});
 *
 *     @override
 *     Widget build(BuildContext context) {
 *       return GestureDetector(
 *         onTap: () => context.go('/categories/${category.slug}'),
 *         child: Card(...)
 *       );
 *     }
 *   }
 *
 * In React: a function component that receives props and returns JSX.
 * 'use client' is needed because we use hover-driven CSS transitions
 * (which require JS interactivity). Actually this is pure CSS so we could
 * make it a Server Component — but keeping 'use client' for framer-motion.
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { CategoryEntity } from '@/domain/entities/category.entity';

interface CategoryCardProps {
  category: CategoryEntity;
  /** Animation delay index for stagger effect */
  index?: number;
  /** Pass true for the first visible card (LCP candidate) */
  priority?: boolean;
}

// FLUTTER EQUIV: AnimationController / TweenSequence for stagger
// In framer-motion: variants + staggerChildren on the parent, index-based delay on child
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' },
  }),
};

export function CategoryCard({ category, index = 0, priority = false }: CategoryCardProps) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
    >
      {/*
       * FLUTTER EQUIV: Navigator.push or context.go('/categories/${category.slug}')
       * In Next.js: <Link> renders an <a> tag and handles client-side navigation
       * automatically — no push/pop needed.
       */}
      <Link
        href={`/categories/${category.slug}`}
        className="group flex flex-col rounded-[12px] overflow-hidden border border-gray-100 hover:shadow-xl hover:border-transparent transition-all duration-300"
        style={{ backgroundColor: category.color ?? '#f9fafb' }}
      >
        {/* Image — FLUTTER EQUIV: CachedNetworkImage inside ClipRRect */}
        <div className="relative h-44 overflow-hidden">
          {/* IMAGE NEEDED: see category.entity.ts for per-category specs */}
          <Image
            src={category.image ?? '/images/categories/placeholder.jpg'}
            alt={category.name}
            fill
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {/* Dark gradient overlay — FLUTTER EQUIV: Container with BoxDecoration gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Text content — FLUTTER EQUIV: Column with Padding */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-bold text-gray-900 text-sm leading-tight group-hover:text-primary transition-colors">
            {category.name}
          </h3>

          {category.description && (
            <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
              {category.description}
            </p>
          )}

          <div className="mt-3 flex items-center justify-between">
            {category.productCount !== undefined && (
              <span className="text-xs text-gray-400 font-medium">
                {category.productCount.toLocaleString()} products
              </span>
            )}
            {/* FLUTTER EQUIV: Row with Icon — the gap-1 → gap-2 on hover is a CSS transition */}
            <span className="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
              Browse <ChevronRight size={12} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
