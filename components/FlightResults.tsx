'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { FlightOffersResponse, SearchParams } from '@/types/flight';
import { FlightCard } from './FlightCard';
import { FlightCardSkeleton } from './FlightCardSkeleton';
import { FilterPanel } from './FilterPanel';
import { MobileFilterDrawer } from './MobileFilterDrawer';
import { ShareSearchButton } from './ShareSearchButton';
import { useFlightFilters } from '@/hooks/useFlightFilters';
import { Loader2, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

// Dynamically import PriceGraph to reduce initial bundle size (Recharts is heavy)
const PriceGraph = dynamic(() => import('./PriceGraph').then(mod => ({ default: mod.PriceGraph })), {
  loading: () => (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 h-[400px] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  ),
  ssr: false
});

interface FlightResultsProps {
  data: FlightOffersResponse | undefined;
  isLoading: boolean;
  error: Error | null;
  searchParams: SearchParams | null;
}

type SortOption = 'price-asc' | 'price-desc' | 'duration-asc' | 'duration-desc';

export function FlightResults({ data, isLoading, error, searchParams }: FlightResultsProps) {
  const [sortBy, setSortBy] = useState<SortOption>('price-asc');

  // Use filter hook
  const {
    filters,
    filteredFlights,
    counts,
    updateFilter,
    resetFilters,
    activeFilterCount,
    defaultFilters,
  } = useFlightFilters(data?.data || []);

  // Apply sorting to filtered flights
  const sortedFlights = useMemo(() => {
    const flights = [...filteredFlights];

    switch (sortBy) {
      case 'price-asc':
        return flights.sort((a, b) => parseFloat(a.price.total) - parseFloat(b.price.total));
      case 'price-desc':
        return flights.sort((a, b) => parseFloat(b.price.total) - parseFloat(a.price.total));
      case 'duration-asc':
        return flights.sort((a, b) => {
          const aDuration = a.itineraries.reduce((sum, it) => {
            const hours = parseInt(it.duration.match(/(\d+)H/)?.[1] || '0');
            const minutes = parseInt(it.duration.match(/(\d+)M/)?.[1] || '0');
            return sum + hours * 60 + minutes;
          }, 0);
          const bDuration = b.itineraries.reduce((sum, it) => {
            const hours = parseInt(it.duration.match(/(\d+)H/)?.[1] || '0');
            const minutes = parseInt(it.duration.match(/(\d+)M/)?.[1] || '0');
            return sum + hours * 60 + minutes;
          }, 0);
          return aDuration - bDuration;
        });
      case 'duration-desc':
        return flights.sort((a, b) => {
          const aDuration = a.itineraries.reduce((sum, it) => {
            const hours = parseInt(it.duration.match(/(\d+)H/)?.[1] || '0');
            const minutes = parseInt(it.duration.match(/(\d+)M/)?.[1] || '0');
            return sum + hours * 60 + minutes;
          }, 0);
          const bDuration = b.itineraries.reduce((sum, it) => {
            const hours = parseInt(it.duration.match(/(\d+)H/)?.[1] || '0');
            const minutes = parseInt(it.duration.match(/(\d+)M/)?.[1] || '0');
            return sum + hours * 60 + minutes;
          }, 0);
          return bDuration - aDuration;
        });
      default:
        return flights;
    }
  }, [filteredFlights, sortBy]);

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto mt-8 px-3 sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Empty space for filters */}
          <div className="hidden lg:block"></div>

          {/* Skeleton loaders */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
              <p className="text-lg text-gray-600">Searching for flights...</p>
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <FlightCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 mb-1">
                Search Error
              </h3>
              <p className="text-red-700">{error.message}</p>
              <p className="text-sm text-red-600 mt-2">
                Please try adjusting your search criteria and try again.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No flights found
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            We couldn't find any flights matching your search criteria. Try adjusting your dates or destinations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-7xl mx-auto mt-8 px-3 sm:px-4">
        {/* Grid layout: Filters on left, Results on right */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Filter Panel - Hidden on mobile, visible on desktop */}
          <aside className="hidden lg:block" aria-label="Flight filters">
            <FilterPanel
              filters={filters}
              defaultFilters={defaultFilters}
              counts={counts}
              dictionaries={data.dictionaries}
              onFilterChange={updateFilter}
              onReset={resetFilters}
              activeFilterCount={activeFilterCount}
            />
          </aside>

          {/* Results Column */}
          <main>
            {/* Header with results count and sorting */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white" role="status" aria-live="polite">
                  {sortedFlights.length} flight{sortedFlights.length !== 1 ? 's' : ''} found
                </h2>
                {sortedFlights.length < data.data.length && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Showing filtered results from {data.data.length} total flights
                  </p>
                )}
              </div>

              {/* Sort dropdown */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label htmlFor="sort" className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  Sort:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className={clsx(
                    'flex-1 sm:flex-initial px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg',
                    'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                    'text-sm sm:text-base text-gray-900 dark:text-white font-medium bg-white dark:bg-gray-800 cursor-pointer',
                    'transition-all duration-200'
                  )}
                >
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="duration-asc">Duration: Shortest First</option>
                  <option value="duration-desc">Duration: Longest First</option>
                </select>
              </div>
            </div>

            {/* Share Search Button */}
            {searchParams && (
              <div className="mb-6">
                <ShareSearchButton searchParams={searchParams} />
              </div>
            )}

            {/* Price Graph */}
            <div className="mb-6">
              <PriceGraph flights={sortedFlights} currency={data.data[0]?.price.currency} />
            </div>

            {/* Flight cards */}
            {sortedFlights.length > 0 ? (
              <div className="space-y-4">
                {sortedFlights.map((flight, index) => (
                  <FlightCard
                    key={`${flight.id}-${index}`}
                    flight={flight}
                    dictionaries={data.dictionaries}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No flights match your filters
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-4">
                  Try adjusting your filter settings to see more results.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer - Only visible on mobile/tablet */}
      <MobileFilterDrawer
        filters={filters}
        defaultFilters={defaultFilters}
        counts={counts}
        dictionaries={data.dictionaries}
        onFilterChange={updateFilter}
        onReset={resetFilters}
        activeFilterCount={activeFilterCount}
      />
    </>
  );
}
