'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

// ─── Blur-placeholder utilities ────────────────────────────────────────────────
//
// These can be passed to <Image placeholder="blur" blurDataURL={shimmer(w, h)} />
// as a lightweight SVG fallback for statically-imported images that don't ship
// with a real low-res LQIP (Low Quality Image Placeholder).
//
// Usage:
//   import { shimmer } from '@/components/ui/OptimizedImage';
//   <Image placeholder="blur" blurDataURL={shimmer(400, 300)} ... />

function toBase64(str: string): string {
  // Buffer is available on the server; btoa on the client.
  if (typeof window === 'undefined') return Buffer.from(str).toString('base64');
  return window.btoa(str);
}

/**
 * Generates a base64-encoded animated SVG shimmer for use as a blurDataURL.
 *
 * @example
 * <Image placeholder="blur" blurDataURL={shimmer(400, 300)} src="..." alt="..." width={400} height={300} />
 */
export function shimmer(w: number, h: number): string {
  const svg = `
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="20%"  stop-color="#e2e8f0"/>
          <stop offset="50%"  stop-color="#f8fafc"/>
          <stop offset="80%"  stop-color="#e2e8f0"/>
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#e2e8f0"/>
      <rect width="${w}" height="${h}" fill="url(#g)">
        <animate attributeName="x" from="-${w}" to="${w}" dur="1.4s" repeatCount="indefinite"/>
      </rect>
    </svg>`;
  return `data:image/svg+xml;base64,${toBase64(svg.trim())}`;
}

// ─── Component types ───────────────────────────────────────────────────────────

type OptimizedImageProps = Omit<ImageProps, 'placeholder' | 'blurDataURL'> & {
  /**
   * Extra className applied to the outer wrapper <div>.
   * In fill mode the wrapper is `position: absolute; inset: 0` — use this to
   * override if your layout requires a different positioning strategy.
   */
  wrapperClassName?: string;
};

// ─── OptimizedImage ────────────────────────────────────────────────────────────
//
// A drop-in replacement for Next.js <Image /> that adds:
//   1. A CSS-only animated shimmer skeleton while the image is loading
//   2. A smooth opacity fade-in once the image is ready
//   3. Sensible defaults: quality=85, lazy loading, eager when priority=true
//
// STACKING MODEL:
//   Wrapper  (position: relative OR absolute inset-0)
//     ├─ Shimmer div  z-[1]  — fades out on load
//     └─ <img>        z-[2]  — fades in  on load
//
// USAGE — fixed size:
//   <OptimizedImage src="/products/gloves.jpg" alt="Gloves" width={400} height={300} />
//
// USAGE — fill / responsive (parent must have position: relative + explicit height):
//   <div className="relative h-48 w-full">
//     <OptimizedImage src="/hero.jpg" alt="Hero" fill sizes="100vw" />
//   </div>
//
// USAGE — above the fold (loads immediately, not lazy):
//   <OptimizedImage src="/hero.jpg" alt="Hero" width={1200} height={600} priority />

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill,
  className,
  wrapperClassName,
  priority = false,
  sizes,
  quality = 85,
  ...rest
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  //
  // Wrapper sizing strategy
  // ─────────────────────────────────────────────────────────────────────────
  // fill=false (fixed size):
  //   Wrapper gets an explicit width/height via inline style so the shimmer
  //   (position: absolute; inset: 0) has a real bounding box to fill.
  //   Without this the shimmer collapses to 0 height because it has no
  //   in-flow sibling to inherit dimensions from.
  //
  // fill=true:
  //   The <OptimizedImage> wrapper must be the DIRECT positioned ancestor of
  //   the Next.js <Image fill>. We use `relative h-full w-full` so the
  //   wrapper fills the consumer's sized container without adding a second
  //   layer of absolute positioning (which is what caused the height-0 warning).
  //   The consumer's parent MUST have `position: relative` and an explicit height.
  //
  const wrapperBase = fill
    ? 'relative h-full w-full overflow-hidden'
    : 'relative overflow-hidden';

  const wrapperStyle =
    !fill && width != null && height != null
      ? { width: Number(width), height: Number(height) }
      : undefined;

  return (
    <div className={cn(wrapperBase, wrapperClassName)} style={wrapperStyle}>
      {/*
       * Shimmer skeleton
       * ─────────────────
       * .shimmer-gradient   → gradient defined in globals.css (dark mode aware)
       * animate-shimmer     → keyframe defined in tailwind.config.ts
       * transition-opacity  → fades out smoothly once the image loads
       * pointer-events-none → prevents ghost click-blocking after fade-out
       */}
      <div
        aria-hidden="true"
        className={cn(
          'shimmer-gradient animate-shimmer',
          'absolute inset-0 z-[1]',
          'transition-opacity duration-300 ease-in-out',
          isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100',
        )}
      />

      {/*
       * Actual image
       * ────────────
       * Starts invisible (opacity-0), fades in via onLoad callback.
       * `relative z-[2]` keeps it above the shimmer in the stacking order.
       * `loading` is derived from `priority` so callers only set one prop.
       */}
      <Image
        src={src}
        alt={alt}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        fill={fill}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        sizes={sizes}
        quality={quality}
        className={cn(
          'relative z-[2]',
          'transition-opacity duration-[400ms] ease-in-out',
          isLoaded ? 'opacity-100' : 'opacity-0',
          // In fixed-size mode the global reset `img { height: auto }` overrides
          // the height attribute, shrinking the image and leaving white space in
          // the wrapper. `w-full h-full` has higher CSS specificity (class selector)
          // than the element reset, so it wins and the image fills the wrapper.
          !fill && 'w-full h-full',
          className,
        )}
        onLoad={() => setIsLoaded(true)}
        {...rest}
      />
    </div>
  );
}
