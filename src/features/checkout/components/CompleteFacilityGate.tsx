'use client';

import { useState } from 'react';
import { Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AddressAutocompleteInput, type ParsedAddress } from '@/components/ui/AddressAutocompleteInput';
import { useCreateFacility } from '@/features/account/hooks/useFacility';

/**
 * Blocks checkout until the customer has a facility (name + geocoded address) on file.
 * Catches accounts created before the facility feature existed, or where the
 * facility-creation step at signup silently failed.
 */
export function CompleteFacilityGate() {
  const [facilityName, setFacilityName] = useState('');
  const [facilityAddress, setFacilityAddress] = useState<ParsedAddress | null>(null);
  const { mutate: createFacility, isPending } = useCreateFacility();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!facilityName.trim()) { toast.error('Please enter your facility name.'); return; }
    if (!facilityAddress) { toast.error('Please select your facility address from the suggestions.'); return; }

    createFacility({
      facilityName: facilityName.trim(),
      address: facilityAddress.formattedAddress,
      latitude: facilityAddress.lat,
      longitude: facilityAddress.lng,
      placeId: facilityAddress.placeId,
    });
  }

  return (
    <div className="container py-16 max-w-lg mx-auto">
      <div className="bg-white rounded-[6px] border border-gray-200 shadow-sm p-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 mb-4">
          <Building2 className="h-7 w-7 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Complete your facility profile</h2>
        <p className="text-sm text-gray-500 mb-6">
          We need your facility name and address before you can check out.
        </p>

        <form onSubmit={onSubmit} className="space-y-4 text-left">
          <Input
            label="Facility name"
            placeholder="Grace Specialist Hospital"
            leftIcon={<Building2 size={14} />}
            value={facilityName}
            onChange={(e) => setFacilityName(e.target.value)}
          />

          <AddressAutocompleteInput
            label="Facility address"
            onSelect={setFacilityAddress}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={isPending}
            disabled={!facilityName.trim() || !facilityAddress || isPending}
          >
            Save and continue
          </Button>
        </form>
      </div>
    </div>
  );
}
