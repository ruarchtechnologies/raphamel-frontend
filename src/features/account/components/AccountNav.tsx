'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  User, ShoppingBag, MapPin, Settings, LogOut, ChevronRight, Heart,
} from 'lucide-react';
import { useMe, useLogout } from '@/features/auth/hooks/useAuth';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'My Profile',  href: '/account',           icon: User },
  { label: 'My Orders',   href: '/account/orders',     icon: ShoppingBag },
  { label: 'Wishlist',    href: '/account/wishlist',   icon: Heart },
  { label: 'Addresses',   href: '/account/addresses',  icon: MapPin },
  { label: 'Settings',    href: '/account/settings',   icon: Settings },
] as const;

/**
 * Reusable sidebar / tab nav for all /account/* pages.
 * Place inside the account layout — never inside individual pages.
 */
export function AccountNav() {
  const pathname = usePathname();
  const router   = useRouter();
  const { data: me } = useMe();
  const { mutate: signOut, isPending } = useLogout();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const initials = me
    ? `${me.firstName.charAt(0)}${me.lastName.charAt(0)}`.toUpperCase()
    : '?';

  function handleLogout() {
    signOut(undefined, {
      onSuccess: () => router.push('/login'),
    });
  }

  return (
    <nav className="flex flex-col gap-1">
      {/* User identity card — only after hydration to avoid SSR mismatch */}
      {mounted && me && (
        <div className="flex items-center gap-3 p-4 mb-2 bg-gray-50 rounded-[6px] border border-gray-100">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 bg-primary/10"
            style={{ color: 'var(--color-primary)' }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {me.firstName} {me.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">{me.email}</p>
          </div>
        </div>
      )}

      {/* Navigation links */}
      {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
        // Exact match for /account, prefix match for sub-pages
        const isActive =
          href === '/account' ? pathname === '/account' : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-4 py-2.5 rounded-[6px] text-sm font-medium transition-colors group',
              isActive
                ? 'bg-primary/8 text-primary'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            )}
          >
            <Icon
              size={16}
              className={cn(
                'shrink-0 transition-colors',
                isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600',
              )}
            />
            <span className="flex-1">{label}</span>
            {isActive && <ChevronRight size={14} className="text-primary/60" />}
          </Link>
        );
      })}

      {/* Logout */}
      <button
        onClick={handleLogout}
        disabled={isPending}
        className="flex items-center gap-3 px-4 py-2.5 rounded-[6px] text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50 mt-2 border-t border-gray-100 pt-4"
      >
        <LogOut size={16} className="shrink-0" />
        {isPending ? 'Signing out…' : 'Sign out'}
      </button>
    </nav>
  );
}
