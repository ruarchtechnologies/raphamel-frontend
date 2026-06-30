import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, waitFor } from '@testing-library/react';
import { renderHookWithQuery } from '../../helpers/render';
import { CART, EMPTY_CART } from '../../fixtures';

vi.mock('@/data/api/cart.api', () => ({
  getOrCreateCart: vi.fn(),
  addLineItem: vi.fn(),
  updateLineItem: vi.fn(),
  removeLineItem: vi.fn(),
  clearCartId: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

import * as cartApi from '@/data/api/cart.api';
import { toast } from 'sonner';
import {
  useCart,
  useAddToCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useClearCart,
  useCartItemCount,
} from '@/features/cart/hooks/useCart';

const mockGetOrCreate  = vi.mocked(cartApi.getOrCreateCart);
const mockAddLineItem  = vi.mocked(cartApi.addLineItem);
const mockUpdateLine   = vi.mocked(cartApi.updateLineItem);
const mockRemoveLine   = vi.mocked(cartApi.removeLineItem);
const mockClearCartId  = vi.mocked(cartApi.clearCartId);
const mockToastSuccess = vi.mocked(toast.success);
const mockToastError   = vi.mocked(toast.error);

beforeEach(() => {
  vi.clearAllMocks();
});

// ── useCart ───────────────────────────────────────────────────────────────────

describe('useCart()', () => {
  it('calls getOrCreateCart and returns the cart', async () => {
    mockGetOrCreate.mockResolvedValue(CART as any);

    const { result } = renderHookWithQuery(() => useCart());
    await waitFor(() => {
      expect(result.current.data?.id).toBe('cart_test_01');
    });

    expect(mockGetOrCreate).toHaveBeenCalledOnce();
    expect(result.current.data?.items).toHaveLength(1);
  });

  it('isLoading is true on first render, false after resolve', async () => {
    let resolveFn!: (v: any) => void;
    mockGetOrCreate.mockReturnValue(new Promise((r) => { resolveFn = r; }));

    const { result } = renderHookWithQuery(() => useCart());
    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolveFn(CART);
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeDefined();
  });
});

// ── useAddToCart ──────────────────────────────────────────────────────────────

describe('useAddToCart()', () => {
  it('creates a cart if needed, then adds the item, and updates cache', async () => {
    mockGetOrCreate.mockResolvedValue(CART as any);
    mockAddLineItem.mockResolvedValue(CART as any);

    const { result, queryClient } = renderHookWithQuery(() => useAddToCart());

    await act(async () => {
      await result.current.mutateAsync({ variantId: 'var_test_01', quantity: 2 });
    });

    expect(mockGetOrCreate).toHaveBeenCalledOnce();
    expect(mockAddLineItem).toHaveBeenCalledWith('cart_test_01', 'var_test_01', 2);

    await waitFor(() => {
      expect(queryClient.getQueryData(['cart'])).toBeDefined();
    });
  });

  it('shows toast error when add fails', async () => {
    mockGetOrCreate.mockResolvedValue(CART as any);
    mockAddLineItem.mockRejectedValue(new Error('Stock exceeded'));

    const { result } = renderHookWithQuery(() => useAddToCart());

    await act(async () => {
      result.current.mutate({ variantId: 'var_test_01', quantity: 9999 });
      await new Promise((r) => setTimeout(r, 50));
    });

    expect(mockToastError).toHaveBeenCalledWith(
      expect.stringContaining('Could not add item'),
    );
  });
});

// ── useUpdateCartItem ─────────────────────────────────────────────────────────

describe('useUpdateCartItem()', () => {
  it('calls updateLineItem with correct args and updates cache', async () => {
    const updatedCart = { ...CART, items: [{ ...CART.items[0], quantity: 5 }] };
    mockUpdateLine.mockResolvedValue(updatedCart as any);

    const { result, queryClient } = renderHookWithQuery(() => useUpdateCartItem());

    await act(async () => {
      await result.current.mutateAsync({
        cartId: 'cart_test_01',
        lineItemId: 'item_test_01',
        quantity: 5,
      });
    });

    expect(mockUpdateLine).toHaveBeenCalledWith('cart_test_01', 'item_test_01', 5);
    await waitFor(() => {
      const cached = queryClient.getQueryData(['cart']) as typeof updatedCart;
      expect(cached?.items[0].quantity).toBe(5);
    });
  });

  it('shows toast error on failure', async () => {
    mockUpdateLine.mockRejectedValue(new Error('Server error'));

    const { result } = renderHookWithQuery(() => useUpdateCartItem());

    await act(async () => {
      result.current.mutate({ cartId: 'c1', lineItemId: 'i1', quantity: 1 });
      await new Promise((r) => setTimeout(r, 50));
    });

    expect(mockToastError).toHaveBeenCalledWith(expect.stringContaining('update cart'));
  });
});

// ── useRemoveCartItem ─────────────────────────────────────────────────────────

describe('useRemoveCartItem()', () => {
  it('calls removeLineItem, updates cache, and shows success toast', async () => {
    mockRemoveLine.mockResolvedValue(EMPTY_CART as any);

    const { result, queryClient } = renderHookWithQuery(() => useRemoveCartItem());

    await act(async () => {
      await result.current.mutateAsync({
        cartId: 'cart_test_01',
        lineItemId: 'item_test_01',
      });
    });

    expect(mockRemoveLine).toHaveBeenCalledWith('cart_test_01', 'item_test_01');
    const cached = queryClient.getQueryData(['cart']) as typeof EMPTY_CART;
    expect(cached.items).toHaveLength(0);
    expect(mockToastSuccess).toHaveBeenCalledWith(
      expect.stringContaining('Item removed'),
    );
  });
});

// ── useClearCart ──────────────────────────────────────────────────────────────

describe('useClearCart()', () => {
  it('clears cart ID from localStorage and removes query from cache', async () => {
    localStorage.setItem('raphamel_cart_id', 'cart_test_01');

    const { result, queryClient } = renderHookWithQuery(() => useClearCart());
    queryClient.setQueryData(['cart'], CART);

    act(() => {
      result.current();
    });

    expect(mockClearCartId).toHaveBeenCalledOnce();
    expect(queryClient.getQueryData(['cart'])).toBeUndefined();
  });
});

// ── useCartItemCount ──────────────────────────────────────────────────────────

describe('useCartItemCount()', () => {
  it('returns 0 when cart is empty', async () => {
    mockGetOrCreate.mockResolvedValue(EMPTY_CART as any);

    const { result } = renderHookWithQuery(() => useCartItemCount());
    await act(async () => { await new Promise((r) => setTimeout(r, 0)); });

    expect(result.current).toBe(0);
  });

  it('returns the total quantity across all line items', async () => {
    const cart = {
      ...CART,
      items: [
        { ...CART.items[0], quantity: 3 },
        { id: 'item_02', quantity: 2, title: 'Another', unit_price: 1000, subtotal: 2000 },
      ],
    };
    mockGetOrCreate.mockResolvedValue(cart as any);

    const { result } = renderHookWithQuery(() => useCartItemCount());
    await waitFor(() => {
      expect(result.current).toBe(5); // 3 + 2
    });
  });

  it('returns 0 while the cart is still loading', () => {
    mockGetOrCreate.mockReturnValue(new Promise(() => {})); // never resolves

    const { result } = renderHookWithQuery(() => useCartItemCount());
    expect(result.current).toBe(0);
  });
});
