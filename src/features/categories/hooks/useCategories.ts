/**
 * FLUTTER EQUIV: CategoryCubit / CategoryNotifier
 *
 * Fetches live category data (with real product counts) from the backend.
 * For static UI (nav, homepage grid) we use the HEALTH_CATEGORIES const
 * directly — no API call needed. This hook is for when you need live data.
 *
 * USAGE:
 *   const { data: categories, isLoading } = useCategories();
 */

import { useQuery } from '@tanstack/react-query';
import { fetchCategories, fetchCategoryBySlug } from '@/data/api/categories.api';

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  detail: (slug: string) => [...categoryKeys.all, 'detail', slug] as const,
};

/** Fetch all categories with live product counts. */
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 30, // categories change rarely — 30 min cache
  });
}

/** Fetch a single category by slug. Returns null if not found in Medusa. */
export function useCategoryBySlug(slug: string) {
  return useQuery<import('@/domain/entities/category.entity').CategoryEntity | null>({
    queryKey: categoryKeys.detail(slug),
    queryFn: () => fetchCategoryBySlug(slug),
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 30,
  });
}
