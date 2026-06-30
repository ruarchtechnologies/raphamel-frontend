import Link from 'next/link';
import { MONO, SANS } from '../../fonts';

export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="flex items-center justify-between" style={{ padding: '1.5rem' }}>
        <Link
          href="/"
          className="flex items-center gap-0.5 px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)' }}
        >
          <img src="/images/logo.png" alt="Raphamel" className="h-10 w-auto" />
          <span className="font-bold text-white text-xl pl-1 pr-1" style={{ fontFamily: SANS }}>
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
