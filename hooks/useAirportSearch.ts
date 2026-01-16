import { useQuery } from '@tanstack/react-query';
import { Airport } from '@/types/flight';

/**
 * Custom hook to search for airports
 * Uses React Query for caching and automatic refetching
 */
export function useAirportSearch(keyword: string) {
  return useQuery<Airport[]>({
    queryKey: ['airports', keyword],
    queryFn: async () => {
      const response = await fetch(`/api/airports?keyword=${encodeURIComponent(keyword)}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to search airports');
      }
      const data = await response.json();
      return data.data;
    },
    enabled: keyword.length >= 2, // Only search if at least 2 characters
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}