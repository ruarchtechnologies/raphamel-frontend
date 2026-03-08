/**
 * FLUTTER EQUIV: lib/domain/repositories/product_repository.dart
 *
 * In Flutter Clean Architecture:
 *   abstract class ProductRepository {
 *     Future<Either<Failure, List<Product>>> getProducts(ProductFilters filters);
 *     Future<Either<Failure, Product>> getProductBySlug(String slug);
 *   }
 *
 * In TypeScript we use an interface. No Either/Failure type here — we let
 * React Query handle error state at the presentation layer (just like how
 * BLoC handles errors in Flutter by emitting an ErrorState).
 *
 * WHY THIS MATTERS (Clean Architecture):
 * The domain layer defines WHAT operations exist. The data layer (src/data/)
 * defines HOW they're implemented. This means you can swap the implementation
 * (e.g., REST → GraphQL) without touching your UI code.
 *
 * FLUTTER ANALOGY:
 *   - This interface = abstract class in lib/domain/repositories/
 *   - src/data/repositories/product.repository.impl.ts = the concrete class
 *     in lib/data/repositories/
 */

import type { ProductEntity } from '@/domain/entities/product.entity';
import type { PaginatedResponse, ProductFilters } from '@/types/index';

export interface IProductRepository {
  /**
   * Fetch paginated products with optional filters.
   * FLUTTER EQUIV: Future<Either<Failure, PaginatedResult<Product>>> getProducts(ProductFilters)
   */
  getProducts(filters?: ProductFilters): Promise<PaginatedResponse<ProductEntity>>;

  /**
   * Fetch a single product by its URL slug.
   * FLUTTER EQUIV: Future<Either<Failure, Product>> getProductBySlug(String slug)
   */
  getProductBySlug(slug: string): Promise<ProductEntity>;

  /**
   * Fetch featured products for the homepage.
   * FLUTTER EQUIV: Future<Either<Failure, List<Product>>> getFeaturedProducts()
   */
  getFeaturedProducts(limit?: number): Promise<ProductEntity[]>;

  /**
   * Fetch products belonging to a specific category.
   */
  getProductsByCategory(categorySlug: string, filters?: ProductFilters): Promise<PaginatedResponse<ProductEntity>>;
}
