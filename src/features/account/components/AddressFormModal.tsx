'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { Address, AddressInput } from '@/features/account/hooks/useAddresses';

// ── Nigerian states ───────────────────────────────────────────────────────────

const NG_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
];

// ── Schema ────────────────────────────────────────────────────────────────────

const schema = z.object({
  first_name:           z.string().min(1, 'First name is required'),
  last_name:            z.string().min(1, 'Last name is required'),
  address_1:            z.string().min(1, 'Street address is required'),
  address_2:            z.string().optional(),
  city:                 z.string().min(1, 'City is required'),
  province:             z.string().min(1, 'State is required'),
  phone:                z.string().optional(),
  is_default_shipping:  z.boolean().optional(),
});

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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  // Populate form when editing an existing address
  useEffect(() => {
    if (address) {
      reset({
        first_name:          address.first_name ?? '',
        last_name:           address.last_name ?? '',
        address_1:           address.address_1 ?? '',
        address_2:           address.address_2 ?? '',
        city:                address.city ?? '',
        province:            address.province ?? '',
        phone:               address.phone ?? '',
        is_default_shipping: address.is_default_shipping ?? false,
      });
    } else {
      reset({
        first_name: '', last_name: '', address_1: '', address_2: '',
        city: '', province: '', phone: '',
        is_default_shipping: false,
      });
    }
  }, [address, reset]);

  const onSubmit = (data: FormValues) => {
    onSave({ ...data, country_code: 'ng' });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Address' : 'Add New Address'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First name"
            placeholder="Ade"
            error={errors.first_name?.message}
            {...register('first_name')}
          />
          <Input
            label="Last name"
            placeholder="Okafor"
            error={errors.last_name?.message}
            {...register('last_name')}
          />
        </div>

        <Input
          label="Street address"
          placeholder="12 Industrial Ave"
          error={errors.address_1?.message}
          {...register('address_1')}
        />

        <Input
          label="Apartment, suite, etc. (optional)"
          placeholder="Suite 3B"
          {...register('address_2')}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="City"
            placeholder="Lagos"
            error={errors.city?.message}
            {...register('city')}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
            <select
              className="input-base appearance-none pr-8"
              {...register('province')}
            >
              <option value="">Select state…</option>
              {NG_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.province && (
              <p className="mt-1 text-xs text-rose-600">{errors.province.message}</p>
            )}
          </div>
        </div>

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
          <Button type="submit" variant="primary" className="flex-1" loading={isSaving}>
            {isEdit ? 'Save Changes' : 'Add Address'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
