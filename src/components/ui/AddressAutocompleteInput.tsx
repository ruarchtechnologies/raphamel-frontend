'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { MapPin, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/Input';

export interface ParsedAddress {
  formattedAddress: string;
  placeId: string;
  lat: number;
  lng: number;
  /** Street number + route, e.g. "12 Industrial Ave". Empty string if Google didn't return one. */
  addressLine: string;
  city: string;
  /** Nigerian state, normalized against the NG_STATES list (e.g. "FCT" not "Federal Capital Territory"). Empty string if unmatched. */
  province: string;
}

interface AddressComponent {
  long_name: string;
  types: string[];
}

function getComponent(components: AddressComponent[], type: string) {
  return components.find((c) => c.types.includes(type))?.long_name ?? '';
}

function parseAddressComponents(components: AddressComponent[]) {
  const streetNumber = getComponent(components, 'street_number');
  const route = getComponent(components, 'route');
  const city =
    getComponent(components, 'locality') ||
    getComponent(components, 'administrative_area_level_2') ||
    getComponent(components, 'sublocality');
  const rawState = getComponent(components, 'administrative_area_level_1');

  return {
    addressLine: [streetNumber, route].filter(Boolean).join(' '),
    city,
    province: normalizeNgState(rawState),
  };
}

const NG_STATE_ALIASES: Record<string, string> = {
  'federal capital territory': 'FCT',
  'akwa ibom state': 'Akwa Ibom',
  'cross river state': 'Cross River',
};

/** Matches Google's state name against NG_STATES, stripping the "State" suffix Google sometimes appends. */
function normalizeNgState(rawState: string) {
  if (!rawState) return '';
  const key = rawState.trim().toLowerCase();
  if (NG_STATE_ALIASES[key]) return NG_STATE_ALIASES[key];
  return rawState.replace(/\s+State$/i, '').trim();
}

interface AddressAutocompleteInputProps {
  label?: string;
  placeholder?: string;
  error?: string;
  /** Prefills the search box, e.g. when editing an existing saved address. */
  defaultValue?: string;
  /** Return `false` to reject the selection (shows an error animation) — e.g. the address fails a business rule. */
  onSelect: (address: ParsedAddress) => boolean | void;
}

export function AddressAutocompleteInput({
  label = 'Facility address',
  placeholder = 'Start typing your facility\'s address…',
  error,
  defaultValue,
  onSelect,
}: AddressAutocompleteInputProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectionStatus, setSelectionStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');

  const {
    ready,
    value,
    suggestions: { status: suggestionStatus, data },
    setValue,
    clearSuggestions,
    init,
  } = usePlacesAutocomplete({
    debounce: 300,
    initOnMount: false,
    defaultValue,
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

  // Covers the case where the Maps script was already loaded by an earlier mount
  // in this session (e.g. navigated here without a full page reload) — in that case
  // next/script won't fire onLoad again, so init() would otherwise never run.
  useEffect(() => {
    if ((window as unknown as { google?: unknown }).google) init();
  }, [init]);

  // Auto-clears the check/error icon a beat after it appears.
  useEffect(() => {
    if (selectionStatus === 'idle') return;
    const timer = setTimeout(() => setSelectionStatus('idle'), 1800);
    return () => clearTimeout(timer);
  }, [selectionStatus]);

  async function handleSelect(placeId: string, description: string) {
    setValue(description, false);
    clearSuggestions();
    const results = await getGeocode({ placeId });
    const { lat, lng } = await getLatLng(results[0]);
    const { addressLine, city, province } = parseAddressComponents(results[0].address_components);
    const accepted = onSelect({ formattedAddress: description, placeId, lat, lng, addressLine, city, province });

    if (accepted === false) {
      setSelectionStatus('invalid');
      setTimeout(() => setValue('', false), 1800);
    } else {
      setSelectionStatus('valid');
    }
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
          placeholder={ready ? placeholder : 'Loading address search…'}
          leftIcon={<MapPin size={15} />}
          rightIcon={
            <AnimatePresence>
              {selectionStatus !== 'idle' && (
                <motion.span
                  key={selectionStatus}
                  initial={{ opacity: 0, x: 16, scale: 0.5 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="flex"
                >
                  {selectionStatus === 'valid' ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-rose-600" />
                  )}
                </motion.span>
              )}
            </AnimatePresence>
          }
          error={error}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {suggestionStatus === 'OK' && (
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
