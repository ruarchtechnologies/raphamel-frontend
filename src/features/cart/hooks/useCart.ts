'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getOrCreateCart,
  addLineItem,
  updateLineItem,
  removeLineItem,
  clearCartId,
} from '@/data/api/cart.api';
import { useUIStore } from '@/stores/ui.store';

export const cartKeys = {
  cart: ['cart'] as const,
};

/** Fetch (or create) the current Medusa cart. Always returns a cart. */
export function useCart() {
  return useQuery({
    queryKey: cartKeys.cart,
    queryFn: getOrCreateCart,
    staleTime: 1000 * 30,   // 30 s — cart data is fresh enough for most interactions
    retry: 1,
  });
}

/** Add a variant to the cart. Creates the cart if one does not exist yet. */
export function useAddToCart() {
  const queryClient = useQueryClient();
  const setCartOpen = useUIStore((s) => s.setCartOpen);

  return useMutation({
    mutationFn: async ({ variantId, quantity }: { variantId: string; quantity: number }) => {
      const cart = await getOrCreateCart();
      return addLineItem(cart.id, variantId, quantity);
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(cartKeys.cart, updatedCart);
      setCartOpen(true);
    },
    onError: () => {
      toast.error('Could not add item to cart. Please try again.');
    },
  });
}

/** Update the quantity of a line item already in the cart. */
export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cartId,
      lineItemId,
      quantity,
    }: {
      cartId: string;
      lineItemId: string;
      quantity: number;
    }) => updateLineItem(cartId, lineItemId, quantity),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(cartKeys.cart, updatedCart);
    },
    onError: () => {
      toast.error('Could not update cart.');
    },
  });
}

/** Remove a line item from the cart. */
export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cartId, lineItemId }: { cartId: string; lineItemId: string }) =>
      removeLineItem(cartId, lineItemId),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(cartKeys.cart, updatedCart);
      toast.success('Item removed from cart.');
    },
    onError: () => {
      toast.error('Could not remove item.');
    },
  });
}

/**
 * Returns a function that clears the cart both from localStorage and the
 * React Query cache. Call this after a successful order placement.
 */
export function useClearCart() {
  const queryClient = useQueryClient();

  return () => {
    clearCartId();
    queryClient.removeQueries({ queryKey: cartKeys.cart });
  };
}

/** Derived count of all items in the cart (sum of quantities). */
export function useCartItemCount(): number {
  const { data: cart } = useCart();
  return cart?.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0;
}
