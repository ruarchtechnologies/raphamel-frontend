import { cn } from '@/lib/utils';
import { formatPrice, getDiscountPercent } from '@/lib/utils';

interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number;
  size?: 'sm' | 'base' | 'lg';
  className?: string;
}

const priceSize = {
  sm:   'text-base',
  base: 'text-lg',
  lg:   'text-2xl',
};

const oldSize = {
  sm:   'text-xs',
  base: 'text-sm',
  lg:   'text-base',
};

export function PriceDisplay({ price, compareAtPrice, size = 'base', className }: PriceDisplayProps) {
  const hasDiscount = compareAtPrice && compareAtPrice > price;
  const percent = hasDiscount ? getDiscountPercent(compareAtPrice!, price) : 0;

  return (
    <div className={cn('flex items-baseline flex-wrap gap-x-2 gap-y-0.5', className)}>
      <span className={cn('font-bold text-primary', priceSize[size])}>
        {formatPrice(price)}
      </span>
      {hasDiscount && (
        <>
          <span className={cn('font-medium text-gray-400 line-through', oldSize[size])}>
            {formatPrice(compareAtPrice!)}
          </span>
          {percent > 0 && (
            <span className="text-xs font-bold text-rose-600">−{percent}%</span>
          )}
        </>
      )}
    </div>
  );
}
