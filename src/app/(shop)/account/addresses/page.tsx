'use client';

import { useState } from 'react';
import { Plus, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { AddressCard } from '@/features/account/components/AddressCard';
import { AddressFormModal } from '@/features/account/components/AddressFormModal';
import {
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
} from '@/features/account/hooks/useAddresses';
import type { Address, AddressInput } from '@/features/account/hooks/useAddresses';

export default function AddressesPage() {
  const [modalOpen, setModalOpen]       = useState(false);
  const [editTarget, setEditTarget]     = useState<Address | null>(null);
  const [deletingId, setDeletingId]     = useState<string | null>(null);

  const { data: addresses = [], isLoading, isError, refetch } = useAddresses();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();

  function openCreate() {
    setEditTarget(null);
    setModalOpen(true);
  }

  function openEdit(address: Address) {
    setEditTarget(address);
    setModalOpen(true);
  }

  function handleDelete(id: string) {
    setDeletingId(id);
    deleteAddress.mutate(id, { onSettled: () => setDeletingId(null) });
  }

  function handleSave(input: AddressInput) {
    if (editTarget) {
      updateAddress.mutate(
        { id: editTarget.id, input },
        { onSuccess: () => setModalOpen(false) },
      );
    } else {
      createAddress.mutate(input, { onSuccess: () => setModalOpen(false) });
    }
  }

  const isSaving = createAddress.isPending || updateAddress.isPending;

  return (
    <div className="bg-white rounded-[12px] border border-gray-200 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Saved Addresses</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your shipping and billing addresses.
          </p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<Plus size={15} />} onClick={openCreate}>
          Add Address
        </Button>
      </div>

      {/* States */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-44 bg-gray-50 rounded-[12px] animate-pulse border border-gray-100" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-3">Failed to load addresses.</p>
          <button
            onClick={() => refetch()}
            className="text-sm font-semibold"
            style={{ color: 'var(--color-primary)' }}
          >
            Retry
          </button>
        </div>
      ) : addresses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center py-16 text-gray-400"
        >
          <MapPin size={40} className="mb-3 opacity-30" />
          <p className="text-base font-medium text-gray-500">No addresses yet</p>
          <p className="text-sm mt-1 mb-5">Add an address to speed up checkout.</p>
          <Button variant="outline-primary" size="sm" leftIcon={<Plus size={14} />} onClick={openCreate}>
            Add your first address
          </Button>
        </motion.div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              onEdit={openEdit}
              onDelete={handleDelete}
              isDeleting={deletingId === addr.id}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <AddressFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        address={editTarget}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
}
