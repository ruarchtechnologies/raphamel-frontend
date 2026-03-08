'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  slug: string;
  variantId?: string;
  variantName?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  itemCount: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items;
        const key = item.variantId ?? item.productId;
        const existing = items.find(
          (i) => (i.variantId ?? i.productId) === key,
        );
        if (existing) {
          set({
            items: items.map((i) =>
              (i.variantId ?? i.productId) === key
                ? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
                : i,
            ),
          });
        } else {
          set({ items: [...items, { ...item, quantity: item.quantity ?? 1 }] });
        }
      },

      removeItem: (productId, variantId) => {
        const key = variantId ?? productId;
        set({
          items: get().items.filter((i) => (i.variantId ?? i.productId) !== key),
        });
      },

      updateQuantity: (productId, quantity, variantId) => {
        const key = variantId ?? productId;
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }
        set({
          items: get().items.map((i) =>
            (i.variantId ?? i.productId) === key ? { ...i, quantity } : i,
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      itemCount: () => get().items.reduce((acc, i) => acc + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    }),
    { name: 'raphamel-cart' },
  ),
);
