import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CART, EMPTY_CART, SHIPPING_OPTIONS } from '../../fixtures';

vi.mock('@/lib/medusa', () => ({
  sdk: {
    store: {
      cart: {
        create: vi.fn(),
        retrieve: vi.fn(),
        update: vi.fn(),
        createLineItem: vi.fn(),
        updateLineItem: vi.fn(),
        deleteLineItem: vi.fn(),
        addShippingMethod: vi.fn(),
        complete: vi.fn(),
      },
      fulfillment: {
        listCartOptions: vi.fn(),
      },
    },
  },
}));

import { sdk } from '@/lib/medusa';
import {
  getOrCreateCart,
  addLineItem,
  updateLineItem,
  removeLineItem,
  updateCartAddress,
  listShippingOptions,
  addShippingMethod,
  completeCart,
  clearCartId,
} from '@/data/api/cart.api';

const mockSdk = vi.mocked(sdk, true);
const CART_ID_KEY = 'raphamel_cart_id';

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

// ── getOrCreateCart() ─────────────────────────────────────────────────────────

describe('getOrCreateCart()', () => {
  it('creates a new cart when no ID is in localStorage', async () => {
    mockSdk.store.cart.create.mockResolvedValue({ cart: { id: 'cart_new_01' } } as any);
    mockSdk.store.cart.retrieve.mockResolvedValue({ cart: CART } as any);

    await getOrCreateCart();

    expect(mockSdk.store.cart.create).toHaveBeenCalledWith({});
    expect(localStorage.getItem(CART_ID_KEY)).toBe('cart_new_01');
  });

  it('retrieves the existing cart when an ID is in localStorage', async () => {
    localStorage.setItem(CART_ID_KEY, 'cart_test_01');
    mockSdk.store.cart.retrieve.mockResolvedValue({ cart: CART } as any);

    const cart = await getOrCreateCart();

    expect(mockSdk.store.cart.create).not.toHaveBeenCalled();
    expect(mockSdk.store.cart.retrieve).toHaveBeenCalledWith('cart_test_01', expect.any(Object));
    expect(cart.id).toBe('cart_test_01');
  });

  it('creates a fresh cart when the stored ID is expired/not found (retrieve throws)', async () => {
    localStorage.setItem(CART_ID_KEY, 'stale_cart_id');
    mockSdk.store.cart.retrieve
      .mockRejectedValueOnce(Object.assign(new Error('Not found'), { status: 404 }))
      .mockResolvedValueOnce({ cart: CART } as any);
    mockSdk.store.cart.create.mockResolvedValue({ cart: { id: 'cart_new_02' } } as any);

    await getOrCreateCart();

    expect(mockSdk.store.cart.create).toHaveBeenCalledOnce();
    // Stale ID cleared, new ID stored
    expect(localStorage.getItem(CART_ID_KEY)).toBe('cart_new_02');
  });

  it('returns the cart with expanded fields', async () => {
    localStorage.setItem(CART_ID_KEY, 'cart_test_01');
    mockSdk.store.cart.retrieve.mockResolvedValue({ cart: CART } as any);

    const cart = await getOrCreateCart();
    expect(cart.items).toEqual(CART.items);
    expect(cart.subtotal).toBe(CART.subtotal);
  });
});

// ── addLineItem() ─────────────────────────────────────────────────────────────

describe('addLineItem()', () => {
  it('calls createLineItem then retrieves the updated cart', async () => {
    mockSdk.store.cart.createLineItem.mockResolvedValue(undefined as any);
    mockSdk.store.cart.retrieve.mockResolvedValue({ cart: CART } as any);

    const cart = await addLineItem('cart_test_01', 'var_test_01', 2);

    expect(mockSdk.store.cart.createLineItem).toHaveBeenCalledWith('cart_test_01', {
      variant_id: 'var_test_01',
      quantity: 2,
    });
    expect(cart.items.length).toBeGreaterThan(0);
  });
});

// ── updateLineItem() ──────────────────────────────────────────────────────────

