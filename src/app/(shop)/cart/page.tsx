'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag, Tag, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCartStore } from '@/stores/cart.store';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCartStore();
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const discount = couponApplied ? Math.round(subtotal() * 0.1) : 0;
  const shipping = subtotal() >= 50000 ? 0 : 2500;
  const total = subtotal() - discount + shipping;

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'SAVE10') {
      setCouponApplied(true);
    }
  };

  if (items.length === 0) {
    return (
      <div className="page-enter">
        <div className="container py-20 flex flex-col items-center text-center">
          <ShoppingBag size={60} className="text-gray-200 mb-5" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Browse our marketplace and add some products!</p>
          <Button variant="primary" size="lg" asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <div className="bg-gray-50 border-b border-gray-100 py-4">
        <div className="container">
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* Cart table */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-[10px] border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-500 border-b border-gray-100">
                <span>Product</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Subtotal</span>
              </div>

              {/* Items */}
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={`${item.productId}-${item.variantId}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-4 items-center p-5">
                      {/* Product info */}
                      <div className="flex items-center gap-4">
                        <Link href={`/products/${item.slug}`} className="w-16 h-20 flex-shrink-0 bg-gray-50 rounded-[6px] overflow-hidden">
                          <Image src={item.image} alt={item.name} width={64} height={80} className="w-full h-full object-cover" />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link href={`/products/${item.slug}`} className="text-sm font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-2">
                            {item.name}
                          </Link>
                          {item.variantName && (
                            <p className="text-xs text-gray-400 mt-0.5">{item.variantName}</p>
                          )}
                          <button
                            onClick={() => removeItem(item.productId, item.variantId)}
                            className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 mt-2 transition-colors"
                          >
                            <Trash2 size={11} /> Remove
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-sm font-semibold text-gray-900 md:text-right">
                        {formatPrice(item.price)}
                      </div>

                      {/* Qty */}
                      <div className="flex items-center border border-gray-200 rounded-[6px] overflow-hidden w-28">
                        <button
                          className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                        >
                          <Minus size={13} />
                        </button>
                        <span className="flex-1 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-sm font-bold text-primary md:text-right">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Footer actions */}
              <div className="flex items-center justify-between px-5 py-4 bg-gray-50">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/products">← Continue Shopping</Link>
                </Button>
                <button
                  onClick={clearCart}
                  className="text-xs text-gray-400 hover:text-rose-500 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Coupon */}
            <div className="mt-4 bg-white rounded-[10px] border border-gray-100 p-5">
              <p className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Tag size={15} className="text-primary" /> Apply Coupon
              </p>
              {couponApplied ? (
                <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                  Coupon SAVE10 applied — 10% off!
                  <button className="text-gray-400 hover:text-red-500 ml-auto" onClick={() => { setCouponApplied(false); setCoupon(''); }}>Remove</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Enter coupon code" className="flex-1" />
                  <Button variant="outline" size="base" onClick={applyCoupon}>Apply</Button>
                </div>
              )}
            </div>
          </div>

          {/* Order summary */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-[10px] border border-gray-100 p-5 sticky top-28">
              <h2 className="text-base font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.reduce((a, i) => a + i.quantity, 0)} items)</span>
                  <span className="font-medium text-gray-900">{formatPrice(subtotal())}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon discount</span>
                    <span>−{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium text-gray-900'}>
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-gray-400">Add {formatPrice(50000 - subtotal())} more for free shipping</p>
                )}
                <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-3 text-gray-900">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              <Button variant="primary" size="lg" className="w-full mt-5" rightIcon={<ArrowRight size={17} />} asChild>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>

              <div className="mt-4 flex items-center justify-center gap-3 text-xs text-gray-400">
                <span>Secured by</span>
                <span className="font-bold text-gray-600">Paystack</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
