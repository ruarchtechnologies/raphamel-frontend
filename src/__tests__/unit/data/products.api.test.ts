import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MEDUSA_PRODUCT, REGION } from '../../fixtures';

vi.mock('@/lib/medusa', () => ({
  sdk: {
    store: {
      product: { list: vi.fn() },
      region: { list: vi.fn() },
      category: { list: vi.fn() },
    },
  },
}));

import { sdk } from '@/lib/medusa';
import {
  fetchProducts,
  fetchProductBySlug,
  fetchFeaturedProducts,
  fetchProductsByCategory,
} from '@/data/api/products.api';

const mockSdk = vi.mocked(sdk, true);

beforeEach(() => {
  vi.clearAllMocks();
  // Most tests resolve region first
  mockSdk.store.region.list.mockResolvedValue({ regions: [REGION] } as any);
});

// ── fetchProducts() ───────────────────────────────────────────────────────────

describe('fetchProducts()', () => {
  it('returns a paginated list of ProductEntity', async () => {
    mockSdk.store.product.list.mockResolvedValue({
      products: [MEDUSA_PRODUCT],
      count: 1,
    } as any);

    const result = await fetchProducts();

    expect(result.data).toHaveLength(1);
    expect(result.data[0].name).toBe('Nitrile Examination Gloves');
    expect(result.data[0].slug).toBe('nitrile-examination-gloves');
    expect(result.meta.total).toBe(1);
  });

  it('NEVER divides prices by 100 — 4500 stays 4500', async () => {
    mockSdk.store.product.list.mockResolvedValue({
      products: [MEDUSA_PRODUCT],
      count: 1,
    } as any);

    const result = await fetchProducts();
    expect(result.data[0].price).toBe(4500);
    expect(result.data[0].price).not.toBe(45);
  });

  it('sets compareAtPrice when original_amount > calculated_amount', async () => {
    mockSdk.store.product.list.mockResolvedValue({
      products: [MEDUSA_PRODUCT], // original=5000 > calculated=4500
      count: 1,
    } as any);

    const result = await fetchProducts();
    expect(result.data[0].compareAtPrice).toBe(5000);
  });

  it('does not set compareAtPrice when prices are equal', async () => {
    const noDiscount = {
      ...MEDUSA_PRODUCT,
      variants: [
        {
          ...MEDUSA_PRODUCT.variants[0],
          calculated_price: { calculated_amount: 4500, original_amount: 4500 },
        },
      ],
    };
    mockSdk.store.product.list.mockResolvedValue({ products: [noDiscount], count: 1 } as any);

    const result = await fetchProducts();
    expect(result.data[0].compareAtPrice).toBeUndefined();
  });

  it('passes search query as q param to the SDK', async () => {
    mockSdk.store.product.list.mockResolvedValue({ products: [], count: 0 } as any);

    await fetchProducts({ search: 'gloves' });

    const callArgs = mockSdk.store.product.list.mock.calls[0][0] as Record<string, unknown>;
    expect(callArgs.q).toBe('gloves');
  });

  it('passes sortBy=newest as -created_at order param', async () => {
    mockSdk.store.product.list.mockResolvedValue({ products: [], count: 0 } as any);

    await fetchProducts({ sortBy: 'newest' });

    const callArgs = mockSdk.store.product.list.mock.calls[0][0] as Record<string, unknown>;
    expect(callArgs.order).toBe('-created_at');
  });

  it('passes sortBy=price_asc as the correct order param', async () => {
    mockSdk.store.product.list.mockResolvedValue({ products: [], count: 0 } as any);

    await fetchProducts({ sortBy: 'price_asc' });

    const callArgs = mockSdk.store.product.list.mock.calls[0][0] as Record<string, unknown>;
    expect(String(callArgs.order)).toContain('calculated_amount');
  });

  it('only returns products with at least one category by default', async () => {
    const uncategorised = { ...MEDUSA_PRODUCT, categories: [] };
    mockSdk.store.product.list.mockResolvedValue({
      products: [MEDUSA_PRODUCT, uncategorised],
      count: 2,
    } as any);

    const result = await fetchProducts();
    // Only the categorised product is returned
    expect(result.data).toHaveLength(1);
  });

  it('includes uncategorised products when a categoryId filter is active', async () => {
    mockSdk.store.product.list.mockResolvedValue({
      products: [MEDUSA_PRODUCT],
      count: 1,
    } as any);

    const result = await fetchProducts({ categoryId: 'cat_test_01' });
    expect(result.data).toHaveLength(1);
  });

  it('maps thumbnail as first image in images array', async () => {
    mockSdk.store.product.list.mockResolvedValue({
      products: [MEDUSA_PRODUCT],
      count: 1,
    } as any);

    const result = await fetchProducts();
    expect(result.data[0].images[0]).toBe('https://example.com/gloves.jpg');
  });
});

// ── fetchProductBySlug() ──────────────────────────────────────────────────────

describe('fetchProductBySlug()', () => {
  it('returns the product entity for a valid handle', async () => {
    mockSdk.store.product.list.mockResolvedValue({
      products: [MEDUSA_PRODUCT],
      count: 1,
    } as any);

    const product = await fetchProductBySlug('nitrile-examination-gloves');
    expect(product.slug).toBe('nitrile-examination-gloves');
    expect(product.name).toBe('Nitrile Examination Gloves');
  });

  it('throws when product is not found', async () => {
    mockSdk.store.product.list.mockResolvedValue({ products: [], count: 0 } as any);

    await expect(fetchProductBySlug('no-such-product')).rejects.toThrow(
      'Product not found: no-such-product',
    );
  });
});

// ── fetchFeaturedProducts() ───────────────────────────────────────────────────

describe('fetchFeaturedProducts()', () => {
  it('returns up to the requested limit of products', async () => {
    const products = Array.from({ length: 4 }, (_, i) => ({
      ...MEDUSA_PRODUCT,
      id: `prod_${i}`,
      handle: `product-${i}`,
    }));
    mockSdk.store.product.list.mockResolvedValue({ products, count: 4 } as any);

    const result = await fetchFeaturedProducts(4);
    expect(result).toHaveLength(4);
  });

  it('returns an array (not a paginated object)', async () => {
    mockSdk.store.product.list.mockResolvedValue({
      products: [MEDUSA_PRODUCT],
      count: 1,
    } as any);

    const result = await fetchFeaturedProducts();
    expect(Array.isArray(result)).toBe(true);
  });
});

// ── fetchProductsByCategory() ─────────────────────────────────────────────────

describe('fetchProductsByCategory()', () => {
  it('resolves category handle to ID then fetches products', async () => {
    mockSdk.store.category.list.mockResolvedValue({
      product_categories: [{ id: 'cat_test_01', handle: 'hospital-consumables' }],
    } as any);
    mockSdk.store.product.list.mockResolvedValue({
      products: [MEDUSA_PRODUCT],
      count: 1,
    } as any);

    const result = await fetchProductsByCategory('hospital-consumables');
    expect(result.data).toHaveLength(1);

    const productListCall = mockSdk.store.product.list.mock.calls[0][0] as Record<string, unknown>;
    expect(productListCall.category_id).toContain('cat_test_01');
  });

  it('returns empty paginated response when category is not found', async () => {
    mockSdk.store.category.list.mockResolvedValue({ product_categories: [] } as any);

    const result = await fetchProductsByCategory('nonexistent-slug');
    expect(result.data).toHaveLength(0);
    expect(result.meta.total).toBe(0);
  });
});
