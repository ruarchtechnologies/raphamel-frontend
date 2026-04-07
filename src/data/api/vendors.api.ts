// DISABLED: vendor/supplier feature removed — entire file commented out

/*
import api from '@/lib/api';
import type { PaginatedResponse, VendorFilters } from '@/types/index';
import type { VendorEntity } from '@/domain/entities/vendor.entity';

const BASE = '/vendors';

export async function fetchVendors(
  filters: VendorFilters = {},
): Promise<PaginatedResponse<VendorEntity>> {
  const { data } = await api.get<PaginatedResponse<VendorEntity>>(BASE, { params: filters });
  return data;
}

export async function fetchFeaturedVendors(limit = 6): Promise<VendorEntity[]> {
  const { data } = await api.get<VendorEntity[]>(`${BASE}/featured`, { params: { limit } });
  return data;
}

export async function fetchVendorBySlug(slug: string): Promise<VendorEntity> {
  const { data } = await api.get<VendorEntity>(`${BASE}/${slug}`);
  return data;
}
*/
