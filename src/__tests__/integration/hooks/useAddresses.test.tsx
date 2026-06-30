import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, waitFor } from '@testing-library/react';
import { renderHookWithQuery } from '../../helpers/render';
import { ADDRESS, ADDRESS_2 } from '../../fixtures';

vi.mock('@/lib/medusa', () => ({
  sdk: {
    store: {
      customer: {
        listAddress: vi.fn(),
        createAddress: vi.fn(),
        updateAddress: vi.fn(),
        deleteAddress: vi.fn(),
      },
    },
  },
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

import { sdk } from '@/lib/medusa';
import { toast } from 'sonner';
import {
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  addressKeys,
} from '@/features/account/hooks/useAddresses';

const mockListAddress   = vi.mocked(sdk.store.customer.listAddress);
const mockCreateAddress = vi.mocked(sdk.store.customer.createAddress);
const mockUpdateAddress = vi.mocked(sdk.store.customer.updateAddress);
const mockDeleteAddress = vi.mocked(sdk.store.customer.deleteAddress);
const mockToastSuccess  = vi.mocked(toast.success);
const mockToastError    = vi.mocked(toast.error);

beforeEach(() => {
  vi.clearAllMocks();
});

// ── useAddresses ──────────────────────────────────────────────────────────────

describe('useAddresses()', () => {
  it('returns the customer address list', async () => {
    mockListAddress.mockResolvedValue({ addresses: [ADDRESS, ADDRESS_2] } as any);

    const { result } = renderHookWithQuery(() => useAddresses());
    await waitFor(() => {
      expect(result.current.data).toHaveLength(2);
    });
    expect(result.current.data![0].id).toBe('addr_test_01');
    expect(result.current.data![1].id).toBe('addr_test_02');
  });

  it('returns an empty array when customer has no addresses', async () => {
    mockListAddress.mockResolvedValue({ addresses: [] } as any);

    const { result } = renderHookWithQuery(() => useAddresses());
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveLength(0);
  });

  it('sets isError on network failure', async () => {
    mockListAddress.mockRejectedValue(new Error('Network error'));

    const { result } = renderHookWithQuery(() => useAddresses());
    await act(async () => { await new Promise((r) => setTimeout(r, 50)); });

    expect(result.current.isError).toBe(true);
  });
});

// ── useCreateAddress ──────────────────────────────────────────────────────────

describe('useCreateAddress()', () => {
  it('calls sdk.store.customer.createAddress with the input', async () => {
    mockCreateAddress.mockResolvedValue({ address: ADDRESS } as any);
    mockListAddress.mockResolvedValue({ addresses: [ADDRESS] } as any);

    const { result, queryClient } = renderHookWithQuery(() => useCreateAddress());
    queryClient.setQueryData(addressKeys.list(), []);

    const input = {
      first_name: 'Ade',
      last_name: 'Okafor',
      address_1: '12 Hospital Road',
      city: 'Lagos',
      province: 'Lagos',
      country_code: 'ng',
    };

    await act(async () => {
      await result.current.mutateAsync(input);
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockCreateAddress).toHaveBeenCalledWith(input);
    expect(mockToastSuccess).toHaveBeenCalledWith('Address added.');
  });

  it('invalidates the address list query on success', async () => {
    mockCreateAddress.mockResolvedValue({ address: ADDRESS } as any);
    mockListAddress.mockResolvedValue({ addresses: [ADDRESS] } as any);

    const { result, queryClient } = renderHookWithQuery(() => useCreateAddress());
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    await act(async () => {
      await result.current.mutateAsync({
        first_name: 'A',
        last_name: 'B',
        address_1: 'x',
        city: 'Lagos',
        province: 'Lagos',
        country_code: 'ng',
      });
    });

    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: addressKeys.list() }),
    );
  });

  it('shows toast error on failure', async () => {
    mockCreateAddress.mockRejectedValue(new Error('Server error'));

    const { result } = renderHookWithQuery(() => useCreateAddress());

    await act(async () => {
      result.current.mutate({
        first_name: 'A', last_name: 'B', address_1: 'x',
        city: 'L', province: 'L', country_code: 'ng',
      });
      await new Promise((r) => setTimeout(r, 50));
    });

    expect(mockToastError).toHaveBeenCalledWith(
      expect.stringContaining('Failed to add address'),
    );
  });
});

// ── useUpdateAddress ──────────────────────────────────────────────────────────

describe('useUpdateAddress()', () => {
  it('calls sdk.store.customer.updateAddress with id + input', async () => {
    mockUpdateAddress.mockResolvedValue({ address: ADDRESS } as any);
    mockListAddress.mockResolvedValue({ addresses: [ADDRESS] } as any);

    const { result } = renderHookWithQuery(() => useUpdateAddress());

    const input = {
      first_name: 'Adewale',
      last_name: 'Okafor',
      address_1: '12 Hospital Road',
      city: 'Lagos',
      province: 'Lagos',
      country_code: 'ng',
    };

    await act(async () => {
      await result.current.mutateAsync({ id: 'addr_test_01', input });
    });

    expect(mockUpdateAddress).toHaveBeenCalledWith('addr_test_01', input);
    expect(mockToastSuccess).toHaveBeenCalledWith('Address updated.');
  });
});

// ── useDeleteAddress ──────────────────────────────────────────────────────────

describe('useDeleteAddress()', () => {
  it('calls sdk.store.customer.deleteAddress with the address id', async () => {
    mockDeleteAddress.mockResolvedValue({ id: 'addr_test_01', object: 'address', deleted: true } as any);
    mockListAddress.mockResolvedValue({ addresses: [] } as any);

    const { result } = renderHookWithQuery(() => useDeleteAddress());

    await act(async () => {
      await result.current.mutateAsync('addr_test_01');
    });

    expect(mockDeleteAddress).toHaveBeenCalledWith('addr_test_01');
    expect(mockToastSuccess).toHaveBeenCalledWith('Address removed.');
  });

  it('shows toast error when deletion fails', async () => {
    mockDeleteAddress.mockRejectedValue(new Error('Not found'));

    const { result } = renderHookWithQuery(() => useDeleteAddress());

    await act(async () => {
      result.current.mutate('addr_test_01');
      await new Promise((r) => setTimeout(r, 50));
    });

    expect(mockToastError).toHaveBeenCalledWith(
      expect.stringContaining('Failed to remove address'),
    );
  });
});
