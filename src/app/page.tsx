'use client';

import { useState } from 'react';
import { FlightSearch } from '@/components/FlightSearch';
import { FlightResults } from '@/components/FlightResults';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { RecentSearches } from '@/components/RecentSearches';
import { useFlightSearch } from '@/hooks/useFlightSearch';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import { SearchParams } from '@/types/flight';
import { Plane } from 'lucide-react';

export default function Home() {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const { data: flightData, isLoading, error } = useFlightSearch(searchParams);
  const { recentSearches, addRecentSearch, clearRecentSearches } = useRecentSearches();

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
    addRecentSearch(params);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Flight Search Engine
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Find and compare the best flight deals
                </p>
              </div>
            </div>
            <DarkModeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <FlightSearch onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Recent Searches */}
        {!searchParams && recentSearches.length > 0 && (
          <div className="mb-8 max-w-md">
            <RecentSearches
              searches={recentSearches}
              onSelect={handleSearch}
              onClear={clearRecentSearches}
            />
          </div>
        )}

        {/* Results Section */}
        {searchParams ? (
          <FlightResults data={flightData} isLoading={isLoading} error={error} searchParams={searchParams} />
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 transition-colors">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                <Plane className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Ready to find your next flight?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                Enter your travel details above to search for the best flight deals.
                Compare prices, filter by preferences, and book with confidence.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 dark:border-gray-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            Built with Next.js, TypeScript, and Amadeus API
          </p>
        </div>
      </footer>
    </div>
  );
}