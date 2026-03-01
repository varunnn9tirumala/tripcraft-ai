import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { filterCities, type City } from '../data/cities';
import { MapPin, Loader2 } from 'lucide-react';
import { useGetDepartureCities, useGetDestinationCities } from '../hooks/useQueries';

interface CityAutocompleteProps {
  id: string;
  placeholder?: string;
  value: City | null;
  onCitySelect: (city: City | null) => void;
  className?: string;
  type?: 'departure' | 'destination';
}

export default function CityAutocomplete({ 
  id, 
  placeholder, 
  value, 
  onCitySelect, 
  className,
  type = 'departure'
}: CityAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value?.displayName || '');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Fetch backend cities for validation (optional - currently using local data)
  const { data: departureCities, isLoading: loadingDeparture, error: departureError } = useGetDepartureCities();
  const { data: destinationCities, isLoading: loadingDestination, error: destinationError } = useGetDestinationCities();

  const isLoadingCities = type === 'departure' ? loadingDeparture : loadingDestination;
  const citiesError = type === 'departure' ? departureError : destinationError;

  // Update input value when value prop changes
  useEffect(() => {
    setInputValue(value?.displayName || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && suggestionsRef.current) {
      const selectedElement = suggestionsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  const handleInputChange = (newInputValue: string) => {
    setInputValue(newInputValue);
    
    if (newInputValue.trim()) {
      const filtered = filterCities(newInputValue);
      setSuggestions(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
    
    setSelectedIndex(-1);
    
    // Clear selection if input is cleared
    if (!newInputValue) {
      onCitySelect(null);
    }
  };

  const handleSelectCity = (city: City) => {
    setInputValue(city.displayName);
    onCitySelect(city);
    setIsOpen(false);
    setSuggestions([]);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) {
      // If dropdown is closed and user types, open it with suggestions
      if (e.key !== 'Escape' && e.key !== 'Tab' && inputValue.trim()) {
        const filtered = filterCities(inputValue);
        if (filtered.length > 0) {
          setSuggestions(filtered);
          setIsOpen(true);
        }
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
          handleSelectCity(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
      case 'Tab':
        // Allow tab to close dropdown and move to next field
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Input
          ref={inputRef}
          id={id}
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (inputValue.trim()) {
              const filtered = filterCities(inputValue);
              if (filtered.length > 0) {
                setSuggestions(filtered);
                setIsOpen(true);
              }
            }
          }}
          className={className}
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={`${id}-suggestions`}
          aria-autocomplete="list"
          aria-activedescendant={selectedIndex >= 0 ? `${id}-option-${selectedIndex}` : undefined}
          disabled={isLoadingCities}
        />
        {isLoadingCities && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-orange-600" />
          </div>
        )}
      </div>

      {citiesError && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
          Unable to load cities from server. Using local data.
        </p>
      )}
      
      {isOpen && suggestions.length > 0 && (
        <Card
          ref={suggestionsRef}
          id={`${id}-suggestions`}
          role="listbox"
          className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto border-2 border-orange-200 bg-white shadow-lg dark:border-orange-800 dark:bg-gray-950"
        >
          {suggestions.map((city, index) => (
            <button
              key={`${city.airportCode}-${index}`}
              id={`${id}-option-${index}`}
              type="button"
              role="option"
              aria-selected={index === selectedIndex}
              onClick={() => handleSelectCity(city)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`w-full px-4 py-3 text-left transition-colors flex items-start gap-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0 ${
                index === selectedIndex
                  ? 'bg-orange-100 dark:bg-orange-900'
                  : 'hover:bg-orange-50 dark:hover:bg-orange-950'
              }`}
            >
              <MapPin className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 dark:text-white truncate">
                  {city.city}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <span>{city.country}</span>
                  <span className="text-orange-600 dark:text-orange-400">•</span>
                  <span className="font-mono text-xs">{city.airportCode}</span>
                </div>
              </div>
            </button>
          ))}
        </Card>
      )}
    </div>
  );
}
