import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, waitFor } from '@testing-library/react';
import { renderHookWithQuery } from '../../helpers/render';

vi.mock('@/data/api/products.api', () => ({
  fetchProducts: vi.fn(),
  fetchProductBySlug: vi.fn(),
  fetchFeaturedProducts: vi.fn(),
  fetchProductsByCategory: vi.fn(),
}));

import * as productsApi from '@/data/api/products.api';
import {
  useProducts,
  useProductBySlug,
  useFeaturedProducts,
  useProductsByCategory,
  useProductSearch,
} from '@/features/catalog/hooks/useProducts';
import { PRODUCT_ENTITY } from '../../fixtures';

const mockFetchProducts   = vi.mocked(productsApi.fetchProducts);
const mockFetchBySlug     = vi.mocked(productsApi.fetchProductBySlug);
const mockFetchFeatured   = vi.mocked(productsApi.fetchFeaturedProducts);
const mockFetchByCategory = vi.mocked(productsApi.fetchProductsByCategory);

const PAGE_RESULT = {
  data: [PRODUCT_ENTITY],
  meta: { total: 1, page: 1, limit: 20, lastPage: 1 },
};

beforeEach(() => {
  vi.clearAllMocks();
});

// ── useProducts ───────────────────────────────────────────────────────────────

describe('useProducts()', () => {
  it('fetches and returns product list', async () => {
    mockFetchProducts.mockResolvedValue(PAGE_RESULT);

    const { result } = renderHookWithQuery(() => useProducts());
    await waitFor(() => {
      expect(result.current.data?.data).toHaveLength(1);
    });
    expect(result.current.data?.data[0].name).toBe('Nitrile Examination Gloves');
  });

  it('passes filters to fetchProducts', async () => {
    mockFetchProducts.mockResolvedValue(PAGE_RESULT);

    renderHookWithQuery(() => useProducts({ search: 'gloves', sortBy: 'price_asc' }));
    await act(async () => { await new Promise((r) => setTimeout(r, 0)); });

    expect(mockFetchProducts).toHaveBeenCalledWith({ search: 'gloves', sortBy: 'price_asc' });
  });

  it('sets isError on failure', async () => {
    mockFetchProducts.mockRejectedValue(new Error('Network error'));

    const { result } = renderHookWithQuery(() => useProducts());
    await act(async () => { await new Promise((r) => setTimeout(r, 50)); });

    expect(result.current.isError).toBe(true);
  });
});

// ── useProductBySlug ──────────────────────────────────────────────────────────

describe('useProductBySlug()', () => {
  it('fetches the product when slug is provided', async () => {
    mockFetchBySlug.mockResolvedValue(PRODUCT_ENTITY);

    const { result } = renderHookWithQuery(() =>
      useProductBySlug('nitrile-examination-gloves'),
    );
    await waitFor(() => {
      expect(result.current.data?.slug).toBe('nitrile-examination-gloves');
    });
    expect(mockFetchBySlug).toHaveBeenCalledWith('nitrile-examination-gloves');
  });

  it('does NOT fire when slug is empty string', async () => {
    renderHookWithQuery(() => useProductBySlug(''));
    await act(async () => { await new Promise((r) => setTimeout(r, 0)); });

    expect(mockFetchBySlug).not.toHaveBeenCalled();
  });
});

// ── useFeaturedProducts ───────────────────────────────────────────────────────

describe('useFeaturedProducts()', () => {
  it('fetches featured products with the given limit', async () => {
    mockFetchFeatured.mockResolvedValue([PRODUCT_ENTITY]);

    const { result } = renderHookWithQuery(() => useFeaturedProducts(8));
    await waitFor(() => {
      expect(result.current.data).toHaveLength(1);
    });
    expect(mockFetchFeatured).toHaveBeenCalledWith(8);
  });

  it('defaults to 8 products', async () => {
    mockFetchFeatured.mockResolvedValue([PRODUCT_ENTITY]);

    renderHookWithQuery(() => useFeaturedProducts());
    await act(async () => { await new Promise((r) => setTimeout(r, 0)); });

    expect(mockFetchFeatured).toHaveBeenCalledWith(8);
  });
});

// ── useProductsByCategory ─────────────────────────────────────────────────────

describe('useProductsByCategory()', () => {
  it('fetches products when categorySlug is provided', async () => {
    mockFetchByCategory.mockResolvedValue(PAGE_RESULT);

    const { result } = renderHookWithQuery(() =>
      useProductsByCategory('hospital-consumables'),
    );
    await waitFor(() => {
      expect(result.current.data?.data).toHaveLength(1);
    });
    expect(mockFetchByCategory).toHaveBeenCalledWith('hospital-consumables', {});
  });

  it('does NOT fire when categorySlug is empty', async () => {
    renderHookWithQuery(() => useProductsByCategory(''));
    await act(async () => { await new Promise((r) => setTimeout(r, 0)); });

    expect(mockFetchByCategory).not.toHaveBeenCalled();
  });
});

// ── useProductSearch ──────────────────────────────────────────────────────────

describe('useProductSearch()', () => {
  it('is ENABLED when query is 2+ characters', async () => {
    mockFetchProducts.mockResolvedValue(PAGE_RESULT);

    const { result } = renderHookWithQuery(() => useProductSearch('gl'));
    await waitFor(() => {
      expect(result.current.data?.data).toHaveLength(1);
    });
    expect(mockFetchProducts).toHaveBeenCalledWith({ search: 'gl' });
  });

  it('is DISABLED when query is 1 character', async () => {
    renderHookWithQuery(() => useProductSearch('g'));
    await act(async () => { await new Promise((r) => setTimeout(r, 0)); });

    expect(mockFetchProducts).not.toHaveBeenCalled();
  });

  it('is DISABLED when query is empty', async () => {
    renderHookWithQuery(() => useProductSearch(''));
    await act(async () => { await new Promise((r) => setTimeout(r, 0)); });

    expect(mockFetchProducts).not.toHaveBeenCalled();
  });

  it('is DISABLED when query is whitespace only', async () => {
    renderHookWithQuery(() => useProductSearch('  '));
    await act(async () => { await new Promise((r) => setTimeout(r, 0)); });

    expect(mockFetchProducts).not.toHaveBeenCalled();
  });
});
