import { FlightOffer } from '@/types/flight';

export interface FlightFilters {
  stops: number[]; // 0 = non-stop, 1 = 1 stop, 2 = 2+ stops
  priceRange: [number, number];
  airlines: string[];
  maxDuration: number; // in minutes
}

export const getDefaultFilters = (flights: FlightOffer[]): FlightFilters => {
  if (!flights || flights.length === 0) {
    return {
      stops: [0, 1, 2],
      priceRange: [0, 10000],
      airlines: [],
      maxDuration: 24 * 60, // 24 hours
    };
  }

  const prices = flights.map(f => parseFloat(f.price.total));
  const maxPrice = Math.max(...prices);

  const durations = flights.map(f => {
    return f.itineraries.reduce((sum, it) => {
      const hours = parseInt(it.duration.match(/(\d+)H/)?.[1] || '0');
      const minutes = parseInt(it.duration.match(/(\d+)M/)?.[1] || '0');
      return sum + hours * 60 + minutes;
    }, 0);
  });
  const maxDurationValue = Math.max(...durations);

  // Get all unique airlines
  const airlines = Array.from(
    new Set(flights.flatMap(f => f.validatingAirlineCodes))
  );

  return {
    stops: [0, 1, 2],
    priceRange: [0, Math.ceil(maxPrice)],
    airlines,
    maxDuration: maxDurationValue,
  };
};

export const applyFilters = (
  flights: FlightOffer[],
  filters: FlightFilters
): FlightOffer[] => {
  return flights.filter(flight => {
    // Price filter
    const price = parseFloat(flight.price.total);
    if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
      return false;
    }

    // Stops filter
    const stops = flight.itineraries.reduce((max, it) => {
      const segmentStops = it.segments.length - 1;
      return Math.max(max, segmentStops);
    }, 0);
    const stopCategory = stops >= 2 ? 2 : stops;
    if (!filters.stops.includes(stopCategory)) {
      return false;
    }

    // Airlines filter
    if (
      filters.airlines.length > 0 &&
      !flight.validatingAirlineCodes.some(code => filters.airlines.includes(code))
    ) {
      return false;
    }

    // Duration filter
    const totalDuration = flight.itineraries.reduce((sum, it) => {
      const hours = parseInt(it.duration.match(/(\d+)H/)?.[1] || '0');
      const minutes = parseInt(it.duration.match(/(\d+)M/)?.[1] || '0');
      return sum + hours * 60 + minutes;
    }, 0);
    if (totalDuration > filters.maxDuration) {
      return false;
    }

    return true;
  });
};

export const getFilterCounts = (
  flights: FlightOffer[]
): {
  stopCounts: Record<number, number>;
  airlineCounts: Record<string, number>;
} => {
  const stopCounts: Record<number, number> = { 0: 0, 1: 0, 2: 0 };
  const airlineCounts: Record<string, number> = {};

  flights.forEach(flight => {
    // Count stops
    const stops = flight.itineraries.reduce((max, it) => {
      const segmentStops = it.segments.length - 1;
      return Math.max(max, segmentStops);
    }, 0);
    const stopCategory = stops >= 2 ? 2 : stops;
    stopCounts[stopCategory]++;

    // Count airlines
    flight.validatingAirlineCodes.forEach(code => {
      airlineCounts[code] = (airlineCounts[code] || 0) + 1;
    });
  });

  return { stopCounts, airlineCounts };
};
