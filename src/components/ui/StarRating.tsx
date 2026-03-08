'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: 'sm' | 'base' | 'lg';
  count?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

const sizes = { sm: 12, base: 14, lg: 18 };

export function StarRating({
  rating,
  max = 5,
  size = 'base',
  count,
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  const px = sizes[size];

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;

        return (
          <button
            key={i}
            type={interactive ? 'button' : undefined}
            onClick={interactive ? () => onChange?.(i + 1) : undefined}
            className={cn(
              'relative',
              interactive && 'hover:scale-110 transition-transform',
              !interactive && 'pointer-events-none',
            )}
            style={{ width: px, height: px }}
          >
            {/* Background star */}
            <Star
              size={px}
              className="text-gray-200 fill-gray-200"
            />
            {/* Filled overlay */}
            {(filled || half) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: filled ? '100%' : '50%' }}
              >
                <Star size={px} className="text-amber-400 fill-amber-400" />
              </span>
            )}
          </button>
        );
      })}
      {count !== undefined && (
        <span className="ml-1 text-xs text-gray-500">({count})</span>
      )}
    </div>
  );
}
