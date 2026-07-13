'use client';

import Link from 'next/link';
import { Home, ShoppingBag, LayoutGrid, Heart, User, LogIn, UserPlus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Drawer } from './Drawer';
import { useUIStore } from '@/stores/ui.store';
import { useMe } from '@/features/auth/hooks/useAuth';
import { cn } from '@/lib/utils';

const BASE_NAV = [
  { label: 'Home',       href: '/',           icon: Home        },
  { label: 'Products',   href: '/products',   icon: ShoppingBag },
  { label: 'Categories', href: '/categories', icon: LayoutGrid  },
];

const AUTH_NAV = [
  { label: 'Wishlist', href: '/account/wishlist', icon: Heart },
  { label: 'Account',  href: '/account',          icon: User  },
];

export function MobileMenu() {
  const { menuOpen, setMenuOpen } = useUIStore();
  const { data: me } = useMe();
  const pathname = usePathname();
  const close = () => setMenuOpen(false);

  const navItems = me ? [...BASE_NAV, ...AUTH_NAV] : BASE_NAV;

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
          {navItems.map(({ label, href, icon: Icon }) => (
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
        </ul>

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
