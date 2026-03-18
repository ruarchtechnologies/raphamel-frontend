import Link from 'next/link';
import { SANS, MONO } from '../../fonts';

export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: '#0071DC' }}
          >
            <span className="font-bold text-white text-xl" style={{ fontFamily: SANS }}>R</span>
          </div>
          <span className="font-bold text-white text-xl" style={{ fontFamily: SANS }}>
            Raphamel
          </span>
        </Link>

        <div
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide"
          style={{ fontFamily: MONO, background: 'rgba(250,204,21,0.1)', border: '1px solid rgba(250,204,21,0.2)', color: '#FACC15' }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#FACC15' }} />
          Now Accepting Early Members
        </div>
      </div>
    </nav>
  );
}
