'use client';

export function FlightCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-4 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="text-right">
          <div className="h-8 bg-gray-200 rounded w-28 mb-1"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </div>

      {/* Flight Info */}
      <div className="space-y-4">
        {/* Outbound */}
        <div>
          <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4 items-center">
            <div>
              <div className="h-6 bg-gray-200 rounded w-16 mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-12 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-14"></div>
            </div>
            <div className="flex flex-col items-center px-2">
              <div className="w-4 h-4 bg-gray-200 rounded-full mb-1"></div>
              <div className="w-16 sm:w-24 h-px bg-gray-200"></div>
            </div>
            <div className="text-right">
              <div className="h-6 bg-gray-200 rounded w-16 mb-1 ml-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-12 mb-1 ml-auto"></div>
              <div className="h-3 bg-gray-200 rounded w-14 ml-auto"></div>
            </div>
          </div>
        </div>

        {/* Return */}
        <div>
          <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4 items-center">
            <div>
              <div className="h-6 bg-gray-200 rounded w-16 mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-12 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-14"></div>
            </div>
            <div className="flex flex-col items-center px-2">
              <div className="w-4 h-4 bg-gray-200 rounded-full mb-1"></div>
              <div className="w-16 sm:w-24 h-px bg-gray-200"></div>
            </div>
            <div className="text-right">
              <div className="h-6 bg-gray-200 rounded w-16 mb-1 ml-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-12 mb-1 ml-auto"></div>
              <div className="h-3 bg-gray-200 rounded w-14 ml-auto"></div>
            </div>
          </div>
        </div>
      </div>

      {/* View Details Button */}
      <div className="mt-4 pt-4 border-t">
        <div className="h-10 bg-gray-200 rounded w-32 mx-auto"></div>
      </div>
    </div>
  );
}