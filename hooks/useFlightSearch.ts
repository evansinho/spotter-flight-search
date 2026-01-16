import { useQuery } from '@tanstack/react-query';
import { SearchParams, FlightOffersResponse } from '@/types/flight';

/**
 * Custom hook to search for flight offers
 * Uses React Query for caching and state management
 */
export function useFlightSearch(params: SearchParams | null) {
  return useQuery<FlightOffersResponse>({
    queryKey: ['flights', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });
      }

      const response = await fetch(`/api/flights?${searchParams.toString()}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to search flights');
      }
      return response.json();
    },
    enabled: !!params, // Only run query if params are provided
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
}