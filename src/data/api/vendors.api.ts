/**
 * FLUTTER EQUIV: lib/data/datasources/vendor_remote_datasource.dart
 */

import api from '@/lib/api';
import type { PaginatedResponse, VendorFilters } from '@/types/index';
import type { VendorEntity } from '@/domain/entities/vendor.entity';

const BASE = '/vendors';

/** Fetch paginated vendor list. */
export async function fetchVendors(
  filters: VendorFilters = {},
): Promise<PaginatedResponse<VendorEntity>> {
  const { data } = await api.get<PaginatedResponse<VendorEntity>>(BASE, {
    params: filters,
  });
  return data;
}

/** Fetch featured vendors for the homepage. */
export async function fetchFeaturedVendors(limit = 6): Promise<VendorEntity[]> {
  const { data } = await api.get<VendorEntity[]>(`${BASE}/featured`, {
    params: { limit },
  });
  return data;
}

/** Fetch a single vendor storefront by slug. */
export async function fetchVendorBySlug(slug: string): Promise<VendorEntity> {
  const { data } = await api.get<VendorEntity>(`${BASE}/${slug}`);
  return data;
}
