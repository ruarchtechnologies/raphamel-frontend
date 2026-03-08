/**
 * FLUTTER EQUIV: VendorCubit / VendorNotifier
 *
 * React Query hooks for vendor data.
 *
 * USAGE:
 *   const { data: vendors, isLoading } = useFeaturedVendors();
 */

import { useQuery } from '@tanstack/react-query';
import { fetchFeaturedVendors, fetchVendors, fetchVendorBySlug } from '@/data/api/vendors.api';
import type { VendorFilters } from '@/types/index';

export const vendorKeys = {
  all: ['vendors'] as const,
  lists: () => [...vendorKeys.all, 'list'] as const,
  list: (filters: VendorFilters) => [...vendorKeys.lists(), filters] as const,
  featured: (limit: number) => [...vendorKeys.all, 'featured', limit] as const,
  detail: (slug: string) => [...vendorKeys.all, 'detail', slug] as const,
};

export function useVendors(filters: VendorFilters = {}) {
  return useQuery({
    queryKey: vendorKeys.list(filters),
    queryFn: () => fetchVendors(filters),
    staleTime: 1000 * 60 * 5,
  });
}

export function useFeaturedVendors(limit = 6) {
  return useQuery({
    queryKey: vendorKeys.featured(limit),
    queryFn: () => fetchFeaturedVendors(limit),
    staleTime: 1000 * 60 * 10,
  });
}

export function useVendorBySlug(slug: string) {
  return useQuery({
    queryKey: vendorKeys.detail(slug),
    queryFn: () => fetchVendorBySlug(slug),
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5,
  });
}
