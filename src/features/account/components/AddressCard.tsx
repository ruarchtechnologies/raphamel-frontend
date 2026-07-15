'use client';

import { MapPin, Pencil, Trash2 } from 'lucide-react';
import type { Address } from '@/features/account/hooks/useAddresses';
import { cn } from '@/lib/utils';

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function AddressCard({ address, onEdit, onDelete, isDeleting }: AddressCardProps) {
  const isDefaultShipping = address.is_default_shipping;

  return (
    <div
      className={cn(
        'bg-white rounded-[12px] border p-5 shadow-sm flex flex-col gap-3 transition-colors',
        isDefaultShipping ? 'border-primary/40' : 'border-gray-200',
      )}
    >
      {isDefaultShipping && (
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            Default Shipping
          </span>
        </div>
      )}

      {/* Address lines */}
      <div className="flex items-start gap-3">
        <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
        <div className="text-sm text-gray-700 leading-relaxed">
          <p className="font-semibold text-gray-900">
            {address.first_name} {address.last_name}
          </p>
          <p>{address.address_1}</p>
          {address.address_2 && <p>{address.address_2}</p>}
          <p>
            {address.city}
            {address.province ? `, ${address.province}` : ''}
          </p>
          <p className="uppercase text-xs text-gray-500">{address.country_code}</p>
          {address.phone && <p className="text-gray-500">{address.phone}</p>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1 border-t border-gray-100">
        <button
          onClick={() => onEdit(address)}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Pencil size={13} /> Edit
        </button>
        <button
          onClick={() => onDelete(address.id)}
          disabled={isDeleting}
          className="flex items-center gap-1.5 text-xs font-medium text-rose-500 hover:text-rose-700 transition-colors disabled:opacity-50"
        >
          <Trash2 size={13} /> {isDeleting ? 'Removing…' : 'Remove'}
        </button>
      </div>
    </div>
  );
}
