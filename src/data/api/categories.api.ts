/**
 * FLUTTER EQUIV: lib/data/datasources/category_remote_datasource.dart
 *
 * API functions for fetching category data from the backend.
 * Used by feature hooks in src/features/categories/hooks/.
 */

import api from '@/lib/api';
import type { CategoryEntity } from '@/domain/entities/category.entity';

const BASE = '/categories';

/** Fetch all categories with live product counts from the backend. */
export async function fetchCategories(): Promise<CategoryEntity[]> {
  const { data } = await api.get<CategoryEntity[]>(BASE);
  return data;
}

/** Fetch a single category (with children) by its slug. */
export async function fetchCategoryBySlug(slug: string): Promise<CategoryEntity> {
  const { data } = await api.get<CategoryEntity>(`${BASE}/${slug}`);
  return data;
}
