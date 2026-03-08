/**
 * FLUTTER EQUIV: AppBar + Drawer + BottomNavigationBar combined.
 *
 * In Flutter: AppBar is in Scaffold(appBar: AppBar(...)).
 * In Next.js: Header is a regular component placed in the (shop) layout
 * above the page content — it's sticky (stays at top when scrolling).
 *
 * SCROLL DETECTION:
 *   Flutter: ScrollController + listener → setState({ scrolled: true })
 *   React:   useEffect + window.addEventListener('scroll', ...) → useState
 *
 * This component is 'use client' because:
 * 1. It uses useState (scroll shadow, dropdown open state)
 * 2. It uses useEffect (scroll listener)
 * 3. It reads from Zustand stores (cart count, drawer state)
 *
 * FLUTTER DIFFERENCE: In Flutter, the AppBar widget re-builds automatically
 * when its parent rebuilds. In React, we use hooks to subscribe to specific
 * pieces of state — only this component re-renders when cart count changes.
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  Menu, Heart, ShoppingBag, User, ChevronDown, Search,
} from 'lucide-react';
import { SearchBar } from './SearchBar';
import { CartSidebar } from './CartSidebar';
import { MobileMenu } from './MobileMenu';
import { useUIStore } from '@/stores/ui.store';
import { useCartStore } from '@/stores/cart.store';
import { cn } from '@/lib/utils';

// ── Navigation configuration ─────────────────────────────────────────────────
//
// FLUTTER EQUIV: A const List<NavItem> defined in your routes/navigation config.
// Imported from the domain layer's HEALTH_CATEGORIES in a real implementation.

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  {
    label: 'Categories',
    href: '/categories',
    children: [
      { label: 'Hospital Consumables', href: '/categories/hospital-consumables' },
      { label: 'Surgical Equipment', href: '/categories/surgical-equipment' },
      { label: 'Diagnostic Devices', href: '/categories/diagnostic-devices' },
      { label: 'Personal Protective Equip.', href: '/categories/personal-protective-equipment' },
      { label: 'Rehabilitation Equipment', href: '/categories/rehabilitation-equipment' },
      { label: 'Laboratory Supplies', href: '/categories/laboratory-supplies' },
      { label: 'Patient Care Products', href: '/categories/patient-care-products' },
      { label: 'First Aid & Emergency', href: '/categories/first-aid-emergency' },
      { label: 'Mobility & Orthopaedic', href: '/categories/mobility-orthopaedic-aids' },
      { label: 'Imaging & Monitoring', href: '/categories/imaging-monitoring-equipment' },
    ],
  },
  { label: 'Suppliers', href: '/vendors' },
  { label: 'Deals', href: '/products?sort=sale' },
] as const;

// ── NavLink sub-component ─────────────────────────────────────────────────────
//
// FLUTTER EQUIV: A StatefulWidget (because it has open/closed dropdown state).
// It uses onMouseEnter/Leave (hover) for desktop — Flutter uses GestureDetector.

function NavLink({ item }: { item: (typeof NAV_LINKS)[number] }) {
  /*
   * FLUTTER EQUIV: bool _open = false; (inside StatefulWidget state)
   * useState<boolean> — React's version of a simple boolean state variable.
   */
  const [open, setOpen] = useState(false);

  if (!('children' in item) || !item.children) {
    return (
      <Link
        href={item.href}
        className="flex items-center h-full px-1 text-sm font-semibold text-gray-800 hover:text-primary transition-colors whitespace-nowrap"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div
      className="relative flex items-center h-full"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center gap-1 h-full px-1 text-sm font-semibold text-gray-800 hover:text-primary transition-colors">
        {item.label}
        <ChevronDown
          size={14}
          className={cn('transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 pt-2 z-50">
          <div className="bg-white rounded-[8px] shadow-xl border border-gray-100 py-2 min-w-[220px] animate-slide-down">
            {item.children.map((child) => (
              <Link
                key={child.label}
                href={child.href}
                className="block px-4 py-2.5 text-sm text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors"
                onClick={() => setOpen(false)}
              >
                {child.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Header component ─────────────────────────────────────────────────────

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { setCartOpen, setMenuOpen } = useUIStore();

  /*
   * FLUTTER EQUIV:
   *   useCartStore((s) => s.itemCount()) is like:
   *   context.select<CartModel, int>((cart) => cart.itemCount)
   *
   * The selector `(s) => s.itemCount()` means: "only re-render Header
   * when the itemCount value changes" — NOT when other cart fields change.
   * This is like Riverpod's select() or BLoC's buildWhen.
   */
  const itemCount = useCartStore((s) => s.itemCount());

  /*
   * FLUTTER EQUIV: initState() + addPostFrameCallback + ScrollController
   *
   * useEffect with [] runs ONCE after first render (= initState).
   * The returned function runs on unmount (= dispose).
   * { passive: true } is a performance hint to the browser — no Flutter equiv.
   */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll); // cleanup = dispose
  }, []);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-[300] bg-white transition-shadow duration-200',
          scrolled ? 'shadow-md' : 'shadow-sm',
        )}
      >
        {/* ── Main header row (logo, search, icons) ── */}
        <div
          className="border-b border-gray-100"
          style={{ height: 'var(--header-height, 74px)' }}
        >
          <div className="container h-full flex items-center gap-4">
            {/* Mobile menu toggle — FLUTTER EQUIV: IconButton opening Drawer */}
            <button
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-[6px] hover:bg-gray-100 transition-colors text-gray-700"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            {/* Logo — FLUTTER EQUIV: Image.asset + Text in a Row */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              {/*
               * IMAGE NEEDED: /public/logo.png | Size: 72x72 (36px displayed at 2x)
               * Content: Raphamel logo — medical cross or caduceus + wordmark
               */}
              <Image
                src="/logo.png"
                alt="Raphamel"
                width={50}
                height={50}
                className="object-contain"
                priority
              />
              <span className="font-bold text-xl text-gray-900 hidden sm:block">
                Raphamel
              </span>
            </Link>

            {/* Search — desktop only */}
            <div className="flex-1 max-w-xl hidden lg:block">
              <SearchBar />
            </div>

            {/* Action icons */}
            <div className="flex items-center gap-1 ml-auto lg:ml-0">
              {/* Mobile search toggle */}
              <button className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors text-gray-700">
                <Search size={20} />
              </button>

              {/* Wishlist */}
              <Link
                href="/account/wishlist"
                className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors text-gray-700"
                aria-label="Wishlist"
              >
                <Heart size={20} />
              </Link>

              {/* Account */}
              <Link
                href="/account"
                className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors text-gray-700"
                aria-label="Account"
              >
                <User size={20} />
              </Link>

              {/* Cart — FLUTTER EQUIV: Stack with positioned Badge */}
              <button
                onClick={() => setCartOpen(true)}
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors text-gray-700 relative"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  /*
                   * FLUTTER EQUIV:
                   *   Stack → Positioned(top: -2, right: -2, child: Container(...))
                   */
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Navigation bar — desktop only ── */}
        <div
          className="border-b border-gray-100 hidden lg:block"
          style={{ height: 'var(--menu-height, 56px)' }}
        >
          <div className="container h-full flex items-center gap-6">
            {/* All Categories button */}
            <Link
              href="/categories"
              className="flex items-center gap-2 px-4 h-9 bg-primary text-white text-sm font-semibold rounded-[6px] hover:bg-[#005bb5] transition-colors"
            >
              <Menu size={16} />
              All Categories
            </Link>

            {/* Nav links */}
            <nav className="flex items-center gap-5 h-full">
              {NAV_LINKS.map((item) => (
                <NavLink key={item.label} item={item} />
              ))}
            </nav>

            {/* Right actions */}
            <div className="ml-auto flex items-center gap-4 text-sm">
              <Link
                href="/vendor/dashboard"
                className="text-gray-600 hover:text-primary font-medium transition-colors hidden xl:block"
              >
                Supplier Portal
              </Link>
              <Link
                href="/login"
                className="text-gray-600 hover:text-primary font-medium transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center h-9 px-4 bg-gray-900 text-white text-sm font-semibold rounded-[6px] hover:bg-gray-700 transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Drawers — rendered outside header so they overlay the full page */}
      <CartSidebar />
      <MobileMenu />
    </>
  );
}
