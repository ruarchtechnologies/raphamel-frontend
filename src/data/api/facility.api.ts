import { sdk } from '@/lib/medusa';

export interface CreateFacilityPayload {
  facilityName: string;
  address: string;
  latitude: number;
  longitude: number;
  placeId?: string;
}

export interface Facility {
  id: string;
  facility_name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  place_id: string | null;
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

/** Returns the current authenticated customer's facility, or null if they haven't completed one. */
export async function getFacility(): Promise<Facility | null> {
  const { facility } = await sdk.client.fetch<{ facility: Facility | null }>(
    '/store/customers/facility',
    { method: 'GET' },
  );
  return facility;
}
