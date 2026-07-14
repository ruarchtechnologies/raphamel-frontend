'use client';

import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWishlistToggle } from '@/features/wishlist/hooks/useWishlist';

interface WishlistButtonProps {
  variantId: string | undefined;
  /** 'overlay' — floating on product image (default); 'inline' — bare icon button */
  variant?: 'overlay' | 'inline';
  className?: string;
}

export function WishlistButton({
  variantId,
  variant = 'overlay',
  className,
}: WishlistButtonProps) {
  const { isInWishlist, toggle, isPending } = useWishlistToggle(variantId);

  if (variant === 'inline') {
    return (
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(); }}
        disabled={isPending}
        aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        className={cn(
          'w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center transition-all duration-150',
          'hover:text-rose-500 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed',
          isInWishlist ? 'text-rose-500' : 'text-gray-400',
          className,
        )}
      >
        <Heart size={16} className={cn('transition-all', isInWishlist && 'fill-current')} />
      </button>
    );
  }

  // overlay variant — sits on top of the product image
  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(); }}
      disabled={isPending}
      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      className={cn(
        'w-[30px] h-[30px] rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm',
        'transition-all duration-150 hover:bg-white hover:scale-110 active:scale-95',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
    >
      <Heart
        size={16}
        className={cn(
          'transition-colors duration-150',
          isInWishlist ? 'fill-rose-500 text-rose-500' : 'text-gray-500',
        )}
      />
    </button>
  );
}
