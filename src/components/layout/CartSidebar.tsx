'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Drawer } from './Drawer';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/stores/cart.store';
import { useUIStore } from '@/stores/ui.store';
import { formatPrice } from '@/lib/utils';

export function CartSidebar() {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();
  const { cartOpen, setCartOpen } = useUIStore();

  const footer = (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Subtotal</span>
        <span className="font-semibold text-gray-900 text-base">
          {formatPrice(subtotal())}
        </span>
      </div>
      <p className="text-xs text-gray-400">Shipping & taxes calculated at checkout</p>
      <Button variant="primary" size="lg" className="w-full" asChild>
        <Link href="/checkout" onClick={() => setCartOpen(false)}>
          Proceed to Checkout
        </Link>
      </Button>
      <Button variant="outline" size="base" className="w-full" asChild>
        <Link href="/cart" onClick={() => setCartOpen(false)}>
          View Cart
        </Link>
      </Button>
    </div>
  );

  return (
    <Drawer
      open={cartOpen}
      onClose={() => setCartOpen(false)}
      side="right"
      title={`Shopping Cart (${items.length})`}
      footer={items.length > 0 ? footer : undefined}
    >
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full py-16 px-6 text-center">
          <ShoppingBag size={48} className="text-gray-200 mb-4" />
          <p className="font-semibold text-gray-700 mb-1">Your cart is empty</p>
          <p className="text-sm text-gray-400 mb-6">Add products to get started</p>
          <Button variant="primary" onClick={() => setCartOpen(false)} asChild>
            <Link href="/products">Shop Now</Link>
          </Button>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {items.map((item) => (
            <li key={`${item.productId}-${item.variantId}`} className="flex gap-3 p-4">
              <Link
                href={`/products/${item.slug}`}
                className="flex-shrink-0 w-16 h-20 bg-gray-50 rounded-[6px] overflow-hidden"
                onClick={() => setCartOpen(false)}
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={64}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.slug}`}
                  className="text-sm font-medium text-gray-900 hover:text-primary line-clamp-2 leading-snug"
                  onClick={() => setCartOpen(false)}
                >
                  {item.name}
                </Link>
                {item.variantName && (
                  <p className="text-xs text-gray-400 mt-0.5">{item.variantName}</p>
                )}
                <p className="text-sm font-semibold text-primary mt-1">
                  {formatPrice(item.price)}
                </p>

                <div className="flex items-center justify-between mt-2">
                  {/* Qty stepper */}
                  <div className="flex items-center border border-gray-200 rounded-[6px] overflow-hidden">
                    <button
                      className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    className="text-gray-400 hover:text-rose-500 transition-colors p-1"
                    onClick={() => removeItem(item.productId, item.variantId)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}
