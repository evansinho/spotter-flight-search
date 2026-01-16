import { useState, useMemo } from 'react';
import { FlightOffer } from '@/types/flight';
import {
  FlightFilters,
  getDefaultFilters,
  applyFilters,
  getFilterCounts,
} from '@/lib/filters/flightFilters';

export function useFlightFilters(flights: FlightOffer[]) {
  // Get default filters for the current flight set
  const defaultFilters = useMemo(() => {
    return getDefaultFilters(flights);
  }, [flights.length]);

  // Initialize filters once on mount
  const [filters, setFilters] = useState<FlightFilters>(() => getDefaultFilters(flights));

  // Apply current filters to flights
  const filteredFlights = useMemo(() => {
    return applyFilters(flights, filters);
  }, [flights, filters]);

  // Get counts for filter UI
  const counts = useMemo(() => {
    return getFilterCounts(flights);
  }, [flights]);

  const updateFilter = <K extends keyof FlightFilters>(
    key: K,
    value: FlightFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;

    // Check stops filter
    if (filters.stops.length < 3) {
      count++;
    }

    // Check price filter
    if (
      filters.priceRange[0] !== defaultFilters.priceRange[0] ||
      filters.priceRange[1] !== defaultFilters.priceRange[1]
    ) {
      count++;
    }

    // Check airlines filter
    if (
      filters.airlines.length > 0 &&
      filters.airlines.length < defaultFilters.airlines.length
    ) {
      count++;
    }

    // Check duration filter
    if (filters.maxDuration !== defaultFilters.maxDuration) {
      count++;
    }

    return count;
  }, [filters, defaultFilters]);

  return {
    filters,
    filteredFlights,
    counts,
    updateFilter,
    resetFilters,
    activeFilterCount,
    defaultFilters,
  };
}