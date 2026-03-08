/**
 * FLUTTER EQUIV: lib/domain/repositories/category_repository.dart
 *
 * Abstract contract for fetching category data.
 * Note: the static HEALTH_CATEGORIES list in category.entity.ts is used for
 * the UI shell (nav, homepage grid) without an API call. This repository is
 * for fetching dynamic data like live product counts from the backend.
 */

import type { CategoryEntity } from '@/domain/entities/category.entity';

export interface ICategoryRepository {
  /** Get all top-level categories (with live product counts). */
  getCategories(): Promise<CategoryEntity[]>;

  /** Get a single category with its children and product count. */
  getCategoryBySlug(slug: string): Promise<CategoryEntity>;
}
