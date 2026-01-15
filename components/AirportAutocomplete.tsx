'use client';

import { useState, useRef, useEffect } from 'react';
import { Plane, Loader2, MapPin } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useAirportSearch } from '@/hooks/useAirportSearch';
import { Airport } from '@/types/flight';
import clsx from 'clsx';

interface AirportAutocompleteProps {
  value: Airport | null;
  onChange: (airport: Airport | null) => void;
  placeholder?: string;
  label: string;
  error?: string;
}

export function AirportAutocomplete({
  value,
  onChange,
  placeholder = 'Search city or airport',
  label,
  error,
}: AirportAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value?.city || '');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useDebounce(inputValue, 300);
  const { data: airports = [], isLoading } = useAirportSearch(debouncedSearch);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update input value when selected airport changes externally
  useEffect(() => {
    if (value) {
      setInputValue(`${value.city} (${value.iataCode})`);
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);
    setHighlightedIndex(0);

    // Clear selection if input is cleared
    if (!newValue) {
      onChange(null);
    }
  };

  const handleAirportSelect = (airport: Airport) => {
    onChange(airport);
    setInputValue(`${airport.city} (${airport.iataCode})`);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || airports.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % airports.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + airports.length) % airports.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (airports[highlightedIndex]) {
          handleAirportSelect(airports[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const showDropdown = isOpen && inputValue.length >= 2 && (airports.length > 0 || isLoading);

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Plane className="w-5 h-5" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={clsx(
            'w-full pl-11 pr-10 py-3 border rounded-lg',
            'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'transition-all duration-200',
            error ? 'border-red-500' : 'border-gray-300'
          )}
          aria-label={label}
          aria-expanded={isOpen}
          aria-autocomplete="list"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {showDropdown && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              <p className="text-sm">Searching airports...</p>
            </div>
          ) : airports.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p className="text-sm">No airports found</p>
            </div>
          ) : (
            <ul>
              {airports.map((airport, index) => (
                <li key={airport.iataCode}>
                  <button
                    type="button"
                    onClick={() => handleAirportSelect(airport)}
                    className={clsx(
                      'w-full px-4 py-3 text-left transition-colors',
                      'hover:bg-blue-50 focus:bg-blue-50 focus:outline-none',
                      index === highlightedIndex && 'bg-blue-50'
                    )}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {airport.iataCode}
                          </span>
                          <span className="text-sm text-gray-600 truncate">
                            {airport.name}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {airport.city}
                          {airport.country && `, ${airport.country}`}
                        </p>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}