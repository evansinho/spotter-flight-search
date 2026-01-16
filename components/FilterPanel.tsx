'use client';

import { memo } from 'react';
import { FlightFilters } from '@/lib/filters/flightFilters';
import { Filter, X } from 'lucide-react';
import clsx from 'clsx';

interface FilterPanelProps {
  filters: FlightFilters;
  defaultFilters: FlightFilters;
  counts: {
    stopCounts: Record<number, number>;
    airlineCounts: Record<string, number>;
  };
  dictionaries?: {
    carriers?: Record<string, string>;
  };
  onFilterChange: <K extends keyof FlightFilters>(
    key: K,
    value: FlightFilters[K]
  ) => void;
  onReset: () => void;
  activeFilterCount: number;
}

function FilterPanelComponent({
  filters,
  defaultFilters,
  counts,
  dictionaries,
  onFilterChange,
  onReset,
  activeFilterCount,
}: FilterPanelProps) {
  const handleStopToggle = (stop: number) => {
    const newStops = filters.stops.includes(stop)
      ? filters.stops.filter(s => s !== stop)
      : [...filters.stops, stop];
    onFilterChange('stops', newStops);
  };

  const handleAirlineToggle = (airline: string) => {
    const newAirlines = filters.airlines.includes(airline)
      ? filters.airlines.filter(a => a !== airline)
      : [...filters.airlines, airline];
    onFilterChange('airlines', newAirlines);
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getAirlineName = (code: string): string => {
    return dictionaries?.carriers?.[code] || code;
  };

  const topAirlines = Object.entries(counts.airlineCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={onReset}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 p-2 -m-2 min-h-[44px]"
          >
            <X className="w-4 h-4" />
            Reset
          </button>
        )}
      </div>

      {/* Stops Filter */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Stops</h4>
        <div className="space-y-2">
          {[
            { value: 0, label: 'Non-stop' },
            { value: 1, label: '1 stop' },
            { value: 2, label: '2+ stops' },
          ].map(({ value, label }) => (
            <label
              key={value}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-2 py-3 rounded-lg transition-colors min-h-[44px]"
            >
              <input
                type="checkbox"
                checked={filters.stops.includes(value)}
                onChange={() => handleStopToggle(value)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
              <span className="flex-1 text-sm text-gray-700">{label}</span>
              <span className="text-sm text-gray-500">
                ({counts.stopCounts[value] || 0})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>€{filters.priceRange[0]}</span>
            <span>€{filters.priceRange[1]}</span>
          </div>
          <input
            type="range"
            min={defaultFilters.priceRange[0]}
            max={defaultFilters.priceRange[1]}
            value={filters.priceRange[1]}
            onChange={(e) =>
              onFilterChange('priceRange', [
                filters.priceRange[0],
                parseInt(e.target.value),
              ])
            }
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>

      {/* Duration Filter */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Max Duration</h4>
        <div className="space-y-3">
          <div className="text-sm text-gray-600">
            Up to {formatDuration(filters.maxDuration)}
          </div>
          <input
            type="range"
            min={0}
            max={defaultFilters.maxDuration}
            step={30}
            value={filters.maxDuration}
            onChange={(e) => onFilterChange('maxDuration', parseInt(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>

      {/* Airlines Filter */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Airlines</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {topAirlines.map(([code, count]) => (
            <label
              key={code}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-2 py-3 rounded-lg transition-colors min-h-[44px]"
            >
              <input
                type="checkbox"
                checked={
                  filters.airlines.length === 0 || filters.airlines.includes(code)
                }
                onChange={() => handleAirlineToggle(code)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
              <span className="flex-1 text-sm text-gray-700 truncate">
                {getAirlineName(code)}
              </span>
              <span className="text-sm text-gray-500">({count})</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// Memoize component to prevent unnecessary re-renders when parent re-renders
export const FilterPanel = memo(FilterPanelComponent);
