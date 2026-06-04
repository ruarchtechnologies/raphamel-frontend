'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, TrendingUp, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';
import { useProductSearch } from '@/features/catalog/hooks/useProducts';

const TRENDING = [
  'Surgical gloves',
  'Nitrile gloves',
  'Face masks',
  'Syringe',
  'Blood pressure monitor',
  'Stethoscope',
];

interface SearchBarProps {
  className?: string;
  onClose?: () => void;
}

export function SearchBar({ className, onClose }: SearchBarProps) {
  const [query, setQuery]       = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [focused, setFocused]   = useState(false);
  const inputRef                = useRef<HTMLInputElement>(null);
  const containerRef            = useRef<HTMLDivElement>(null);
  const router                  = useRouter();

  // Debounce query by 300ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const { data, isFetching } = useProductSearch(debouncedQuery);
  const results = data?.data ?? [];

  const showDropdown = focused && (query.length === 0 || query.length >= 2);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setFocused(false);
      onClose?.();
    }
  };

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <form onSubmit={handleSubmit} className="relative">
        <Search
          size={17}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Search products, categories…"
          className={cn(
            'input-base pl-10 pr-10 h-11 rounded-full bg-gray-50 border-gray-200',
            'focus:bg-white focus:border-primary',
          )}
        />
        {query ? (
          <button
            type="button"
            onClick={() => { setQuery(''); setDebouncedQuery(''); inputRef.current?.focus(); }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
          >
            <X size={15} />
          </button>
        ) : isFetching ? (
          <Loader2 size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
        ) : null}
      </form>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[10px] shadow-xl border border-gray-100 overflow-hidden z-50"
          >
            {query.length === 0 ? (
              <div className="p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                  Trending Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {TRENDING.map((term) => (
                    <button
                      key={term}
                      onClick={() => { setQuery(term); inputRef.current?.focus(); }}
                      className="flex items-center gap-1.5 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full px-3 py-1 transition-colors"
                    >
                      <TrendingUp size={12} className="text-primary" />
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            ) : isFetching && results.length === 0 ? (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-gray-400">
                <Loader2 size={16} className="animate-spin" />
                Searching…
              </div>
            ) : results.length > 0 ? (
              <ul className="py-2">
                {results.slice(0, 5).map((product) => {
                  const thumbnail = product.images[0] ?? null;
                  return (
                    <li key={product.id}>
                      <Link
                        href={`/products/${product.slug}`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        onClick={() => { setFocused(false); onClose?.(); }}
                      >
                        <div className="w-10 h-10 rounded-[6px] overflow-hidden bg-gray-100 flex-shrink-0">
                          {thumbnail ? (
                            <Image src={thumbnail} alt={product.name} width={40} height={40} className="object-cover w-full h-full" />
                          ) : (
                            <div className="w-full h-full bg-gray-200" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                          <p className="text-xs text-primary font-semibold">{formatPrice(product.price)}</p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
                <li className="border-t border-gray-100 px-4 py-2.5">
                  <button
                    type="submit"
                    form="search-form"
                    className="text-sm text-primary font-medium hover:underline"
                    onClick={() => {
                      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                      setFocused(false);
                      onClose?.();
                    }}
                  >
                    See all results for &ldquo;{query}&rdquo;
                  </button>
                </li>
              </ul>
            ) : debouncedQuery.length >= 2 ? (
              <div className="py-8 text-center text-sm text-gray-400">
                No products found for &ldquo;{debouncedQuery}&rdquo;
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