describe('updateLineItem()', () => {
  it('calls updateLineItem then retrieves the updated cart', async () => {
    mockSdk.store.cart.updateLineItem.mockResolvedValue(undefined as any);
    mockSdk.store.cart.retrieve.mockResolvedValue({ cart: CART } as any);

    const cart = await updateLineItem('cart_test_01', 'item_test_01', 3);

    expect(mockSdk.store.cart.updateLineItem).toHaveBeenCalledWith(
      'cart_test_01',
      'item_test_01',
      { quantity: 3 },
    );
    expect(cart).toBeDefined();
  });
});

// ── removeLineItem() ──────────────────────────────────────────────────────────

describe('removeLineItem()', () => {
  it('calls deleteLineItem then retrieves the updated cart', async () => {
    mockSdk.store.cart.deleteLineItem.mockResolvedValue(undefined as any);
    mockSdk.store.cart.retrieve.mockResolvedValue({ cart: EMPTY_CART } as any);

    const cart = await removeLineItem('cart_test_01', 'item_test_01');

    expect(mockSdk.store.cart.deleteLineItem).toHaveBeenCalledWith(
      'cart_test_01',
      'item_test_01',
    );
    expect(cart.items).toHaveLength(0);
  });
});

// ── updateCartAddress() ───────────────────────────────────────────────────────

describe('updateCartAddress()', () => {
  it('calls cart.update with email and shipping_address', async () => {
    mockSdk.store.cart.update.mockResolvedValue({ cart: CART } as any);

    const address = {
      first_name: 'Ade',
      last_name: 'Okafor',
      address_1: '12 Hospital Road',
      city: 'Lagos',
      province: 'Lagos',
      country_code: 'ng',
    };

    await updateCartAddress('cart_test_01', 'ade@hospital.ng', address);

    expect(mockSdk.store.cart.update).toHaveBeenCalledWith('cart_test_01', {
      email: 'ade@hospital.ng',
      shipping_address: address,
    });
  });
});

// ── listShippingOptions() ─────────────────────────────────────────────────────

describe('listShippingOptions()', () => {
  it('returns shipping options for the cart', async () => {
    mockSdk.store.fulfillment.listCartOptions.mockResolvedValue({
      shipping_options: SHIPPING_OPTIONS,
    } as any);

    const options = await listShippingOptions('cart_test_01');

    expect(mockSdk.store.fulfillment.listCartOptions).toHaveBeenCalledWith({
      cart_id: 'cart_test_01',
    });
    expect(options).toHaveLength(2);
    expect(options[0].name).toBe('Standard Delivery (3–5 days)');
  });

  it('returns an empty array when no options are configured', async () => {
    mockSdk.store.fulfillment.listCartOptions.mockResolvedValue({
      shipping_options: null,
    } as any);

    const options = await listShippingOptions('cart_test_01');
    expect(options).toEqual([]);
  });
});

// ── addShippingMethod() ───────────────────────────────────────────────────────

describe('addShippingMethod()', () => {
  it('calls cart.addShippingMethod with the option id', async () => {
    mockSdk.store.cart.addShippingMethod.mockResolvedValue({ cart: CART } as any);

    const cart = await addShippingMethod('cart_test_01', 'so_test_01');

    expect(mockSdk.store.cart.addShippingMethod).toHaveBeenCalledWith('cart_test_01', {
      option_id: 'so_test_01',
    });
    expect(cart).toBeDefined();
  });
});

// ── completeCart() ────────────────────────────────────────────────────────────

describe('completeCart()', () => {
  it('calls cart.complete and returns the result', async () => {
    const mockOrder = { type: 'order', order: { id: 'order_01', display_id: 1001 } };
    mockSdk.store.cart.complete.mockResolvedValue(mockOrder as any);

    const result = await completeCart('cart_test_01');

    expect(mockSdk.store.cart.complete).toHaveBeenCalledWith('cart_test_01');
    expect(result).toEqual(mockOrder);
  });
});

// ── clearCartId() ─────────────────────────────────────────────────────────────

describe('clearCartId()', () => {
  it('removes the cart ID from localStorage', () => {
    localStorage.setItem(CART_ID_KEY, 'cart_test_01');
    clearCartId();
    expect(localStorage.getItem(CART_ID_KEY)).toBeNull();
  });

  it('is safe to call when no cart ID exists', () => {
    expect(() => clearCartId()).not.toThrow();
  });
});
