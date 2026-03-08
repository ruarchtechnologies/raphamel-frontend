'use client';

import Link from 'next/link';
import { ChevronDown, User, ShoppingBag, Heart, Store, LayoutGrid, Tag, Info, Phone } from 'lucide-react';
import { useState } from 'react';
import { Drawer } from './Drawer';
import { useUIStore } from '@/stores/ui.store';
import { cn } from '@/lib/utils';

const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/products' },
  {
    label: 'Categories', href: '/categories',
    children: [
      { label: 'Electronics', href: '/categories/electronics' },
      { label: 'Fashion', href: '/categories/fashion' },
      { label: 'Home & Living', href: '/categories/home-living' },
      { label: 'Health & Beauty', href: '/categories/health-beauty' },
      { label: 'Sports', href: '/categories/sports' },
    ],
  },
  { label: 'Vendors', href: '/vendors' },
  { label: 'Deals', href: '/products?sort=sale' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function MobileMenu() {
  const { menuOpen, setMenuOpen } = useUIStore();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <Drawer
      open={menuOpen}
      onClose={() => setMenuOpen(false)}
      side="left"
      title="Menu"
      width="300px"
    >
      <nav className="px-4 py-3">
        <ul className="space-y-0.5">
          {NAV.map((item) => (
            <li key={item.label}>
              {item.children ? (
                <>
                  <button
                    className="w-full flex items-center justify-between py-2.5 px-2 rounded-[6px] text-[0.9375rem] font-semibold text-gray-800 hover:text-primary hover:bg-gray-50 transition-colors"
                    onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                  >
                    {item.label}
                    <ChevronDown
                      size={16}
                      className={cn('transition-transform', expanded === item.label && 'rotate-180')}
                    />
                  </button>
                  {expanded === item.label && (
                    <ul className="pl-4 space-y-0.5 mb-1">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <Link
                            href={child.href}
                            className="block py-2 px-2 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-[6px] transition-colors"
                            onClick={() => setMenuOpen(false)}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  className="block py-2.5 px-2 rounded-[6px] text-[0.9375rem] font-semibold text-gray-800 hover:text-primary hover:bg-gray-50 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="border-t border-gray-100 mt-4 pt-4 space-y-0.5">
          <Link
            href="/login"
            className="flex items-center gap-2.5 py-2.5 px-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-[6px] transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            <User size={16} /> Sign In
          </Link>
          <Link
            href="/register"
            className="flex items-center gap-2.5 py-2.5 px-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-[6px] transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            <Store size={16} /> Become a Vendor
          </Link>
        </div>
      </nav>
    </Drawer>
  );
}
