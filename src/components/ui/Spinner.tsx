import { cn } from '@/lib/utils';

interface SpinnerProps { size?: 'sm' | 'base' | 'lg'; className?: string; }

const sizes = { sm: 'h-4 w-4', base: 'h-6 w-6', lg: 'h-8 w-8' };

export function Spinner({ size = 'base', className }: SpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        sizes[size],
        className,
      )}
      role="status"
      aria-label="Loading"
    />
  );
}

export function PageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Spinner size="lg" className="text-primary" />
    </div>
  );
}

export function SkeletonBox({ className }: { className?: string }) {
  return (
    <div className={cn('bg-gray-200 rounded animate-pulse', className)} />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-[6px] overflow-hidden bg-white border border-gray-100">
      <SkeletonBox className="aspect-product w-full" />
      <div className="p-3 space-y-2">
        <SkeletonBox className="h-3 w-2/3" />
        <SkeletonBox className="h-3 w-1/2" />
        <SkeletonBox className="h-5 w-1/3" />
      </div>
    </div>
  );
}
