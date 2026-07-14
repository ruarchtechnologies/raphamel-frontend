'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Eye, ShoppingCart, GitCompare } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { StarRating } from '@/components/ui/StarRating';
import { PriceDisplay } from './PriceDisplay';
import { useAddToCart } from '@/features/cart/hooks/useCart';
import { getDiscountPercent, truncate } from '@/lib/utils';

export interface ProductCardData {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  images?: string[];
  rating?: number;
  reviewCount?: number;
  vendorName?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  stock?: number;
  badge?: string;
  variantId?: string;
}

interface ProductCardProps {
  product: ProductCardData;
  layout?: 'grid' | 'list';
  index?: number;
}

export function ProductCard({ product, layout = 'grid', index = 0 }: ProductCardProps) {
  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();
  const isOutOfStock = product.stock === 0;
  const discountPercent =
    product.compareAtPrice
      ? getDiscountPercent(product.compareAtPrice, product.price)
      : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || !product.variantId) return;
    addToCart(
      {
        variantId: product.variantId,
        quantity: 1,
        title: product.name,
        thumbnail: product.image,
        unitPrice: product.price,
      },
      {
        onSuccess: () => {
          toast.success('Added to cart', {
            description: truncate(product.name, 40),
            duration: 2000,
          });
        },
      },
    );
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success('Added to wishlist');
  };

  if (layout === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04, duration: 0.3 }}
      >
        <Link
          href={`/products/${product.slug}`}
          className="flex gap-4 p-4 bg-white border border-gray-100 rounded-[8px] hover:border-gray-200 hover:shadow-md transition-all group"
        >
          <div className="w-32 h-32 flex-shrink-0 bg-gray-50 rounded-[6px] overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              width={128}
              height={128}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex-1 min-w-0 flex flex-col">
            {/* DISABLED: vendor/supplier feature removed
          {product.vendorName && (
              <span className="text-xs text-gray-400 mb-0.5">{product.vendorName}</span>
            )}
          */}
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h3>
            {product.rating !== undefined && (
              <StarRating rating={product.rating} count={product.reviewCount} size="sm" className="mt-1" />
            )}
            <div className="mt-auto pt-2">
              <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} size="sm" />
            </div>
          </div>
          {product.variantId && (
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || isOutOfStock}
              className="self-center flex-shrink-0 h-9 px-3 bg-primary text-white text-xs font-semibold rounded-[6px] hover:bg-[#005bb5] disabled:opacity-60 transition-colors"
            >
              {isAddingToCart ? 'Adding…' : 'Add to Cart'}
            </button>
          )}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
    >
      <Link href={`/products/${product.slug}`} className="product-card block group">
        {/* Thumbnail */}
        <div className="relative overflow-hidden bg-gray-50 rounded-t-[6px]" style={{ padding: '0.375rem' }}>
          <div className="relative aspect-[3/4] rounded-[4px] overflow-hidden bg-gray-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {isOutOfStock && <Badge variant="out">Out of Stock</Badge>}
              {!isOutOfStock && discountPercent > 0 && (
                <Badge variant="sale">-{discountPercent}%</Badge>
              )}
              {product.isNew && !discountPercent && <Badge variant="new">New</Badge>}
            </div>

            {/* Action buttons */}
            <div className="product-actions">
              <button
                onClick={handleWishlist}
                className="w-[30px] h-[30px] rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-rose-500 hover:scale-110 transition-all"
                title="Add to Wishlist"
              >
                <Heart size={14} />
              </button>
              <button
                className="w-[30px] h-[30px] rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-primary hover:scale-110 transition-all"
                title="Quick View"
              >
                <Eye size={14} />
              </button>
              <button
                className="w-[30px] h-[30px] rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-primary hover:scale-110 transition-all"
                title="Compare"
              >
                <GitCompare size={14} />
              </button>
            </div>

            {/* Add to cart slide-up */}
            {!isOutOfStock && product.variantId && (
              <div className="product-add-cart px-2 pb-2">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="w-full h-9 bg-gray-900 hover:bg-primary disabled:opacity-60 text-white text-xs font-semibold rounded-[6px] flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingCart size={14} />
                  {isAddingToCart ? 'Adding…' : 'Add to Cart'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          {/* DISABLED: vendor/supplier feature removed
          {product.vendorName && (
            <p className="text-xs text-gray-400 mb-0.5 truncate">{product.vendorName}</p>
          )}
          */}
          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
          {product.rating !== undefined && (
            <StarRating rating={product.rating} count={product.reviewCount} size="sm" className="mt-1" />
          )}
          <div className="mt-1.5">
            <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} size="sm" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
