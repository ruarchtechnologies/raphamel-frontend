'use client';

import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User, ShoppingBag, MapPin, LogOut, ChevronDown, Settings,
} from 'lucide-react';
import { useMe, useLogout } from '@/features/auth/hooks/useAuth';
import { cn } from '@/lib/utils';

const MENU_ITEMS = [
  { label: 'My Profile',  href: '/account',           icon: User },
  { label: 'My Orders',   href: '/account/orders',     icon: ShoppingBag },
  { label: 'Addresses',   href: '/account/addresses',  icon: MapPin },
  { label: 'Settings',    href: '/account/settings',   icon: Settings },
] as const;

/** Dropdown in the Header shown when the user is logged in. */
export function UserMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router   = useRouter();

  const { data: me } = useMe();
  const { mutate: signOut, isPending } = useLogout();

  // Close on outside click
  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onOutsideClick);
    return () => document.removeEventListener('mousedown', onOutsideClick);
  }, []);

  if (!me) return null;

  const initials =
    `${me.firstName.charAt(0)}${me.lastName.charAt(0)}`.toUpperCase() || '?';

  function handleLogout() {
    signOut(undefined, {
      onSuccess: () => router.push('/login'),
    });
    setOpen(false);
  }

  return (
    <div ref={menuRef} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-primary/10"
          style={{ color: 'var(--color-primary)' }}
        >
          {initials}
        </div>
        <span className="hidden xl:block">{me.firstName}</span>
        <ChevronDown
          size={14}
          className={cn('transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-[8px] shadow-xl border border-gray-100 z-50 animate-slide-down overflow-hidden">
          {/* User summary */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {me.firstName} {me.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">{me.email}</p>
          </div>

          {/* Nav items */}
          <nav className="py-1">
            {MENU_ITEMS.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
              >
                <Icon size={15} className="shrink-0" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="border-t border-gray-100 py-1">
            <button
              onClick={handleLogout}
              disabled={isPending}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
            >
              <LogOut size={15} className="shrink-0" />
              {isPending ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
