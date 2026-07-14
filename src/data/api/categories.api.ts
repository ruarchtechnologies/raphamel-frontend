import { sdk } from '@/lib/medusa';
import type { HttpTypes } from '@medusajs/types';
import type { CategoryEntity } from '@/domain/entities/category.entity';
import { HEALTH_CATEGORIES, findCategoryBySlug } from '@/domain/entities/category.entity';

/**
 * Merge a Medusa category with local visual config (color + image).
 * Medusa stores business data; colors/images live in HEALTH_CATEGORIES.
 */
function toEntity(cat: HttpTypes.StoreProductCategory): CategoryEntity {
  const handle = (cat.handle ?? '').trim();
  const local = HEALTH_CATEGORIES.find((h) => h.slug === handle);
  return {
    id: cat.id,
    name: cat.name ?? '',
    slug: handle,
    description: cat.description ?? local?.description,
    image: local?.image,
    color: local?.color,
    // products_count is not in the default type — cast safely
    productCount: (cat as unknown as { products_count?: number }).products_count
      ?? undefined,
  };
}

/** Fetch all top-level categories from Medusa. */
export async function fetchCategories(): Promise<CategoryEntity[]> {
  const { product_categories } = await sdk.store.category.list({
    limit: 50,
    fields: '+products_count',
  });
  return product_categories.map(toEntity);
}

/** Fetch a single category by its URL handle/slug. Returns null if not found. */
export async function fetchCategoryBySlug(slug: string): Promise<CategoryEntity | null> {
  try {
    let { product_categories } = await sdk.store.category.list({
      handle: slug,
      limit: 1,
      fields: '+products_count',
    });
    // Handles in Medusa may have stray trailing whitespace; fall back to a
    // trimmed match across all categories before hitting the static fallback.
    if (!product_categories.length) {
      const { product_categories: all } = await sdk.store.category.list({
        limit: 100,
        fields: '+products_count',
      });
      const match = all.find((c) => (c.handle ?? '').trim() === slug.trim());
      if (match) product_categories = [match];
    }
    const cat = product_categories[0];
    if (cat) return toEntity(cat);
  } catch {
    // Medusa API error — fall through to static fallback
  }
  // Fall back to static HEALTH_CATEGORIES so category pages render even before
  // Medusa categories are created with matching handles.
  return findCategoryBySlug(slug) ?? null;
}
