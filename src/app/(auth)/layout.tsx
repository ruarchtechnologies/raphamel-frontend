import Link from 'next/link';
import { Store } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Simple header */}
      <header className="bg-white border-b border-gray-100 h-16 flex items-center">
        <div className="container">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-[6px] flex items-center justify-center">
              <Store size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">Raphamel</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 py-10">
        {children}
      </main>

      <footer className="text-center py-4 text-xs text-gray-400">
        © {new Date().getFullYear()} Raphamel Marketplace ·{' '}
        <Link href="/privacy" className="hover:text-gray-700">Privacy</Link> ·{' '}
        <Link href="/terms" className="hover:text-gray-700">Terms</Link>
      </footer>
    </div>
  );
}
