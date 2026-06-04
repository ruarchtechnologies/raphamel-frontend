import { sdk } from '@/lib/medusa';
import type { PaginatedResponse, ProductFilters } from '@/types/index';
import type { ProductEntity } from '@/domain/entities/product.entity';
import type { HttpTypes } from '@medusajs/types';

// Request these extra fields on every product query.
// Without "+variants.calculated_price" the price comes back undefined.
const FIELDS = '*variants,+variants.calculated_price,+variants.inventory_quantity,*images,*categories';

// ── Mapper ────────────────────────────────────────────────────────────────────

function toProductEntity(p: HttpTypes.StoreProduct): ProductEntity {
  const variant = p.variants?.[0];
  const calcPrice = variant?.calculated_price;
  const price = calcPrice?.calculated_amount ?? 0;
  const originalAmount = calcPrice?.original_amount ?? 0;
  const compareAtPrice = originalAmount > price ? originalAmount : undefined;

  const images: string[] = [];
  if (p.thumbnail) images.push(p.thumbnail);
  if (p.images) {
    for (const img of p.images) {
      if (img.url && img.url !== p.thumbnail) images.push(img.url);
    }
  }

  const category = p.categories?.[0];

  const variants = p.variants
    ?.map((v) => ({
      id: v.id,
      name: v.title ?? '',
      stock: v.inventory_quantity ?? 0,
      price: v.calculated_price?.calculated_amount ?? undefined,
    }))
    .filter((v) => v.id);

  return {
    id: p.id,
    name: p.title ?? '',
    slug: p.handle ?? p.id,
    description: p.description ?? undefined,
    sku: variant?.sku ?? undefined,
    price,
    compareAtPrice,
    stock: variant?.inventory_quantity ?? 999,
    stockUnit: 'unit',
    minimumOrderQuantity: 1,
    images,
    isActive: p.status === 'published',
    isFeatured: false,
    vendorId: '',
    vendorName: '',
    categoryId: category?.id,
    categoryName: category?.name,
    categorySlug: category?.handle ?? undefined,
    variants: variants?.length ? variants : undefined,
    condition: 'new',
    createdAt: p.created_at ?? '',
    updatedAt: p.updated_at ?? '',
  };
}

function toPaginatedResponse(
  products: HttpTypes.StoreProduct[],
  count: number,
  offset: number,
  limit: number,
): PaginatedResponse<ProductEntity> {
  return {
    data: products.map(toProductEntity),
    meta: {
      total: count,
      page: Math.floor(offset / limit) + 1,
      limit,
      lastPage: Math.ceil(count / limit),
    },
  };
}

// ── Sort helper ───────────────────────────────────────────────────────────────

function toMedusaOrder(sortBy?: ProductFilters['sortBy']): string | undefined {
  switch (sortBy) {
    case 'newest':    return '-created_at';
    case 'price_asc': return '+variants.calculated_price.calculated_amount';
    case 'price_desc':return '-variants.calculated_price.calculated_amount';
    default:          return undefined;
  }
}

// ── API functions ─────────────────────────────────────────────────────────────

async function getRegionId(): Promise<string | undefined> {
  const { regions } = await sdk.store.region.list();
  return regions?.[0]?.id;
}

export async function fetchProducts(
  filters: ProductFilters = {},
): Promise<PaginatedResponse<ProductEntity>> {
  const limit  = filters.limit ?? 20;
  const page   = filters.page  ?? 1;
  const offset = (page - 1) * limit;

  const regionId = await getRegionId();

  const params: Record<string, unknown> = { fields: FIELDS, limit, offset };
  if (regionId)           params.region_id   = regionId;
  if (filters.search)     params.q           = filters.search;
  if (filters.categoryId) params.category_id = [filters.categoryId];
  const order = toMedusaOrder(filters.sortBy);
  if (order) params.order = order;

  const { products, count } = await sdk.store.product.list(params);

  // Only show products attached to at least one category
  const categorised = filters.categoryId
    ? products
    : products.filter((p) => p.categories && p.categories.length > 0);

  return toPaginatedResponse(categorised, count ?? 0, offset, limit);
}

export async function fetchProductBySlug(slug: string): Promise<ProductEntity> {
  const regionId = await getRegionId();

  const params: Record<string, unknown> = { fields: FIELDS, handle: slug, limit: 1 };
  if (regionId) params.region_id = regionId;

  const { products } = await sdk.store.product.list(params);

  if (!products.length) throw new Error(`Product not found: ${slug}`);
  return toProductEntity(products[0]);
}

export async function fetchFeaturedProducts(limit = 8): Promise<ProductEntity[]> {
  const regionId = await getRegionId();
  const params: Record<string, unknown> = { fields: FIELDS, limit };
  if (regionId) params.region_id = regionId;

  const { products } = await sdk.store.product.list(params);
  return products.map(toProductEntity);
}

export async function fetchProductsByCategory(
  categorySlug: string,
  filters: ProductFilters = {},
): Promise<PaginatedResponse<ProductEntity>> {
  // Step 1: resolve category handle → ID
  const { product_categories } = await sdk.store.category.list({ handle: categorySlug, limit: 1 });
  if (!product_categories.length) {
    return { data: [], meta: { total: 0, page: 1, limit: filters.limit ?? 20, lastPage: 0 } };
  }

  // Step 2: fetch products filtered by that category ID
  return fetchProducts({ ...filters, categoryId: product_categories[0].id });
}
