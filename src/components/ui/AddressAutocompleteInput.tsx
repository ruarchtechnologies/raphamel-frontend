'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { MapPin } from 'lucide-react';
import { Input } from '@/components/ui/Input';

export interface ParsedAddress {
  formattedAddress: string;
  placeId: string;
  lat: number;
  lng: number;
}

interface AddressAutocompleteInputProps {
  label?: string;
  placeholder?: string;
  error?: string;
  onSelect: (address: ParsedAddress) => void;
}

export function AddressAutocompleteInput({
  label = 'Facility address',
  placeholder = 'Start typing your facility\'s address…',
  error,
  onSelect,
}: AddressAutocompleteInputProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
    init,
  } = usePlacesAutocomplete({
    debounce: 300,
    initOnMount: false,
    requestOptions: { componentRestrictions: { country: 'ng' } },
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        clearSuggestions();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [clearSuggestions]);

  async function handleSelect(placeId: string, description: string) {
    setValue(description, false);
    clearSuggestions();
    const results = await getGeocode({ placeId });
    const { lat, lng } = await getLatLng(results[0]);
    onSelect({ formattedAddress: description, placeId, lat, lng });
  }

  return (
    <>
      <Script
        id="google-maps-places"
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="afterInteractive"
        onLoad={() => init()}
      />
      <div className="relative" ref={containerRef}>
        <Input
          label={label}
          placeholder={placeholder}
          leftIcon={<MapPin size={15} />}
          error={error}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!ready}
        />
        {status === 'OK' && (
          <ul className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-[6px] shadow-md max-h-60 overflow-auto">
            {data.map(({ place_id, description }) => (
              <li
                key={place_id}
                onClick={() => handleSelect(place_id, description)}
                className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                {description}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
