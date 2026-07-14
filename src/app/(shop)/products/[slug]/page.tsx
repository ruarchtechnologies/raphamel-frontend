'use client';

import { use, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Share2, Truck, Shield, RefreshCcw, Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PriceDisplay } from '@/components/products/PriceDisplay';
import { useAddToCart } from '@/features/cart/hooks/useCart';
import { useProductBySlug } from '@/features/catalog/hooks/useProducts';
import { WishlistButton } from '@/components/products/WishlistButton';
import { cn } from '@/lib/utils';

// ── Skeleton ──────────────────────────────────────────────────────────────────

function ProductDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="lg:w-[48%] flex-shrink-0">
            <div className="aspect-[4/5] bg-gray-200 rounded-[10px]" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-1/3" />
            <div className="h-10 bg-gray-200 rounded w-1/2" />
            <div className="h-12 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Option selector ───────────────────────────────────────────────────────────

interface OptionGroupProps {
  title: string;
  values: string[];
  selected: string | undefined;
  onSelect: (value: string) => void;
  isValueAvailable: (value: string) => boolean;
}

function OptionGroup({ title, values, selected, onSelect, isValueAvailable }: OptionGroupProps) {
  return (
    <div className="mb-4">
      <p className="text-sm font-semibold text-gray-800 mb-2">
        {title}:{' '}
        {selected && <span className="font-normal text-gray-600">{selected}</span>}
      </p>
      <div className="flex gap-2 flex-wrap">
        {values.map((value) => {
          const available = isValueAvailable(value);
          const active = selected === value;
          return (
            <button
              key={value}
              onClick={() => available && onSelect(value)}
              disabled={!available}
              className={cn(
                'h-9 px-4 text-sm rounded-[6px] border-2 transition-all',
                active
                  ? 'border-primary text-primary font-semibold bg-primary/5'
                  : available
                  ? 'border-gray-200 text-gray-700 hover:border-gray-400'
                  : 'border-gray-100 text-gray-300 cursor-not-allowed line-through',
              )}
            >
              {value}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: product, isPending, isError } = useProductBySlug(slug);

  const [mainImg, setMainImg] = useState(0);
  const [qty, setQty] = useState(1);

  // selectedOptions maps each option title to its currently chosen value.
  // Initialised lazily to the first variant's option values once product loads.
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [optionsInitialised, setOptionsInitialised] = useState(false);

  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();

  const variants = product?.variants ?? [];
  const options  = product?.options  ?? [];

  // Pre-select the first available variant's option values on first load.
  if (product && !optionsInitialised && variants.length > 0 && options.length > 0) {
    const firstAvailable = variants.find((v) => v.stock > 0) ?? variants[0];
    if (firstAvailable.optionValues && Object.keys(firstAvailable.optionValues).length > 0) {
      setSelectedOptions(firstAvailable.optionValues);
    }
    setOptionsInitialised(true);
  }

  // Resolved variant: every option value must match the current selection.
  const resolvedVariant = useMemo(() => {
    if (options.length === 0) return variants[0] ?? null;
    const selectionComplete = options.every((o) => selectedOptions[o.title] !== undefined);
    if (!selectionComplete) return null;
    return (
      variants.find((v) =>
        options.every((o) => v.optionValues?.[o.title] === selectedOptions[o.title]),
      ) ?? null
    );
  }, [variants, options, selectedOptions]);

  // Derive display price and stock from the resolved variant when available.
  const displayPrice      = resolvedVariant?.price ?? product?.price ?? 0;
  const displayStock      = resolvedVariant?.stock ?? product?.stock ?? 0;
  const compareAtPrice    = product?.compareAtPrice;

  const salePercent =
    compareAtPrice && compareAtPrice > displayPrice
      ? Math.round(((compareAtPrice - displayPrice) / compareAtPrice) * 100)
      : null;

  // For a given option group and candidate value, check whether any variant
  // satisfies that value combined with all OTHER currently-selected options.
  function isValueAvailable(optionTitle: string, value: string): boolean {
    return variants.some((v) => {
      if (v.optionValues?.[optionTitle] !== value) return false;
      return options
        .filter((o) => o.title !== optionTitle)
        .every((o) => {
          const sel = selectedOptions[o.title];
          return sel === undefined || v.optionValues?.[o.title] === sel;
        });
    });
  }

  function handleSelect(optionTitle: string, value: string) {
    setSelectedOptions((prev) => ({ ...prev, [optionTitle]: value }));
  }

  function handleAddToCart() {
    if (!resolvedVariant?.id) {
      const missing = options.find((o) => !selectedOptions[o.title]);
      toast.error(missing ? `Please select a ${missing.title}` : 'This product is not available.');
      return;
    }
    addToCart(
      {
        variantId: resolvedVariant.id,
        quantity: qty,
        title: product!.name,
        thumbnail: product!.images?.[0],
        unitPrice: displayPrice,
      },
      {
        onSuccess: () => {
          toast.success('Added to cart', { description: product!.name });
        },
      },
    );
  }

  // Unselected options the customer still needs to pick.
  const missingOption = options.find((o) => !selectedOptions[o.title]);

  if (isPending) return <ProductDetailSkeleton />;

  if (isError || !product) {
    return (
      <div className="container py-20 text-center">
        <p className="text-2xl font-bold text-gray-900 mb-2">Product not found</p>
        <p className="text-gray-500 mb-6">This product may have been removed or the link is incorrect.</p>
        <Button variant="primary" asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  const images = product.images.length ? product.images : ['/images/product-placeholder.png'];
  const safeMainImg = Math.min(mainImg, images.length - 1);

  const canAddToCart = Boolean(resolvedVariant) && displayStock > 0;

  return (
    <div className="page-enter">
      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Gallery */}
          <div className="lg:w-[48%] flex-shrink-0">
            <div className="flex flex-col-reverse md:flex-row gap-3">
              {images.length > 1 && (
                <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible md:w-16">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setMainImg(i)}
                      className={cn(
                        'flex-shrink-0 w-14 h-16 md:w-full md:h-20 rounded-[6px] overflow-hidden border-2 transition-all',
                        i === safeMainImg ? 'border-primary' : 'border-transparent hover:border-gray-300',
                      )}
                    >
                      <Image src={img} alt={`View ${i + 1}`} width={56} height={80} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              <div className="flex-1 relative aspect-[4/5] rounded-[10px] overflow-hidden bg-gray-50">
                <motion.div
                  key={safeMainImg}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={images[safeMainImg]}
                    alt={product.name}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </motion.div>

                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {salePercent && <Badge variant="sale">-{salePercent}%</Badge>}
                </div>

                <WishlistButton
                  variantId={resolvedVariant?.id}
                  variant="inline"
                  className="absolute top-3 right-3"
                />
              </div>
            </div>
          </div>

          {/* Product info */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-3">
              {product.name}
            </h1>

            {product.sku && (
              <p className="text-sm text-gray-400 mb-3">SKU: {product.sku}</p>
            )}

            {/* Price + stock — update live as resolved variant changes */}
            <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-gray-100 mb-5">
              <PriceDisplay price={displayPrice} compareAtPrice={compareAtPrice} size="lg" />
              <Badge variant={displayStock > 0 ? 'green' : 'out'}>
                {displayStock > 0 ? 'In Stock' : 'Out of Stock'}
              </Badge>
            </div>

            {/* Per-option selector groups */}
            {options.length > 0 && (
              <div className="mb-5">
                {options.map((option) => (
                  <OptionGroup
                    key={option.id}
                    title={option.title}
                    values={option.values}
                    selected={selectedOptions[option.title]}
                    onSelect={(value) => handleSelect(option.title, value)}
                    isValueAvailable={(value) => isValueAvailable(option.title, value)}
                  />
                ))}
              </div>
            )}

            {/* Fallback: single-option products with no structured options */}
            {options.length === 0 && variants.length > 1 && (
              <div className="mb-5">
                <p className="text-sm font-semibold text-gray-800 mb-2">Variant</p>
                <div className="flex gap-2 flex-wrap">
                  {variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedOptions({ _variant: v.id })}
                      disabled={v.stock === 0}
                      className={cn(
                        'h-9 px-4 text-sm rounded-[6px] border-2 transition-all',
                        selectedOptions['_variant'] === v.id
                          ? 'border-primary text-primary font-semibold bg-primary/5'
                          : v.stock === 0
                          ? 'border-gray-100 text-gray-300 cursor-not-allowed line-through'
                          : 'border-gray-200 text-gray-700 hover:border-gray-400',
                      )}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to cart */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center border border-gray-200 rounded-[6px] overflow-hidden h-11">
                <button
                  className="w-11 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center font-semibold text-sm">{qty}</span>
                <button
                  className="w-11 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                  onClick={() => setQty((q) => q + 1)}
                >
                  <Plus size={14} />
                </button>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                aria-label="Add to cart"
                leftIcon={<ShoppingCart size={17} />}
                onClick={handleAddToCart}
                loading={isAddingToCart}
                disabled={!canAddToCart || isAddingToCart}
              >
                {displayStock === 0
                  ? 'Out of Stock'
                  : missingOption
                  ? `Select a ${missingOption.title}`
                  : 'Add to Cart'}
              </Button>

              <Button variant="outline" size="icon" aria-label="Share">
                <Share2 size={18} />
              </Button>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-5 p-4 bg-gray-50 rounded-[8px]">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Description</p>
                <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Delivery info */}
            <div className="space-y-2.5">
              {[
                { icon: Truck,      label: 'Free delivery on orders over ₦50,000' },
                { icon: Shield,     label: 'Secure payment via Paystack'           },
                { icon: RefreshCcw, label: '7-day returns — hassle free'           },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 text-sm text-gray-600">
                  <Icon size={15} className="text-primary flex-shrink-0" />
                  {label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
