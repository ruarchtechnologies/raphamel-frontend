'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';

// Mock suggestions — in production these come from the API
const TRENDING = ['Nike sneakers', 'Samsung phone', 'Leather bag', 'Wireless earbuds', 'Perfume'];

const MOCK_RESULTS = [
  { id: '1', name: 'Premium Wireless Headphones', price: 45000, slug: 'premium-wireless-headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop' },
  { id: '2', name: 'Men\'s Running Shoes', price: 28000, slug: 'mens-running-shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop' },
  { id: '3', name: 'Leather Crossbody Bag', price: 35000, slug: 'leather-crossbody-bag', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=80&h=80&fit=crop' },
];

interface SearchBarProps {
  className?: string;
  onClose?: () => void;
}

export function SearchBar({ className, onClose }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const results = query.length > 1 ? MOCK_RESULTS.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  ) : [];

  const showDropdown = focused && (query.length === 0 || results.length > 0);

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
          placeholder="Search products, brands, categories…"
          className={cn(
            'input-base pl-10 pr-10 h-11 rounded-full bg-gray-50 border-gray-200',
            'focus:bg-white focus:border-primary',
          )}
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); inputRef.current?.focus(); }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
          >
            <X size={15} />
          </button>
        )}
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
            ) : (
              <ul className="py-2">
                {results.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/products/${product.slug}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      onClick={() => { setFocused(false); onClose?.(); }}
                    >
                      <div className="w-10 h-10 rounded-[6px] overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image src={product.image} alt={product.name} width={40} height={40} className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-xs text-primary font-semibold">{formatPrice(product.price)}</p>
                      </div>
                    </Link>
                  </li>
                ))}
                <li className="border-t border-gray-100 px-4 py-2.5">
                  <button
                    className="text-sm text-primary font-medium hover:underline"
                    onClick={handleSubmit as any}
                  >
                    See all results for &ldquo;{query}&rdquo;
                  </button>
                </li>
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
