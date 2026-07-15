'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, ShoppingBag, MapPin, Settings, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const TABS = [
  { label: 'Profile',   href: '/account',           icon: User        },
  { label: 'Orders',    href: '/account/orders',     icon: ShoppingBag },
  { label: 'Wishlist',  href: '/account/wishlist',   icon: Heart       },
  { label: 'Addresses', href: '/account/addresses',  icon: MapPin      },
  { label: 'Settings',  href: '/account/settings',   icon: Settings    },
];

export function MobileAccountTabs() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden mb-4 -mx-4 px-4">
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
        {TABS.map(({ label, href, icon: Icon }) => {
          const active = href === '/account' ? pathname === '/account' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all border',
                active
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-primary/40 hover:text-primary',
              )}
            >
              <Icon size={13} className="shrink-0" />
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
