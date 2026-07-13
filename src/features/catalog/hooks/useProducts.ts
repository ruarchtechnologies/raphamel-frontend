/**
 * FLUTTER EQUIV: ProductBloc / ProductCubit / ProductsNotifier
 *
 * In Flutter (with BLoC):
 *   class ProductsCubit extends Cubit<ProductsState> {
 *     final ProductRepository _repo;
 *     Future<void> loadProducts(ProductFilters filters) async {
 *       emit(ProductsLoading());
 *       try {
 *         final products = await _repo.getProducts(filters);
 *         emit(ProductsLoaded(products));
 *       } catch (e) {
 *         emit(ProductsError(e.toString()));
 *       }
 *     }
 *   }
 *
 * In Flutter (with Riverpod):
 *   final productsProvider = FutureProvider.family<PaginatedResult, ProductFilters>
 *     ((ref, filters) => ref.watch(productRepoProvider).getProducts(filters));
 *
 * In React (with React Query):
 *   useQuery handles loading, error, caching, background refetch — all the
 *   things BLoC/Cubit does manually, but declaratively.
 *
 * KEY DIFFERENCES vs Flutter:
 * 1. React Query automatically CACHES results by queryKey. No need to store
 *    products in a Zustand store — the query cache IS the store.
 * 2. useQuery returns { data, isLoading, isError, error } — these are the
 *    direct equivalents of BLoC states (Initial, Loading, Loaded, Error).
 * 3. When the component unmounts, React Query keeps the cache alive (like
 *    keeping a BLoC alive with a BlocProvider at a higher level).
 *
 * USAGE IN A COMPONENT:
 *   const { data, isLoading, isError } = useProducts({ categorySlug: 'ppe' });
 */

import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchFeaturedProducts, fetchProductsByCategory, fetchProductBySlug } from '@/data/api/products.api';
import type { ProductFilters } from '@/types/index';

// ── Query key factory ────────────────────────────────────────────────────────
//
// FLUTTER EQUIV: No direct equivalent, but think of these as unique identifiers
// for each "request type" so React Query knows what to cache and when to refetch.
//
// By convention we create a queryKeys object — changing any key param
// automatically invalidates the cache for that specific query.

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  featured: (limit: number) => [...productKeys.all, 'featured', limit] as const,
  byCategory: (slug: string, filters: ProductFilters) =>
    [...productKeys.all, 'category', slug, filters] as const,
  byCategoryId: (id: string, filters: ProductFilters) =>
    [...productKeys.all, 'categoryId', id, filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (slug: string) => [...productKeys.details(), slug] as const,
  search: (query: string) => [...productKeys.all, 'search', query] as const,
};

// ── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Fetch paginated product list with optional filters.
 *
 * FLUTTER EQUIV:
 *   BlocBuilder<ProductsCubit, ProductsState>(
 *     builder: (ctx, state) {
 *       if (state is ProductsLoading) return CircularProgressIndicator();
 *       if (state is ProductsLoaded)  return ProductGrid(state.products);
 *       if (state is ProductsError)   return ErrorWidget(state.message);
 *     }
 *   )
 *
 * The hook returns { data, isLoading, isError } which you use in JSX:
 *   if (isLoading) return <Spinner />;
 *   if (isError)   return <ErrorMessage />;
 *   return <ProductGrid products={data.data} />;
 */
export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => fetchProducts(filters),
    // staleTime: how long cached data is considered fresh (no refetch)
    // FLUTTER EQUIV: TTL on a cached repository call
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/** Fetch featured products for the homepage hero section. */
export function useFeaturedProducts(limit = 8) {
  return useQuery({
    queryKey: productKeys.featured(limit),
    queryFn: () => fetchFeaturedProducts(limit),
    staleTime: 1000 * 60 * 10, // 10 min — homepage data changes less often
  });
}

/** Fetch a single product by its slug/handle. */
export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: () => fetchProductBySlug(slug),
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

/**
 * Search products by keyword. Only fires when query is >= 2 characters.
 * Short staleTime so results feel live while the user types.
 */
export function useProductSearch(query: string) {
  return useQuery({
    queryKey: productKeys.search(query),
    queryFn: () => fetchProducts({ search: query }),
    enabled: query.trim().length >= 2,
    staleTime: 1000 * 10, // 10 seconds — search results should feel fresh
  });
}

/** Fetch products filtered by a category slug. */
export function useProductsByCategory(
  categorySlug: string,
  filters: ProductFilters = {},
) {
  return useQuery({
    queryKey: productKeys.byCategory(categorySlug, filters),
    queryFn: () => fetchProductsByCategory(categorySlug, filters),
    enabled: Boolean(categorySlug),
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Fetch products by category ID — skips the slug→ID resolution call.
 * Use this when you already have the category ID (e.g. from useCategories()).
 * Saves one full round-trip to the backend compared to useProductsByCategory.
 */
export function useProductsByCategoryId(
  categoryId: string,
  filters: ProductFilters = {},
) {
  return useQuery({
    queryKey: productKeys.byCategoryId(categoryId, filters),
    queryFn: () => fetchProducts({ ...filters, categoryId }),
    enabled: Boolean(categoryId),
    staleTime: 1000 * 60 * 5,
  });
}
