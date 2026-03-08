/**
 * FLUTTER EQUIV: lib/data/datasources/product_remote_datasource.dart
 *
 * In Flutter:
 *   class ProductRemoteDataSourceImpl implements ProductRemoteDataSource {
 *     final http.Client client;
 *     Future<List<ProductModel>> getProducts(ProductFilters filters) async {
 *       final response = await client.get(Uri.parse('$baseUrl/products?...'));
 *       ...
 *     }
 *   }
 *
 * In React/Next.js: a plain module with async functions that use our
 * pre-configured Axios instance (src/lib/api.ts). No class needed — just
 * functions. React Query hooks will call these from src/features/.
 *
 * RULE: Components NEVER call these functions directly.
 *       Components → React Query hook → this file → API
 * (Flutter equiv: Widget → BLoC/Cubit → Repository → DataSource → HTTP)
 */

import api from '@/lib/api';
import type { PaginatedResponse, ProductFilters } from '@/types/index';
import type { ProductEntity } from '@/domain/entities/product.entity';

const BASE = '/products';

/**
 * Fetch paginated products with optional filters.
 *
 * FLUTTER EQUIV:
 *   Future<PaginatedResult<Product>> getProducts(ProductFilters filters)
 */
export async function fetchProducts(
  filters: ProductFilters = {},
): Promise<PaginatedResponse<ProductEntity>> {
  const { data } = await api.get<PaginatedResponse<ProductEntity>>(BASE, {
    params: filters,
  });
  return data;
}

/**
 * Fetch a single product by slug.
 *
 * FLUTTER EQUIV:
 *   Future<Product> getProductBySlug(String slug)
 */
export async function fetchProductBySlug(slug: string): Promise<ProductEntity> {
  const { data } = await api.get<ProductEntity>(`${BASE}/${slug}`);
  return data;
}

/**
 * Fetch featured/homepage products.
 *
 * FLUTTER EQUIV:
 *   Future<List<Product>> getFeaturedProducts({int limit = 8})
 */
export async function fetchFeaturedProducts(limit = 8): Promise<ProductEntity[]> {
  const { data } = await api.get<PaginatedResponse<ProductEntity>>(BASE, {
    params: { featured: true, limit },
  });
  return data.data;
}

/**
 * Fetch products by category slug.
 */
export async function fetchProductsByCategory(
  categorySlug: string,
  filters: ProductFilters = {},
): Promise<PaginatedResponse<ProductEntity>> {
  const { data } = await api.get<PaginatedResponse<ProductEntity>>(BASE, {
    params: { categorySlug, ...filters },
  });
  return data;
}
