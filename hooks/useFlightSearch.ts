import { useQuery } from '@tanstack/react-query';
import { searchFlightOffers } from '@/lib/api/flights';
import { SearchParams, FlightOffersResponse } from '@/types/flight';

/**
 * Custom hook to search for flight offers
 * Uses React Query for caching and state management
 */
export function useFlightSearch(params: SearchParams | null) {
  return useQuery<FlightOffersResponse>({
    queryKey: ['flights', params],
    queryFn: () => searchFlightOffers(params!),
    enabled: !!params, // Only run query if params are provided
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
}