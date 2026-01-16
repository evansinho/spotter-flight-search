'use client';

import { SearchParams } from '@/types/flight';
import { Clock, X } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface RecentSearch extends SearchParams {
  timestamp: number;
  label: string;
}

interface RecentSearchesProps {
  searches: RecentSearch[];
  onSelect: (params: SearchParams) => void;
  onClear: () => void;
}

export function RecentSearches({ searches, onSelect, onClear }: RecentSearchesProps) {
  if (searches.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM d');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Recent Searches
          </h3>
        </div>
        <button
          onClick={onClear}
          className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          aria-label="Clear recent searches"
        >
          Clear
        </button>
      </div>

      <div className="space-y-2">
        {searches.map((search, index) => (
          <button
            key={`${search.originLocationCode}-${search.destinationLocationCode}-${search.timestamp}`}
            onClick={() => onSelect(search)}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {search.label}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {formatDate(search.departureDate)}
                  {search.returnDate && ` - ${formatDate(search.returnDate)}`}
                  {' • '}
                  {search.adults} {search.adults === 1 ? 'adult' : 'adults'}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}