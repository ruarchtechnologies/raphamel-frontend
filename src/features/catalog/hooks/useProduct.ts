/**
 * FLUTTER EQUIV: ProductDetailCubit / SingleProductNotifier
 *
 * Fetches a single product by its URL slug.
 * Used on the product detail page: /products/[slug]
 *
 * USAGE:
 *   const { data: product, isLoading } = useProduct('littmann-stethoscope-classic');
 */

import { useQuery } from '@tanstack/react-query';
import { fetchProductBySlug } from '@/data/api/products.api';
import { productKeys } from './useProducts';

export function useProduct(slug: string) {
  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: () => fetchProductBySlug(slug),
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5,
  });
}
