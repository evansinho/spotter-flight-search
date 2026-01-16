import { useState, useEffect } from 'react';
import { SearchParams } from '@/types/flight';

const RECENT_SEARCHES_KEY = 'flight-search-recent';
const MAX_RECENT_SEARCHES = 5;

interface RecentSearch extends SearchParams {
  timestamp: number;
  label: string;
}

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setRecentSearches(parsed);
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error);
    }
  }, []);

  // Save a new search
  const addRecentSearch = (params: SearchParams) => {
    try {
      const label = `${params.originLocationCode} → ${params.destinationLocationCode}`;

      const newSearch: RecentSearch = {
        ...params,
        timestamp: Date.now(),
        label,
      };

      setRecentSearches((prev) => {
        // Remove duplicates (same origin/destination/dates)
        const filtered = prev.filter(
          (search) =>
            !(
              search.originLocationCode === params.originLocationCode &&
              search.destinationLocationCode === params.destinationLocationCode &&
              search.departureDate === params.departureDate &&
              search.returnDate === params.returnDate
            )
        );

        // Add new search at the beginning and limit to MAX_RECENT_SEARCHES
        const updated = [newSearch, ...filtered].slice(0, MAX_RECENT_SEARCHES);

        // Save to localStorage
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));

        return updated;
      });
    } catch (error) {
      console.error('Failed to save recent search:', error);
    }
  };

  // Clear all recent searches
  const clearRecentSearches = () => {
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
      setRecentSearches([]);
    } catch (error) {
      console.error('Failed to clear recent searches:', error);
    }
  };

  return {
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
  };
}
