'use client';

import Link from 'next/link';
import {
  Home, ShoppingBag, LayoutGrid, User, LogIn, UserPlus,
  LogOut, ChevronDown, MapPin, Settings, Heart,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Drawer } from './Drawer';
import { useUIStore } from '@/stores/ui.store';
import { useMe, useLogout } from '@/features/auth/hooks/useAuth';
import { cn } from '@/lib/utils';

const BASE_NAV = [
  { label: 'Home',       href: '/',           icon: Home        },
  { label: 'Products',   href: '/products',   icon: ShoppingBag },
  { label: 'Categories', href: '/categories', icon: LayoutGrid  },
];

const ACCOUNT_SUB = [
  { label: 'My Profile',  href: '/account',            icon: User     },
  { label: 'My Orders',   href: '/account/orders',      icon: ShoppingBag },
  { label: 'Wishlist',    href: '/account/wishlist',    icon: Heart    },
  { label: 'Addresses',   href: '/account/addresses',   icon: MapPin   },
  { label: 'Settings',    href: '/account/settings',    icon: Settings },
];

export function MobileMenu() {
  const { menuOpen, setMenuOpen } = useUIStore();
  const { data: me } = useMe();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const pathname = usePathname();
  const router = useRouter();
  const close = () => setMenuOpen(false);

  const isInAccount = pathname.startsWith('/account');
  const [accountOpen, setAccountOpen] = useState(isInAccount);

  function handleSignOut() {
    logout(undefined, {
      onSuccess: () => {
        close();
        router.push('/');
      },
    });
  }

  const signOutFooter = me ? (
    <div className="border-t border-gray-100 px-4 py-3">
      <button
        onClick={handleSignOut}
        disabled={isLoggingOut}
        className="flex items-center gap-3 w-full py-2.5 px-3 rounded-[6px] text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
      >
        <LogOut size={16} className="flex-shrink-0" />
        {isLoggingOut ? 'Signing out…' : 'Sign Out'}
      </button>
    </div>
  ) : undefined;

  return (
    <Drawer
      open={menuOpen}
      onClose={() => setMenuOpen(false)}
      side="left"
      title="Menu"
      width="300px"
      footer={signOutFooter}
    >
      <nav className="px-4 py-3">
        <ul className="space-y-0.5">
          {/* Base nav items */}
          {BASE_NAV.map(({ label, href, icon: Icon }) => (
            <li key={label}>
              <Link
                href={href}
                onClick={close}
                className={cn(
                  'flex items-center gap-3 py-2.5 px-3 rounded-[6px] text-[0.9375rem] font-semibold transition-colors',
                  pathname === href
                    ? 'text-primary bg-primary/5'
                    : 'text-gray-800 hover:text-primary hover:bg-gray-50',
                )}
              >
                <Icon size={18} className="flex-shrink-0" />
                {label}
              </Link>
            </li>
          ))}

          {/* Account accordion — only when logged in */}
          {me && (
            <li>
              <button
                onClick={() => setAccountOpen((o) => !o)}
                className={cn(
                  'w-full flex items-center gap-3 py-2.5 px-3 rounded-[6px] text-[0.9375rem] font-semibold transition-colors',
                  isInAccount
                    ? 'text-primary bg-primary/5'
                    : 'text-gray-800 hover:text-primary hover:bg-gray-50',
                )}
              >
                <User size={18} className="flex-shrink-0" />
                <span className="flex-1 text-left">Account</span>
                <ChevronDown
                  size={15}
                  className={cn(
                    'flex-shrink-0 transition-transform duration-200',
                    accountOpen && 'rotate-180',
                  )}
                />
              </button>

              <AnimatePresence initial={false}>
                {accountOpen && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="ml-[30px] mt-0.5 space-y-0.5 pb-1">
                      {ACCOUNT_SUB.map(({ label, href, icon: Icon }) => {
                        const active =
                          href === '/account'
                            ? pathname === '/account'
                            : pathname.startsWith(href);
                        return (
                          <li key={href}>
                            <Link
                              href={href}
                              onClick={close}
                              className={cn(
                                'flex items-center gap-2.5 py-2 px-3 rounded-[6px] text-sm font-medium transition-colors',
                                active
                                  ? 'text-primary bg-primary/5'
                                  : 'text-gray-600 hover:text-primary hover:bg-gray-50',
                              )}
                            >
                              <Icon size={15} className="flex-shrink-0" />
                              {label}
                            </Link>
                          </li>
                        );
                      })}
                    </div>
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
          )}
        </ul>

        {/* Guest auth links */}
        {!me && (
          <div className="border-t border-gray-100 mt-4 pt-4 space-y-0.5">
            <Link
              href={`/login?returnTo=${encodeURIComponent(pathname)}`}
              onClick={close}
              className="flex items-center gap-3 py-2.5 px-3 rounded-[6px] text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors"
            >
              <LogIn size={16} className="flex-shrink-0" />
              Sign In
            </Link>
            <Link
              href="/register"
              onClick={close}
              className="flex items-center gap-3 py-2.5 px-3 rounded-[6px] text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors"
            >
              <UserPlus size={16} className="flex-shrink-0" />
              Register
            </Link>
          </div>
        )}
      </nav>
    </Drawer>
  );
}
