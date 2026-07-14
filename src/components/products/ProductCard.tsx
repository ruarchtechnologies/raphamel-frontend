'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Check } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useAddToCart } from '@/features/cart/hooks/useCart';
import { WishlistButton } from '@/components/products/WishlistButton';
import { formatPrice, truncate } from '@/lib/utils';
import { cn } from '@/lib/utils';

export interface ProductCardData {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  images?: string[];
  /** Unused display fields — kept for interface compatibility */
  rating?: number;
  reviewCount?: number;
  vendorName?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  badge?: string;
  stock?: number;
  variantId?: string;
  /** Show "From " prefix when the product has variants with different prices */
  showFromPrefix?: boolean;
}

interface ProductCardProps {
  product: ProductCardData;
  layout?: 'grid' | 'list';
  index?: number;
}

type CartState = 'idle' | 'loading' | 'done';

export function ProductCard({ product, layout = 'grid', index = 0 }: ProductCardProps) {
  const [cartState, setCartState] = useState<CartState>('idle');
  const { mutate: addToCart } = useAddToCart();

  const isOutOfStock = product.stock === 0;
  const isDisabled = isOutOfStock || !product.variantId;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (isDisabled || cartState !== 'idle') return;
    setCartState('loading');
    addToCart(
      {
        variantId: product.variantId!,
        quantity: 1,
        title: product.name,
        thumbnail: product.image,
        unitPrice: product.price,
      },
      {
        onSuccess: () => {
          setCartState('done');
          toast.success('Added to cart', {
            description: truncate(product.name, 40),
            duration: 2000,
          });
          setTimeout(() => setCartState('idle'), 1200);
        },
        onError: () => {
          setCartState('idle');
          toast.error('Could not add to cart. Please try again.');
        },
      },
    );
  }

  // ── List layout ─────────────────────────────────────────────────────────────
  if (layout === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04, duration: 0.25 }}
        className="group flex gap-3 p-3 bg-white border border-gray-100 rounded-[6px] hover:border-gray-200 hover:shadow-sm transition-all duration-200"
      >
        <Link href={`/products/${product.slug}`} className="flex-shrink-0 w-[72px] h-[72px] bg-[#f4f6f8] rounded-[4px] overflow-hidden">
          <div className="relative w-full h-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="72px"
              className="object-contain p-1.5 group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5 py-0.5">
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug group-hover:text-primary transition-colors duration-150">
              {product.name}
            </h3>
          </Link>
          <p className="text-[0.9375rem] font-semibold text-slate-800 leading-tight">
            {product.showFromPrefix && (
              <span className="text-xs font-normal text-gray-400 mr-0.5">From </span>
            )}
            {formatPrice(product.price)}
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="ml-2 text-xs font-normal text-gray-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2">
          <WishlistButton variantId={product.variantId} variant="inline" />
          <button
            onClick={handleAddToCart}
            disabled={isDisabled}
            aria-label={`Add ${product.name} to cart`}
            className={cn(
              'flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150',
              isDisabled
                ? 'border border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                : 'border border-gray-200 bg-white text-gray-400 hover:bg-primary hover:border-primary hover:text-white',
            )}
          >
            {cartState === 'loading' ? (
              <svg className="w-[15px] h-[15px] animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25" />
                <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            ) : cartState === 'done' ? (
              <Check size={15} className="text-emerald-500" />
            ) : (
              <ShoppingBag size={15} />
            )}
          </button>
        </div>
      </motion.div>
    );
  }

  // ── Grid layout ─────────────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3, ease: 'easeOut' }}
      whileHover={{ y: -2, transition: { duration: 0.18 } }}
      className="group rounded-[16px] border border-[rgba(0,113,220,0.18)] overflow-hidden bg-white transition-[border-color,box-shadow] duration-200 hover:border-[rgba(0,113,220,0.55)] hover:shadow-product"
    >
      {/* Full-bleed image with wishlist overlay */}
      <Link
        href={`/products/${product.slug}`}
        className="block relative aspect-[4/3] bg-[#f4f6f8] overflow-hidden"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 576px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <WishlistButton
          variantId={product.variantId}
          variant="overlay"
          className="absolute top-2 right-2"
        />
      </Link>

      <div className="h-px bg-[rgba(0,113,220,0.18)]" />

      {/* Info section */}
      <div className="px-[14px] pt-[10px] pb-[12px]">
        <Link href={`/products/${product.slug}`} className="block min-w-0">
          <h3 className="text-[14.5px] font-medium text-gray-900 truncate leading-tight group-hover:text-primary transition-colors duration-150">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2.5 flex items-center justify-between gap-3">
          <p className="text-base font-medium text-gray-900 leading-none">
            {product.showFromPrefix && (
              <span className="text-[13px] font-normal text-gray-400 mr-0.5">From </span>
            )}
            {formatPrice(product.price)}
          </p>

          <button
            onClick={handleAddToCart}
            disabled={isDisabled}
            aria-label={`Add ${product.name} to cart`}
            className={cn(
              'w-[34px] h-[34px] flex-shrink-0 rounded-full flex items-center justify-center transition-all duration-150',
              isDisabled
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                : 'bg-primary text-white hover:brightness-110 hover:scale-105 active:scale-95',
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              {cartState === 'loading' ? (
                <motion.svg
                  key="spin"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.1 }}
                  className="w-[15px] h-[15px] animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.35" />
                  <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </motion.svg>
              ) : cartState === 'done' ? (
                <motion.div
                  key="check"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1.1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <Check size={15} />
                </motion.div>
              ) : (
                <motion.div
                  key="bag"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.1 }}
                >
                  <ShoppingBag size={15} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
