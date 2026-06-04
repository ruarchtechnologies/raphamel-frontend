import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sdk } from '@/lib/medusa';
import type { HttpTypes } from '@medusajs/types';
import { toast } from 'sonner';

// ── Types ─────────────────────────────────────────────────────────────────────

export type Address = HttpTypes.StoreCustomerAddress;

export interface AddressInput {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  province: string;
  country_code: string;
  phone?: string;
  is_default_shipping?: boolean;
  is_default_billing?: boolean;
}

// ── Query keys ────────────────────────────────────────────────────────────────

export const addressKeys = {
  all: ['addresses'] as const,
  list: () => [...addressKeys.all, 'list'] as const,
};

// ── Hooks ─────────────────────────────────────────────────────────────────────

export function useAddresses() {
  return useQuery({
    queryKey: addressKeys.list(),
    queryFn: async () => {
      const { addresses } = await sdk.store.customer.listAddress();
      return addresses ?? [];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AddressInput) =>
      sdk.store.customer.createAddress(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.list() });
      toast.success('Address added.');
    },
    onError: () => {
      toast.error('Failed to add address. Please try again.');
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: AddressInput }) =>
      sdk.store.customer.updateAddress(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.list() });
      toast.success('Address updated.');
    },
    onError: () => {
      toast.error('Failed to update address. Please try again.');
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      sdk.store.customer.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.list() });
      toast.success('Address removed.');
    },
    onError: () => {
      toast.error('Failed to remove address. Please try again.');
    },
  });
}
