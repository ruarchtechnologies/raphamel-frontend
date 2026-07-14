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

type CartData = Awaited<ReturnType<typeof getOrCreateCart>>;
type CartItem = NonNullable<CartData['items']>[number];

function recalcTotals(items: CartItem[], shippingTotal: number) {
  const subtotal = items.reduce((sum, i) => sum + ((i as any).unit_price ?? 0) * i.quantity, 0);
  return { subtotal, total: subtotal + shippingTotal };
}

/** Fetch (or create) the current Medusa cart. Always returns a cart. */
export function useCart() {
  return useQuery({
    queryKey: cartKeys.cart,
    queryFn: getOrCreateCart,
    staleTime: 1000 * 30,
    retry: 1,
  });
}

export interface AddToCartParams {
  variantId: string;
  quantity: number;
  /** Pass these so the cart opens instantly with the item visible before the server responds. */
  title?: string;
  thumbnail?: string;
  unitPrice?: number;
}

/** Add a variant to the cart. Creates the cart if one does not exist yet. */
export function useAddToCart() {
  const queryClient = useQueryClient();
  const setCartOpen = useUIStore((s) => s.setCartOpen);

  return useMutation({
    mutationFn: async ({ variantId, quantity }: AddToCartParams) => {
      const cached = queryClient.getQueryData<CartData>(cartKeys.cart);
      const cart = cached ?? (await getOrCreateCart());
      return addLineItem(cart.id, variantId, quantity);
    },
    onMutate: async ({ variantId, quantity, title, thumbnail, unitPrice }) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.cart });
      const previous = queryClient.getQueryData<CartData>(cartKeys.cart);

      if (previous && title && unitPrice !== undefined) {
        const shippingTotal = (previous as any).shipping_total ?? 0;
        const existing = previous.items?.find((i) => (i as any).variant_id === variantId);

        const items: CartItem[] = existing
          ? (previous.items ?? []).map((i) =>
              (i as any).variant_id === variantId
                ? { ...i, quantity: i.quantity + quantity, subtotal: (i as any).unit_price * (i.quantity + quantity) }
                : i
            )
          : [
              ...(previous.items ?? []),
              {
                id: `optimistic_${Date.now()}`,
                title,
                subtitle: null,
                thumbnail: thumbnail ?? null,
                quantity,
                unit_price: unitPrice,
                subtotal: unitPrice * quantity,
                variant_id: variantId,
              } as unknown as CartItem,
            ];

        queryClient.setQueryData<CartData>(cartKeys.cart, {
          ...previous,
          items,
          ...recalcTotals(items, shippingTotal),
        });
      }

      setCartOpen(true);
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(cartKeys.cart, ctx.previous);
      toast.error('Could not add item to cart. Please try again.');
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(cartKeys.cart, updatedCart);
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
    onMutate: async ({ lineItemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.cart });
      const previous = queryClient.getQueryData<CartData>(cartKeys.cart);

      queryClient.setQueryData<CartData>(cartKeys.cart, (old) => {
        if (!old) return old;
        const shippingTotal = (old as any).shipping_total ?? 0;
        const items = (old.items ?? []).map((i) =>
          i.id === lineItemId
            ? { ...i, quantity, subtotal: (i as any).unit_price * quantity }
            : i,
        );
        return { ...old, items, ...recalcTotals(items, shippingTotal) };
      });

      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(cartKeys.cart, ctx.previous);
      toast.error('Could not update cart.');
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(cartKeys.cart, updatedCart);
    },
  });
}

/** Remove a line item from the cart. */
export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cartId, lineItemId }: { cartId: string; lineItemId: string }) =>
      removeLineItem(cartId, lineItemId),
    onMutate: async ({ lineItemId }) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.cart });
      const previous = queryClient.getQueryData<CartData>(cartKeys.cart);

      queryClient.setQueryData<CartData>(cartKeys.cart, (old) => {
        if (!old) return old;
        const shippingTotal = (old as any).shipping_total ?? 0;
        const items = (old.items ?? []).filter((i) => i.id !== lineItemId);
        return { ...old, items, ...recalcTotals(items, shippingTotal) };
      });

      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(cartKeys.cart, ctx.previous);
      toast.error('Could not remove item.');
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(cartKeys.cart, updatedCart);
      toast.success('Item removed from cart.');
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
