import { sdk } from '@/lib/medusa';

export interface CreateFacilityPayload {
  facilityName: string;
  address: string;
  latitude: number;
  longitude: number;
  placeId?: string;
}

/** Registers the facility (hospital/pharmacy/PMV) profile for the current authenticated customer. */
export async function createFacility(payload: CreateFacilityPayload): Promise<void> {
  await sdk.client.fetch('/store/customers/facility', {
    method: 'POST',
    body: {
      facility_name: payload.facilityName,
      address: payload.address,
      latitude: payload.latitude,
      longitude: payload.longitude,
      place_id: payload.placeId,
    },
  });
}
