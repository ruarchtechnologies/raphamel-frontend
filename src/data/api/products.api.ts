import { sdk } from '@/lib/medusa';
import type { PaginatedResponse, ProductFilters } from '@/types/index';
import type { ProductEntity } from '@/domain/entities/product.entity';
import type { HttpTypes } from '@medusajs/types';

// Fields for product list endpoints (homepage, search, category pages).
// *categories is excluded from list queries because expanding the categories relation
// alongside a category_id filter returns zero results in Medusa v2, and fetching
// it without a filter requires extra per-row joins that slow the list endpoint.
// Category metadata (name, slug) is still included via DETAIL_FIELDS for product pages.
const LIST_FIELDS = '*variants,+variants.calculated_price,+variants.inventory_quantity,*images';
const CATEGORY_LIST_FIELDS = '*variants,+variants.calculated_price,+variants.inventory_quantity,*images';

// Fields for the single product detail page only.
// Includes variant options so the per-option selector UI can render.
const DETAIL_FIELDS = '*variants,+variants.calculated_price,+variants.inventory_quantity,*variants.options,*options,*images,*categories';

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

  const options = p.options?.map((o) => ({
    id: o.id,
    title: o.title ?? '',
    values: (o.values ?? []).map((val) => val.value).filter(Boolean) as string[],
  }));

  const variants = p.variants
    ?.map((v) => {
      const optionValues: Record<string, string> = {};
      if (v.options && p.options) {
        for (const vo of v.options) {
          const productOption = p.options.find((o) => o.id === (vo as { option_id?: string }).option_id);
          if (productOption?.title && vo.value) {
            optionValues[productOption.title] = vo.value;
          }
        }
      }
      return {
        id: v.id,
        name: v.title ?? '',
        stock: v.inventory_quantity ?? 0,
        price: v.calculated_price?.calculated_amount ?? undefined,
        optionValues,
      };
    })
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
    options: options?.length ? options : undefined,
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
  const envRegionId = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID;
  if (envRegionId) return envRegionId;
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

  const fields = filters.categoryId ? CATEGORY_LIST_FIELDS : LIST_FIELDS;
  const params: Record<string, unknown> = { fields, limit, offset };
  if (regionId)           params.region_id   = regionId;
  if (filters.search)     params.q           = filters.search;
  if (filters.categoryId) params.category_id = [filters.categoryId];
  const order = toMedusaOrder(filters.sortBy);
  if (order) params.order = order;

  const { products, count } = await sdk.store.product.list(params);

  return toPaginatedResponse(products, count ?? 0, offset, limit);
}

export async function fetchProductBySlug(slug: string): Promise<ProductEntity> {
  const regionId = await getRegionId();

  const params: Record<string, unknown> = { fields: DETAIL_FIELDS, handle: slug, limit: 1 };
  if (regionId) params.region_id = regionId;

  const { products } = await sdk.store.product.list(params);

  if (!products.length) throw new Error(`Product not found: ${slug}`);
  return toProductEntity(products[0]);
}

export async function fetchFeaturedProducts(limit = 8): Promise<ProductEntity[]> {
  const regionId = await getRegionId();
  const params: Record<string, unknown> = { fields: LIST_FIELDS, limit };
  if (regionId) params.region_id = regionId;

  const { products } = await sdk.store.product.list(params);
  return products.map(toProductEntity);
}

export async function fetchProductsByCategory(
  categorySlug: string,
  filters: ProductFilters = {},
): Promise<PaginatedResponse<ProductEntity>> {
  const limit  = filters.limit ?? 20;
  const page   = filters.page  ?? 1;
  const offset = (page - 1) * limit;

  // Step 1: resolve slug → category ID.
  // Handles in Medusa may have stray trailing whitespace, so exact handle filter
  // can fail. Fetch a broad list and match by trimmed handle as a fallback.
  let { product_categories } = await sdk.store.category.list({ handle: categorySlug, limit: 1 });
  if (!product_categories.length) {
    const { product_categories: all } = await sdk.store.category.list({ limit: 100 });
    const match = all.find((c) => (c.handle ?? '').trim() === categorySlug.trim());
    if (match) product_categories = [match];
  }
  if (!product_categories.length) {
    return { data: [], meta: { total: 0, page: 1, limit, lastPage: 0 } };
  }

  const regionId = await getRegionId();

  // Step 2: query products directly — bypass fetchProducts so *categories expansion
  // never appears alongside the category_id filter (they conflict in Medusa v2).
  const params: Record<string, unknown> = {
    fields: CATEGORY_LIST_FIELDS,
    limit,
    offset,
    category_id: [product_categories[0].id],
  };
  if (regionId) params.region_id = regionId;
  const order = toMedusaOrder(filters.sortBy);
  if (order) params.order = order;

  const { products, count } = await sdk.store.product.list(params);
  return toPaginatedResponse(products, count ?? 0, offset, limit);
}
