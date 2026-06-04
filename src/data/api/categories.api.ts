import { sdk } from '@/lib/medusa';
import type { HttpTypes } from '@medusajs/types';
import type { CategoryEntity } from '@/domain/entities/category.entity';
import { HEALTH_CATEGORIES } from '@/domain/entities/category.entity';

/**
 * Merge a Medusa category with local visual config (color + image).
 * Medusa stores business data; colors/images live in HEALTH_CATEGORIES.
 */
function toEntity(cat: HttpTypes.StoreProductCategory): CategoryEntity {
  const local = HEALTH_CATEGORIES.find((h) => h.slug === cat.handle);
  return {
    id: cat.id,
    name: cat.name ?? '',
    slug: cat.handle ?? '',
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
  const { product_categories } = await sdk.store.category.list({
    handle: slug,
    limit: 1,
    fields: '+products_count',
  });
  const cat = product_categories[0];
  return cat ? toEntity(cat) : null;
}
