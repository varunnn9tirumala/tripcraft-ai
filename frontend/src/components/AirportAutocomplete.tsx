import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Loader2, MapPin, Plane, CheckCircle } from 'lucide-react';
import { filterCities, type City } from '../data/cities';

export interface Airport {
  code: string;
  name: string;
  city_name: string;
  country_name: string;
  country_code: string;
  type: 'airport' | 'city';
}

interface AirportAutocompleteProps {
  id?: string;
  value: Airport | null;
  onAirportSelect: (airport: Airport | null) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function AirportAutocomplete({
  id,
  value,
  onAirportSelect,
  placeholder = 'Search for airport or city',
  disabled = false,
}: AirportAutocompleteProps) {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isValidSelection, setIsValidSelection] = useState(false);
  const [suggestions, setSuggestions] = useState<Airport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Convert City to Airport format
  const convertCityToAirport = (city: City): Airport => ({
    code: city.airportCode,
    name: city.displayName,
    city_name: city.city,
    country_name: city.country,
    country_code: city.country,
    type: 'airport',
  });

  // Search cities locally
  useEffect(() => {
    if (inputValue.length >= 2) {
      setIsLoading(true);
      const cities = filterCities(inputValue);
      const airports = cities.map(convertCityToAirport);
      setSuggestions(airports);
      setIsLoading(false);
    } else {
      setSuggestions([]);
    }
  }, [inputValue]);

  // Update input value when value prop changes
  useEffect(() => {
    if (value) {
      setInputValue(`${value.city_name} (${value.code})`);
      setIsValidSelection(true);
    } else {
      setInputValue('');
      setIsValidSelection(false);
    }
  }, [value]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);
    setSelectedIndex(-1);
    setIsValidSelection(false);

    // Clear selection if input is cleared
    if (!newValue) {
      onAirportSelect(null);
    }
  };

  const handleAirportClick = (airport: Airport) => {
    setInputValue(`${airport.city_name} (${airport.code})`);
    setIsValidSelection(true);
    onAirportSelect(airport);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'ArrowDown' && inputValue.length >= 2) {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleAirportClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleFocus = () => {
    if (inputValue.length >= 2 && suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  const handleBlur = () => {
    // Validate on blur - if input doesn't match a valid selection, show error state
    if (inputValue && !isValidSelection) {
      // User typed something but didn't select from dropdown
      setTimeout(() => {
        if (!isOpen) {
          // Only show error if dropdown is closed (not clicking on suggestion)
          setInputValue('');
          onAirportSelect(null);
        }
      }, 200);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Input
          ref={inputRef}
          id={id}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`pr-10 ${
            isValidSelection
              ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
              : inputValue && !isOpen
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : ''
          }`}
          autoComplete="off"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          ) : isValidSelection ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : null}
        </div>
      </div>

      {/* Validation message */}
      {inputValue && !isValidSelection && !isOpen && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
          Please select an airport from the suggestions
        </p>
      )}

      {/* Dropdown */}
      {isOpen && inputValue.length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
              <p className="text-sm">Searching airports...</p>
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="py-1">
              {suggestions.map((airport, index) => (
                <li key={`${airport.code}-${index}`}>
                  <button
                    type="button"
                    onClick={() => handleAirportClick(airport)}
                    className={`w-full text-left px-4 py-3 hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors ${
                      index === selectedIndex ? 'bg-orange-50 dark:bg-gray-700' : ''
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        {airport.type === 'airport' ? (
                          <Plane className="h-4 w-4 text-orange-600" />
                        ) : (
                          <MapPin className="h-4 w-4 text-orange-600" />
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {airport.name}
                          </p>
                          <span className="text-xs font-mono font-bold text-orange-600 ml-2">
                            {airport.code}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                          {airport.city_name}, {airport.country_name}
                        </p>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <p className="text-sm">No airports found</p>
              <p className="text-xs mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
