'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getOrCreateWishlist,
  addItemToWishlist,
  removeItemFromWishlist,
  type WishlistData,
} from '@/data/api/wishlist.api';

export const wishlistKeys = {
  all: ['wishlist'] as const,
  detail: () => [...wishlistKeys.all, 'detail'] as const,
};

/** Fetch (or lazily create) the user's wishlist. */
export function useWishlist() {
  return useQuery({
    queryKey: wishlistKeys.detail(),
    queryFn: getOrCreateWishlist,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

/** Derived: is a specific variant already in the wishlist? */
export function useIsInWishlist(variantId: string | undefined): boolean {
  const { data: wishlist } = useWishlist();
  if (!variantId || !wishlist) return false;
  return wishlist.items.some((item) => item.product_variant_id === variantId);
}

/** Add a variant to the wishlist. Optimistically updates the cache. */
export function useAddToWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variantId: string) => {
      const cached = queryClient.getQueryData<WishlistData>(wishlistKeys.detail());
      const wishlist = cached ?? (await getOrCreateWishlist());
      return addItemToWishlist(wishlist.id, variantId);
    },
    onMutate: async (variantId) => {
      await queryClient.cancelQueries({ queryKey: wishlistKeys.detail() });
      const previous = queryClient.getQueryData<WishlistData>(wishlistKeys.detail());

      // Optimistic insert with a placeholder
      queryClient.setQueryData<WishlistData>(wishlistKeys.detail(), (old) => {
        if (!old) return old;
        const optimistic = {
          id: `optimistic_${Date.now()}`,
          wishlist_id: old.id,
          product_variant_id: variantId,
          product_variant: null,
          created_at: new Date().toISOString(),
        };
        return {
          ...old,
          items: [...old.items, optimistic],
          items_count: old.items_count + 1,
        };
      });

      return { previous };
    },
    onError: (_err, _variantId, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(wishlistKeys.detail(), ctx.previous);
      }
      toast.error('Could not save to wishlist. Please try again.');
    },
    onSuccess: (newItem) => {
      // Replace the optimistic entry with the real server item
      queryClient.setQueryData<WishlistData>(wishlistKeys.detail(), (old) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((item) =>
            item.id.startsWith('optimistic_') &&
            item.product_variant_id === newItem.product_variant_id
              ? newItem
              : item,
          ),
        };
      });
    },
  });
}

/** Remove an item from the wishlist by its item ID. Optimistically updates the cache. */
export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      const wishlist = queryClient.getQueryData<WishlistData>(wishlistKeys.detail());
      if (!wishlist) throw new Error('No wishlist loaded');
      await removeItemFromWishlist(wishlist.id, itemId);
      return itemId;
    },
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: wishlistKeys.detail() });
      const previous = queryClient.getQueryData<WishlistData>(wishlistKeys.detail());

      queryClient.setQueryData<WishlistData>(wishlistKeys.detail(), (old) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.filter((item) => item.id !== itemId),
          items_count: Math.max(0, old.items_count - 1),
        };
      });

      return { previous };
    },
    onError: (_err, _itemId, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(wishlistKeys.detail(), ctx.previous);
      }
      toast.error('Could not remove item from wishlist.');
    },
  });
}

/**
 * Convenience hook: returns { isInWishlist, toggle, isPending } for a given variant.
 * Handles both add and remove depending on current state.
 */
export function useWishlistToggle(variantId: string | undefined) {
  const { data: wishlist } = useWishlist();
  const { mutate: add, isPending: isAdding } = useAddToWishlist();
  const { mutate: remove, isPending: isRemoving } = useRemoveFromWishlist();

  const existingItem = wishlist?.items.find(
    (item) => item.product_variant_id === variantId,
  );
  const isInWishlist = Boolean(existingItem);
  const isPending = isAdding || isRemoving;

  function toggle() {
    if (!variantId) {
      toast.error('Select a variant before saving to wishlist.');
      return;
    }
    if (isInWishlist && existingItem) {
      remove(existingItem.id);
      toast.success('Removed from wishlist');
    } else {
      add(variantId);
      toast.success('Saved to wishlist');
    }
  }

  return { isInWishlist, toggle, isPending };
}
