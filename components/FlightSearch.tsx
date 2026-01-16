'use client';

import { useState } from 'react';
import { Calendar, Users, Search, ArrowLeftRight } from 'lucide-react';
import { AirportAutocomplete } from './AirportAutocomplete';
import { Airport, SearchParams } from '@/types/flight';
import clsx from 'clsx';
import { format } from 'date-fns';

interface FlightSearchProps {
  onSearch: (params: SearchParams) => void;
  isLoading?: boolean;
}

export function FlightSearch({ onSearch, isLoading = false }: FlightSearchProps) {
  const [origin, setOrigin] = useState<Airport | null>(null);
  const [destination, setDestination] = useState<Airport | null>(null);
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [tripType, setTripType] = useState<'round-trip' | 'one-way'>('round-trip');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [showPassengers, setShowPassengers] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get today's date in YYYY-MM-DD format
  const today = format(new Date(), 'yyyy-MM-dd');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!origin) {
      newErrors.origin = 'Please select an origin airport';
    }
    if (!destination) {
      newErrors.destination = 'Please select a destination airport';
    }
    if (origin && destination && origin.iataCode === destination.iataCode) {
      newErrors.destination = 'Destination must be different from origin';
    }
    if (!departureDate) {
      newErrors.departureDate = 'Please select a departure date';
    }
    if (tripType === 'round-trip' && !returnDate) {
      newErrors.returnDate = 'Please select a return date';
    }
    if (departureDate && returnDate && returnDate < departureDate) {
      newErrors.returnDate = 'Return date must be after departure date';
    }
    if (adults < 1) {
      newErrors.adults = 'At least 1 adult passenger is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const searchParams: SearchParams = {
      originLocationCode: origin!.iataCode,
      destinationLocationCode: destination!.iataCode,
      departureDate,
      adults,
      ...(children > 0 && { children }),
      ...(tripType === 'round-trip' && returnDate && { returnDate }),
    };

    onSearch(searchParams);
  };

  const handleSwapAirports = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const totalPassengers = adults + children;

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg p-6 md:p-8">
      {/* Trip Type Toggle */}
      <div className="flex gap-4 mb-6">
        <button
          type="button"
          onClick={() => setTripType('round-trip')}
          className={clsx(
            'px-4 py-2 rounded-lg font-medium transition-all',
            tripType === 'round-trip'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          Round Trip
        </button>
        <button
          type="button"
          onClick={() => {
            setTripType('one-way');
            setReturnDate('');
          }}
          className={clsx(
            'px-4 py-2 rounded-lg font-medium transition-all',
            tripType === 'one-way'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          One Way
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Origin and Destination */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 mb-4">
          <AirportAutocomplete
            value={origin}
            onChange={setOrigin}
            label="From"
            placeholder="City or airport"
            error={errors.origin}
          />

          {/* Swap Button */}
          <div className="hidden md:flex items-end pb-3">
            <button
              type="button"
              onClick={handleSwapAirports}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Swap origin and destination"
            >
              <ArrowLeftRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <AirportAutocomplete
            value={destination}
            onChange={setDestination}
            label="To"
            placeholder="City or airport"
            error={errors.destination}
          />
        </div>

        {/* Dates and Passengers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Departure Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Departure
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                <Calendar className="w-5 h-5" />
              </div>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                min={today}
                className={clsx(
                  'w-full pl-11 pr-4 py-3 border rounded-lg cursor-pointer',
                  'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  'transition-all duration-200',
                  'text-gray-900 font-normal',
                  '[&::-webkit-calendar-picker-indicator]:opacity-0',
                  '[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0',
                  '[&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full',
                  '[&::-webkit-calendar-picker-indicator]:cursor-pointer',
                  errors.departureDate ? 'border-red-500' : 'border-gray-300'
                )}
              />
            </div>
            {errors.departureDate && (
              <p className="mt-1 text-sm text-red-600">{errors.departureDate}</p>
            )}
          </div>

          {/* Return Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Return
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                <Calendar className="w-5 h-5" />
              </div>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                min={departureDate || today}
                disabled={tripType === 'one-way'}
                className={clsx(
                  'w-full pl-11 pr-4 py-3 border rounded-lg',
                  'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  'transition-all duration-200',
                  'text-gray-900 font-normal',
                  '[&::-webkit-calendar-picker-indicator]:opacity-0',
                  '[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0',
                  '[&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full',
                  '[&::-webkit-calendar-picker-indicator]:cursor-pointer',
                  tripType === 'one-way'
                    ? 'bg-gray-50 cursor-not-allowed'
                    : 'cursor-pointer',
                  errors.returnDate ? 'border-red-500' : 'border-gray-300'
                )}
              />
            </div>
            {errors.returnDate && (
              <p className="mt-1 text-sm text-red-600">{errors.returnDate}</p>
            )}
          </div>

          {/* Passengers */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Passengers
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                <Users className="w-5 h-5" />
              </div>
              <button
                type="button"
                onClick={() => setShowPassengers(!showPassengers)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-left hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <span className="text-gray-900 font-normal">
                  {totalPassengers} {totalPassengers === 1 ? 'Passenger' : 'Passengers'}
                </span>
              </button>
            </div>

            {/* Passenger Dropdown */}
            {showPassengers && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                <div className="space-y-4">
                  {/* Adults */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Adults</p>
                      <p className="text-sm text-gray-500">12+ years</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="w-8 h-8 rounded-full border-2 border-gray-400 hover:bg-gray-100 transition-colors text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={adults <= 1}
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-semibold text-gray-900">{adults}</span>
                      <button
                        type="button"
                        onClick={() => setAdults(Math.min(9, adults + 1))}
                        className="w-8 h-8 rounded-full border-2 border-gray-400 hover:bg-gray-100 transition-colors text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={adults >= 9}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Children</p>
                      <p className="text-sm text-gray-500">2-11 years</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        className="w-8 h-8 rounded-full border-2 border-gray-400 hover:bg-gray-100 transition-colors text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={children <= 0}
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-semibold text-gray-900">{children}</span>
                      <button
                        type="button"
                        onClick={() => setChildren(Math.min(9, children + 1))}
                        className="w-8 h-8 rounded-full border-2 border-gray-400 hover:bg-gray-100 transition-colors text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={children >= 9}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPassengers(false)}
                  className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={clsx(
            'w-full md:w-auto px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-lg',
            'hover:bg-blue-700 focus:ring-4 focus:ring-blue-200',
            'transition-all duration-200 flex items-center justify-center gap-2',
            isLoading && 'opacity-50 cursor-not-allowed'
          )}
        >
          <Search className="w-5 h-5" />
          {isLoading ? 'Searching...' : 'Search Flights'}
        </button>
      </form>
    </div>
  );
}