'use client';

export const runtime = 'edge';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Share2, Truck, Shield, RefreshCcw, BadgeCheck, Minus, Plus, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import { PriceDisplay } from '@/components/products/PriceDisplay';
import { useCartStore } from '@/stores/cart.store';
import { useUIStore } from '@/stores/ui.store';
import { cn } from '@/lib/utils';

// Mock product — replace with API call
const PRODUCT = {
  id: '1',
  slug: 'wireless-headphones-pro',
  name: 'Wireless Noise-Cancelling Headphones Pro',
  price: 45000,
  compareAtPrice: 65000,
  description: 'Experience crystal-clear audio with our premium wireless headphones featuring active noise cancellation, 30-hour battery life, and premium leather ear cushions for all-day comfort.',
  rating: 4.5,
  reviewCount: 312,
  stock: 14,
  sku: 'WH-PRO-BLK',
  vendor: { name: 'TechGadgets NG', slug: 'techgadgets-ng', verified: true },
  category: { name: 'Electronics', slug: 'electronics' },
  images: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=700&fit=crop',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=700&fit=crop',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=700&fit=crop',
    'https://images.unsplash.com/photo-1546435770-a3e736bb3d9e?w=600&h=700&fit=crop',
  ],
  variants: [
    { id: 'v1', name: 'Black', stock: 14 },
    { id: 'v2', name: 'White', stock: 6 },
    { id: 'v3', name: 'Midnight Blue', stock: 0 },
  ],
  features: ['Active Noise Cancellation', '30hr Battery Life', 'Bluetooth 5.0', 'Built-in Microphone', 'Foldable Design'],
};

