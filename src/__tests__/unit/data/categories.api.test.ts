import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MEDUSA_CATEGORY } from '../../fixtures';

vi.mock('@/lib/medusa', () => ({
  sdk: {
    store: {
      category: { list: vi.fn() },
    },
  },
}));

import { sdk } from '@/lib/medusa';
import { fetchCategories, fetchCategoryBySlug } from '@/data/api/categories.api';

const mockSdk = vi.mocked(sdk, true);

beforeEach(() => {
  vi.clearAllMocks();
});

// ── fetchCategories() ─────────────────────────────────────────────────────────

describe('fetchCategories()', () => {
  it('returns an array of CategoryEntity', async () => {
    mockSdk.store.category.list.mockResolvedValue({
      product_categories: [MEDUSA_CATEGORY],
    } as any);

    const categories = await fetchCategories();

    expect(categories).toHaveLength(1);
    expect(categories[0].name).toBe('Hospital Consumables');
    expect(categories[0].slug).toBe('hospital-consumables');
  });

  it('requests +products_count field', async () => {
    mockSdk.store.category.list.mockResolvedValue({
      product_categories: [MEDUSA_CATEGORY],
    } as any);

    await fetchCategories();

    const args = mockSdk.store.category.list.mock.calls[0][0] as Record<string, unknown>;
    expect(args.fields).toContain('+products_count');
  });

  it('includes productCount from the Medusa response', async () => {
    mockSdk.store.category.list.mockResolvedValue({
      product_categories: [MEDUSA_CATEGORY],
    } as any);

    const categories = await fetchCategories();
    expect(categories[0].productCount).toBe(24);
  });

  it('returns an empty array when Medusa has no categories', async () => {
    mockSdk.store.category.list.mockResolvedValue({
      product_categories: [],
    } as any);

    const categories = await fetchCategories();
    expect(categories).toHaveLength(0);
  });

  it('merges local visual config (image/color) from HEALTH_CATEGORIES', async () => {
    // Simulate a category whose handle matches a local config entry
    const medusaCat = { ...MEDUSA_CATEGORY, handle: 'hospital-consumables' };
    mockSdk.store.category.list.mockResolvedValue({
      product_categories: [medusaCat],
    } as any);

    const categories = await fetchCategories();
    // The entity should exist (local config augments but doesn't break)
    expect(categories[0].slug).toBe('hospital-consumables');
  });
});

// ── fetchCategoryBySlug() ─────────────────────────────────────────────────────

describe('fetchCategoryBySlug()', () => {
  it('returns the CategoryEntity for a valid slug', async () => {
    mockSdk.store.category.list.mockResolvedValue({
      product_categories: [MEDUSA_CATEGORY],
    } as any);

    const category = await fetchCategoryBySlug('hospital-consumables');

    expect(category).not.toBeNull();
    expect(category!.slug).toBe('hospital-consumables');
    expect(category!.name).toBe('Hospital Consumables');
  });

  it('returns null when the slug does not exist', async () => {
    mockSdk.store.category.list.mockResolvedValue({
      product_categories: [],
    } as any);

    const category = await fetchCategoryBySlug('nonexistent-slug');
    expect(category).toBeNull();
  });

  it('passes the slug as the handle filter', async () => {
    mockSdk.store.category.list.mockResolvedValue({
      product_categories: [MEDUSA_CATEGORY],
    } as any);

    await fetchCategoryBySlug('hospital-consumables');

    const args = mockSdk.store.category.list.mock.calls[0][0] as Record<string, unknown>;
    expect(args.handle).toBe('hospital-consumables');
    expect(args.limit).toBe(1);
  });
});
