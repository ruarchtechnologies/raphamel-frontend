import type { Metadata } from 'next';
import { AccountNav } from '@/features/account/components/AccountNav';

export const metadata: Metadata = {
  title: 'My Account — Raphamel',
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="section bg-gray-50 min-h-screen">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 items-start">
          {/* Sidebar — sticky on desktop */}
          <aside className="lg:sticky lg:top-[calc(var(--header-height,74px)+var(--menu-height,56px)+1.5rem)]">
            <div className="bg-white rounded-[6px] border border-gray-200 p-4 shadow-sm">
              <AccountNav />
            </div>
          </aside>

          {/* Page content */}
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </section>
  );
}
