import { useQuery } from '@tanstack/react-query';
import { searchAirports } from '@/lib/api/flights';
import { Airport } from '@/types/flight';

/**
 * Custom hook to search for airports
 * Uses React Query for caching and automatic refetching
 */
export function useAirportSearch(keyword: string) {
  return useQuery<Airport[]>({
    queryKey: ['airports', keyword],
    queryFn: () => searchAirports(keyword),
    enabled: keyword.length >= 2, // Only search if at least 2 characters
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}