import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center font-bold text-[0.75rem] min-h-[22px] px-[6px] py-[4px] rounded-[4px] leading-none',
  {
    variants: {
      variant: {
        default:   'bg-gray-200 text-gray-800',
        filled:    'bg-gray-600 text-white',
        primary:   'bg-[#0071DC] text-white',
        red:       'bg-red-100 text-red-700',
        'red-solid': 'bg-red-600 text-white',
        sky:       'bg-sky-100 text-sky-700',
        lime:      'bg-lime-100 text-lime-700',
        green:     'bg-green-100 text-green-700',
        'green-solid': 'bg-green-600 text-white',
        blue:      'bg-blue-100 text-blue-700',
        orange:    'bg-orange-100 text-orange-700',
        yellow:    'bg-yellow-100 text-yellow-800',
        'yellow-solid': 'bg-[#FACC15] text-gray-900',
        black:     'bg-gray-900 text-white',
        white:     'bg-white text-gray-900 border border-gray-200',
        sale:      'bg-[#0071DC] text-white',
        new:       'bg-[#FACC15] text-gray-900',
        hot:       'bg-rose-600 text-white',
        out:       'bg-gray-200 text-gray-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
