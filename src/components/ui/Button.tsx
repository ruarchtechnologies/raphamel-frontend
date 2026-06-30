'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 font-medium rounded-[6px]',
    'transition-all duration-100 ease-[cubic-bezier(0.25,0.1,0.25,1)]',
    'select-none whitespace-nowrap',
    'disabled:opacity-50 disabled:pointer-events-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
  ],
  {
    variants: {
      variant: {
        default:
          'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300',
        primary:
          'bg-[#0071DC] text-white hover:bg-[#005bb5] active:bg-[#004a99] shadow-sm',
        outline:
          'border border-gray-300 bg-white text-gray-800 hover:border-gray-400 hover:bg-gray-50 active:bg-gray-100',
        'outline-primary':
          'border border-[#0071DC] bg-white text-[#0071DC] hover:bg-[#0071DC] hover:text-white',
        ghost:
          'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200',
        danger:
          'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm',
        secondary:
          'bg-[#FACC15] text-gray-900 hover:bg-[#e6b800] active:bg-[#d4a800] font-semibold',
        link:
          'bg-transparent text-[#0071DC] hover:underline p-0 h-auto',
        dark:
          'bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-700 shadow-sm',
      },
      size: {
        xs:   'h-8 px-3 text-xs',
        sm:   'h-[38px] px-4 text-sm',
        base: 'h-11 px-5 text-[0.9375rem]',
        lg:   'h-12 px-6 text-base',
        icon: 'h-10 w-10 p-0',
        'icon-sm': 'h-8 w-8 p-0 rounded-full',
        'icon-lg': 'h-12 w-12 p-0 rounded-full',
      },
      rounded: {
        default: 'rounded-[6px]',
        full:    'rounded-full',
        none:    'rounded-none',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'base',
      rounded: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      rounded,
      loading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      asChild = false,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref as any}
        className={cn(buttonVariants({ variant, size, rounded, className }))}
        disabled={!asChild ? (disabled || loading) : undefined}
        type={asChild ? undefined : type}
        {...props}
      >
        {asChild ? children : loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </Comp>
    );
  },
);

Button.displayName = 'Button';

export { Button, buttonVariants };
