'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, Package } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useWishlist, useRemoveFromWishlist } from '@/features/wishlist/hooks/useWishlist';
import { useAddToCart } from '@/features/cart/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import { type WishlistItem } from '@/data/api/wishlist.api';

// ── Skeleton ──────────────────────────────────────────────────────────────────

function WishlistSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-[12px] border border-gray-200 p-4 animate-pulse flex items-center gap-4"
        >
          <div className="w-16 h-16 rounded-[12px] bg-gray-100 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-100 rounded w-2/3" />
            <div className="h-3 bg-gray-100 rounded w-1/4" />
            <div className="h-4 bg-gray-100 rounded w-1/3" />
          </div>
          <div className="flex gap-2 shrink-0">
            <div className="h-9 w-9 bg-gray-100 rounded-full" />
            <div className="h-9 w-24 bg-gray-100 rounded-[12px]" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Single wishlist item row ───────────────────────────────────────────────────

function WishlistItemRow({ item }: { item: WishlistItem }) {
  const [addingToCart, setAddingToCart] = useState(false);
  const { mutate: removeItem, isPending: isRemoving } = useRemoveFromWishlist();
  const { mutate: addToCart } = useAddToCart();

  const variant  = item.product_variant;
  const product  = variant?.product;
  const price    = variant?.calculated_price?.calculated_amount ?? variant?.prices?.[0]?.amount ?? 0;
  const name     = product?.title ?? 'Unknown product';
  const handle   = product?.handle;
  const thumbnail = product?.thumbnail;
  const variantLabel = variant?.title && variant.title !== 'Default Title' ? variant.title : null;

  function handleAddToCart() {
    if (!item.product_variant_id) return;
    setAddingToCart(true);
    addToCart(
      {
        variantId: item.product_variant_id,
        quantity: 1,
        title: name,
        thumbnail: thumbnail ?? undefined,
        unitPrice: price,
      },
      {
        onSuccess: () => {
          toast.success('Added to cart', { description: name, duration: 2000 });
          setAddingToCart(false);
        },
        onError: () => {
          toast.error('Could not add to cart. Please try again.');
          setAddingToCart(false);
        },
      },
    );
  }

  function handleRemove() {
    removeItem(item.id);
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-[12px] border border-gray-200 p-4 flex items-center gap-4"
    >
      {/* Thumbnail */}
      <div className="w-16 h-16 rounded-[12px] bg-gray-50 border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={name}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        ) : (
          <Package size={20} className="text-gray-300" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        {handle ? (
          <Link
            href={`/products/${handle}`}
            className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-primary transition-colors"
          >
            {name}
          </Link>
        ) : (
          <p className="text-sm font-semibold text-gray-900 line-clamp-2">{name}</p>
        )}
        {variantLabel && (
          <p className="text-xs text-gray-500 mt-0.5">{variantLabel}</p>
        )}
        {price > 0 && (
          <p className="text-sm font-bold text-gray-900 mt-1">{formatPrice(price)}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleRemove}
          disabled={isRemoving}
          aria-label="Remove from wishlist"
          className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all disabled:opacity-40"
        >
          <Trash2 size={15} />
        </button>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<ShoppingCart size={14} />}
          onClick={handleAddToCart}
          loading={addingToCart}
          disabled={addingToCart || !item.product_variant_id}
          className="text-xs h-9"
        >
          Add to Cart
        </Button>
      </div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function WishlistPage() {
  const { data: wishlist, isLoading, isError, refetch } = useWishlist();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-[12px] border border-gray-200 shadow-sm px-6 py-4">
          <h1 className="text-base font-semibold text-gray-900">Wishlist</h1>
        </div>
        <WishlistSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-[12px] border border-gray-200 shadow-sm p-10 text-center">
        <p className="text-gray-500 mb-4">Could not load your wishlist. Please try again.</p>
        <Button variant="outline" onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  const items = wishlist?.items ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="bg-white rounded-[12px] border border-gray-200 shadow-sm px-6 py-4">
        <h1 className="text-base font-semibold text-gray-900">Wishlist</h1>
        {items.length > 0 && (
          <p className="text-sm text-gray-500 mt-0.5">
            {items.length} saved item{items.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="bg-white rounded-[12px] border border-gray-200 shadow-sm p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4">
            <Heart size={28} className="text-rose-300" />
          </div>
          <h2 className="text-base font-semibold text-gray-900 mb-1">No saved items</h2>
          <p className="text-sm text-gray-500 mb-6">
            Tap the heart on any product to save it here.
          </p>
          <Button variant="primary" asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      )}

      {/* Item list */}
      {items.length > 0 && (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <WishlistItemRow key={item.id} item={item} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