const REVIEWS = [
  { id: '1', user: 'Chidi O.', rating: 5, date: '2026-02-15', body: 'Absolutely love these headphones! The sound quality is phenomenal and the ANC works great on my commute.' },
  { id: '2', user: 'Amaka N.', rating: 4, date: '2026-01-28', body: 'Great headphones for the price. Battery life is as advertised. Would recommend.' },
  { id: '3', user: 'Bello S.', rating: 5, date: '2026-01-10', body: 'Best purchase I\'ve made this year. Very comfortable even after 4 hours of use.' },
];

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [mainImg, setMainImg] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(PRODUCT.variants[0].id);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<'description' | 'reviews'>('description');

  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useUIStore((s) => s.setCartOpen);

  const variant = PRODUCT.variants.find((v) => v.id === selectedVariant);

  const handleAddToCart = () => {
    addItem({
      id: PRODUCT.id,
      productId: PRODUCT.id,
      name: PRODUCT.name,
      price: PRODUCT.price,
      image: PRODUCT.images[0],
      slug: PRODUCT.slug,
      quantity: qty,
      variantId: selectedVariant,
      variantName: variant?.name,
    });
    toast.success('Added to cart', { description: PRODUCT.name });
    setCartOpen(true);
  };

  return (
    <div className="page-enter">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100 py-4">
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: PRODUCT.category.name, href: `/categories/${PRODUCT.category.slug}` },
              { label: PRODUCT.name },
            ]}
          />
        </div>
      </div>

      <div className="container py-8">
        {/* Main product layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Gallery */}
          <div className="lg:w-[48%] flex-shrink-0">
            <div className="flex flex-col-reverse md:flex-row gap-3">
              {/* Thumbnails */}
              <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible md:w-16">
                {PRODUCT.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImg(i)}
                    className={cn(
                      'flex-shrink-0 w-14 h-16 md:w-full md:h-20 rounded-[6px] overflow-hidden border-2 transition-all',
                      i === mainImg ? 'border-primary' : 'border-transparent hover:border-gray-300',
                    )}
                  >
                    <Image src={img} alt={`View ${i + 1}`} width={56} height={80} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Main image */}
              <div className="flex-1 relative aspect-[4/5] rounded-[10px] overflow-hidden bg-gray-50">
                <motion.div
                  key={mainImg}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={PRODUCT.images[mainImg]}
                    alt={PRODUCT.name}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </motion.div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <Badge variant="sale">-{Math.round(((PRODUCT.compareAtPrice - PRODUCT.price) / PRODUCT.compareAtPrice) * 100)}%</Badge>
                </div>

                {/* Wishlist */}
                <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-rose-500 hover:scale-110 transition-all">
                  <Heart size={16} />
                </button>
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
            {/* Vendor */}
            <Link
              href={`/vendors/${PRODUCT.vendor.slug}`}
              className="inline-flex items-center gap-1 text-xs text-primary font-semibold mb-2 hover:underline"
            >
              {PRODUCT.vendor.name}
              {PRODUCT.vendor.verified && <BadgeCheck size={13} />}
            </Link>

            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-3">
              {PRODUCT.name}
            </h1>

            {/* Meta row */}
            <div className="flex items-center flex-wrap gap-3 mb-4">
              <StarRating rating={PRODUCT.rating} count={PRODUCT.reviewCount} />
              <span className="text-sm text-gray-400">·</span>
              <span className="text-sm text-gray-500">SKU: {PRODUCT.sku}</span>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-gray-100 mb-5">
              <PriceDisplay price={PRODUCT.price} compareAtPrice={PRODUCT.compareAtPrice} size="lg" />
              <Badge variant={PRODUCT.stock > 0 ? 'green' : 'out'}>
                {PRODUCT.stock > 0 ? `In Stock (${PRODUCT.stock})` : 'Out of Stock'}
              </Badge>
            </div>

            {/* Variants */}
            {PRODUCT.variants.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-semibold text-gray-800 mb-2">
                  Color: <span className="font-normal text-gray-600">{variant?.name}</span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {PRODUCT.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v.id)}
                      disabled={v.stock === 0}
                      className={cn(
                        'h-9 px-4 text-sm rounded-[6px] border-2 transition-all',
                        v.id === selectedVariant
                          ? 'border-primary text-primary font-semibold bg-primary/5'
                          : v.stock === 0
                          ? 'border-gray-200 text-gray-300 cursor-not-allowed line-through'
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
                leftIcon={<ShoppingCart size={17} />}
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>

              <Button variant="outline" size="icon" aria-label="Share">
                <Share2 size={18} />
              </Button>
            </div>

            {/* Features */}
            {PRODUCT.features.length > 0 && (
              <div className="mb-5 p-4 bg-gray-50 rounded-[8px]">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Key Features</p>
                <ul className="space-y-1.5">
                  {PRODUCT.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Delivery info */}
            <div className="space-y-2.5">
              {[
                { icon: Truck,        label: 'Free delivery on orders over ₦50,000' },
                { icon: Shield,       label: 'Secure payment via Paystack' },
                { icon: RefreshCcw,   label: '7-day returns — hassle free' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 text-sm text-gray-600">
                  <Icon size={15} className="text-primary flex-shrink-0" />
                  {label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tabs: Description / Reviews */}
        <div className="mt-12">
          <div className="flex gap-0 border-b border-gray-200 mb-6">
            {(['description', 'reviews'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'px-6 py-3 text-sm font-semibold capitalize border-b-2 transition-colors',
                  tab === t
                    ? 'text-primary border-primary'
                    : 'text-gray-500 border-transparent hover:text-gray-800',
                )}
              >
                {t === 'reviews' ? `Reviews (${PRODUCT.reviewCount})` : 'Description'}
              </button>
            ))}
          </div>

          {tab === 'description' ? (
            <div className="max-w-2xl text-gray-700 leading-relaxed">
              <p>{PRODUCT.description}</p>
            </div>
          ) : (
            <div className="max-w-2xl space-y-4">
              {REVIEWS.map((rev) => (
                <div key={rev.id} className="p-5 bg-gray-50 rounded-[8px]">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{rev.user}</p>
                      <StarRating rating={rev.rating} size="sm" className="mt-0.5" />
                    </div>
                    <span className="text-xs text-gray-400">{rev.date}</span>
                  </div>
                  <p className="text-sm text-gray-600">{rev.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
