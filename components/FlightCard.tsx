'use client';

import { useState, memo } from 'react';
import { FlightOffer, Itinerary, FlightSegment } from '@/types/flight';
import { Plane, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';
import { format, parseISO, differenceInMinutes } from 'date-fns';

interface FlightCardProps {
  flight: FlightOffer;
  dictionaries?: {
    carriers?: Record<string, string>;
    aircraft?: Record<string, string>;
  };
}

function FlightCardComponent({ flight, dictionaries }: FlightCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDuration = (duration: string): string => {
    // Duration format: PT10H30M
    const hours = duration.match(/(\d+)H/)?.[1] || '0';
    const minutes = duration.match(/(\d+)M/)?.[1] || '0';
    return `${hours}h ${minutes}m`;
  };

  const formatTime = (dateTime: string): string => {
    return format(parseISO(dateTime), 'HH:mm');
  };

  const formatDate = (dateTime: string): string => {
    return format(parseISO(dateTime), 'MMM d');
  };

  const getLayoverTime = (arrival: string, nextDeparture: string): string => {
    const minutes = differenceInMinutes(parseISO(nextDeparture), parseISO(arrival));
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getAirlineName = (carrierCode: string): string => {
    return dictionaries?.carriers?.[carrierCode] || carrierCode;
  };

  const renderSegment = (segment: FlightSegment, index: number) => {
    const airlineName = getAirlineName(segment.carrierCode);

    return (
      <div key={index} className="py-4 border-b last:border-b-0">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Plane className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{airlineName}</p>
              <p className="text-sm text-gray-500">
                {segment.carrierCode} {segment.number}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Aircraft</p>
            <p className="font-medium text-gray-900">
              {dictionaries?.aircraft?.[segment.aircraft.code] || segment.aircraft.code}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {/* Departure */}
          <div>
            <p className="text-lg sm:text-2xl font-bold text-gray-900">
              {formatTime(segment.departure.at)}
            </p>
            <p className="text-xs sm:text-sm font-medium text-gray-700">
              {segment.departure.iataCode}
            </p>
            <p className="text-xs text-gray-500">
              {formatDate(segment.departure.at)}
            </p>
          </div>

          {/* Duration */}
          <div className="flex flex-col items-center justify-center">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mb-1" />
            <p className="text-xs sm:text-sm font-medium text-gray-600">
              {formatDuration(segment.duration)}
            </p>
          </div>

          {/* Arrival */}
          <div className="text-right">
            <p className="text-lg sm:text-2xl font-bold text-gray-900">
              {formatTime(segment.arrival.at)}
            </p>
            <p className="text-xs sm:text-sm font-medium text-gray-700">
              {segment.arrival.iataCode}
            </p>
            <p className="text-xs text-gray-500">
              {formatDate(segment.arrival.at)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderItinerary = (itinerary: Itinerary, index: number) => {
    const segments = itinerary.segments;
    const firstSegment = segments[0];
    const lastSegment = segments[segments.length - 1];
    const stops = segments.length - 1;

    return (
      <div key={index} className="mb-4 last:mb-0">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-gray-700">
            {index === 0 ? 'Outbound' : 'Return'}
          </h4>
          <span className="text-sm text-gray-500">
            {formatDuration(itinerary.duration)}
          </span>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4 items-center">
          {/* Departure */}
          <div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">
              {formatTime(firstSegment.departure.at)}
            </p>
            <p className="text-xs sm:text-sm font-medium text-gray-700">
              {firstSegment.departure.iataCode}
            </p>
            <p className="text-xs text-gray-500">
              {formatDate(firstSegment.departure.at)}
            </p>
          </div>

          {/* Flight Path */}
          <div className="flex flex-col items-center px-2 sm:px-4">
            <Plane className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mb-1" />
            <div className="w-16 sm:w-24 h-px bg-gray-300 relative">
              {stops > 0 && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1 sm:px-2">
                  <span className="text-xs text-gray-500">
                    {stops} stop{stops > 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Arrival */}
          <div className="text-right">
            <p className="text-xl sm:text-2xl font-bold text-gray-900">
              {formatTime(lastSegment.arrival.at)}
            </p>
            <p className="text-xs sm:text-sm font-medium text-gray-700">
              {lastSegment.arrival.iataCode}
            </p>
            <p className="text-xs text-gray-500">
              {formatDate(lastSegment.arrival.at)}
            </p>
          </div>
        </div>

        {/* Layovers */}
        {stops > 0 && (
          <div className="mt-2 text-sm text-gray-500">
            Layover in:{' '}
            {segments.slice(0, -1).map((seg, i) => (
              <span key={i}>
                {seg.arrival.iataCode}
                {i < segments.length - 2 && ', '}
              </span>
            ))}
          </div>
        )}

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 border-t pt-4">
            {segments.map((segment, i) => (
              <div key={i}>
                {renderSegment(segment, i)}
                {i < segments.length - 1 && (
                  <div className="py-3 flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>
                      Layover in {segment.arrival.iataCode}:{' '}
                      {getLayoverTime(segment.arrival.at, segments[i + 1].departure.at)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const price = parseFloat(flight.price.total);
  const currency = flight.price.currency;
  const mainAirline = getAirlineName(flight.validatingAirlineCodes[0]);

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 sm:p-6 mb-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900 mb-1">
            {mainAirline}
          </h3>
          <div className="flex items-center gap-2">
            {flight.itineraries[0].segments.length === 1 ? (
              <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded">
                Non-stop
              </span>
            ) : (
              <span className="text-xs font-medium px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                {flight.itineraries[0].segments.length - 1} stop
                {flight.itineraries[0].segments.length - 1 > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        <div className="text-right">
          <p className="text-2xl sm:text-3xl font-bold text-blue-600">
            {currency} {price.toFixed(2)}
          </p>
          <p className="text-xs sm:text-sm text-gray-500">per person</p>
        </div>
      </div>

      <div className="space-y-4">
        {flight.itineraries.map((itinerary, index) => renderItinerary(itinerary, index))}
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={clsx(
          'w-full mt-4 py-2 flex items-center justify-center gap-2',
          'text-blue-600 hover:text-blue-700 font-medium transition-colors',
          'border-t pt-4'
        )}
      >
        {isExpanded ? (
          <>
            Hide Details
            <ChevronUp className="w-5 h-5" />
          </>
        ) : (
          <>
            View Details
            <ChevronDown className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );
}

// Memoize component to prevent unnecessary re-renders
export const FlightCard = memo(FlightCardComponent);