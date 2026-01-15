'use client';

import { useState } from 'react';
import { FlightSearch } from '@/components/FlightSearch';
import { useFlightSearch } from '@/hooks/useFlightSearch';
import { SearchParams } from '@/types/flight';
import { Plane } from 'lucide-react';

export default function Home() {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const { data: flightData, isLoading, error } = useFlightSearch(searchParams);

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Flight Search Engine
              </h1>
              <p className="text-sm text-gray-500">
                Find and compare the best flight deals
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <FlightSearch onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Results Section */}
        {isLoading && (
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-lg font-medium text-gray-900">
                Searching for flights...
              </p>
              <p className="text-sm text-gray-500 mt-1">
                This may take a few seconds
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Error Loading Flights
              </h3>
              <p className="text-gray-600">
                {error instanceof Error ? error.message : 'An error occurred while searching for flights'}
              </p>
              <button
                onClick={() => setSearchParams(null)}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {flightData && !isLoading && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Search Results
            </h2>
            <div className="space-y-4">
              <p className="text-lg text-gray-700">
                Found <span className="font-semibold">{flightData.data.length}</span> flights
              </p>
              {/* Flight results will be displayed here once we build the FlightCard component */}
              <div className="text-gray-500 text-sm">
                Flight cards component coming in Phase 4...
              </div>
            </div>
          </div>
        )}

        {!searchParams && !isLoading && (
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plane className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ready to find your next flight?
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Enter your travel details above to search for the best flight deals.
                Compare prices, filter by preferences, and book with confidence.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500 text-sm">
            Built with Next.js, TypeScript, and Amadeus API
          </p>
        </div>
      </footer>
    </div>
  );
}