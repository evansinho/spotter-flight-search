'use client';

import { useState } from 'react';
import { FlightFilters } from '@/lib/filters/flightFilters';
import { FilterPanel } from './FilterPanel';
import { Filter, X } from 'lucide-react';
import clsx from 'clsx';

interface MobileFilterDrawerProps {
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

export function MobileFilterDrawer({
  filters,
  defaultFilters,
  counts,
  dictionaries,
  onFilterChange,
  onReset,
  activeFilterCount,
}: MobileFilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={clsx(
          'lg:hidden fixed bottom-6 right-6 z-40',
          'w-14 h-14 rounded-full shadow-lg',
          'bg-blue-600 text-white',
          'flex items-center justify-center',
          'hover:bg-blue-700 transition-colors',
          'focus:outline-none focus:ring-4 focus:ring-blue-200'
        )}
        aria-label="Open filters"
      >
        <Filter className="w-6 h-6" />
        {activeFilterCount > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={clsx(
          'fixed inset-x-0 bottom-0 z-50 lg:hidden',
          'bg-white rounded-t-2xl shadow-2xl',
          'transform transition-transform duration-300 ease-in-out',
          'max-h-[85vh] overflow-y-auto',
          isOpen ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-3 hover:bg-gray-100 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close filters"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-4">
          <FilterPanel
            filters={filters}
            defaultFilters={defaultFilters}
            counts={counts}
            dictionaries={dictionaries}
            onFilterChange={onFilterChange}
            onReset={onReset}
            activeFilterCount={activeFilterCount}
            variant="mobile"
          />
        </div>

        {/* Apply Button */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Show Results
          </button>
        </div>
      </div>
    </>
  );
}