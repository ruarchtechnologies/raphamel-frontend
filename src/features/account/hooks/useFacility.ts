import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getFacility, createFacility } from '@/data/api/facility.api';
import type { CreateFacilityPayload } from '@/data/api/facility.api';

export const facilityKeys = {
  all: ['facility'] as const,
};

/** The current customer's facility profile. `data` is `null` if they haven't completed one yet. */
export function useFacility() {
  return useQuery({
    queryKey: facilityKeys.all,
    queryFn: getFacility,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateFacility() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateFacilityPayload) => createFacility(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: facilityKeys.all });
      toast.success('Facility details saved.');
    },
    onError: () => {
      toast.error('Failed to save facility details. Please try again.');
    },
  });
}
