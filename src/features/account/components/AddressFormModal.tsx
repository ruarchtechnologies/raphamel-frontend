'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AddressAutocompleteInput, type ParsedAddress } from '@/components/ui/AddressAutocompleteInput';
import { useMe } from '@/features/auth/hooks/useAuth';
import type { Address, AddressInput } from '@/features/account/hooks/useAddresses';

// ── Schema ────────────────────────────────────────────────────────────────────

const schema = z.object({
  phone:                z.string().optional(),
  is_default_shipping:  z.boolean().optional(),
});

interface SelectedAddress {
  address_1: string;
  city: string;
  province: string;
}

type FormValues = z.infer<typeof schema>;

// ── Props ─────────────────────────────────────────────────────────────────────

interface AddressFormModalProps {
  open: boolean;
  onClose: () => void;
  /** When provided — edit mode. When null — create mode. */
  address: Address | null;
  onSave: (input: AddressInput) => void;
  isSaving: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AddressFormModal({ open, onClose, address, onSave, isSaving }: AddressFormModalProps) {
  const isEdit = address !== null;
  const { data: me, isLoading: meLoading } = useMe();
  const [selectedAddress, setSelectedAddress] = useState<SelectedAddress | null>(null);

  const { register, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  // Populate form when editing an existing address
  useEffect(() => {
    if (address) {
      reset({
        phone:               address.phone ?? '',
        is_default_shipping: address.is_default_shipping ?? false,
      });
      setSelectedAddress({
        address_1: address.address_1 ?? '',
        city:      address.city ?? '',
        province:  address.province ?? '',
      });
    } else {
      reset({ phone: '', is_default_shipping: false });
      setSelectedAddress(null);
    }
  }, [address, reset]);

  // We only deliver within Lagos for now — reject anything else right at selection.
  function onAddressSelect(parsed: ParsedAddress) {
    if (parsed.province.toLowerCase() !== 'lagos') {
      toast.error('Sorry, we currently only deliver within Lagos State.');
      setSelectedAddress(null);
      return false;
    }
    setSelectedAddress({
      address_1: parsed.addressLine || parsed.formattedAddress,
      city: parsed.city,
      province: parsed.province,
    });
  }

  const onSubmit = (data: FormValues) => {
    if (!me) return;
    if (!selectedAddress) {
      toast.error('Please select your address from the suggestions.');
      return;
    }
    onSave({
      ...selectedAddress,
      ...data,
      first_name: me.firstName,
      last_name: me.lastName,
      country_code: 'ng',
    });
  };

  const searchDefaultValue = address
    ? [address.address_1, address.city, address.province].filter(Boolean).join(', ')
    : undefined;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Address' : 'Add New Address'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AddressAutocompleteInput
          label="Search address"
          placeholder="Start typing your street address…"
          defaultValue={searchDefaultValue}
          onSelect={onAddressSelect}
        />

        <Input
          label="Phone (optional)"
          type="tel"
          placeholder="+234 801 234 5678"
          {...register('phone')}
        />

        <label className="flex items-center gap-2.5 cursor-pointer pt-1">
          <input type="checkbox" className="accent-primary" {...register('is_default_shipping')} />
          <span className="text-sm text-gray-700">Set as default shipping address</span>
        </label>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            loading={isSaving}
            disabled={meLoading}
          >
            {isEdit ? 'Save Changes' : 'Add Address'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
