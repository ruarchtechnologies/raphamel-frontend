import { SANS } from '../../fonts';

export function Footer() {
  return (
    <footer
      className="py-8"
      style={{ background: '#060E1C', borderTop: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-0.5">
            <img src="/images/logo.png" alt="Raphamel" className="h-14 w-auto" />
            <span className="font-bold text-white" style={{ fontFamily: SANS }}>
              Raphamel
            </span>
          </div>

          <p
            className="text-sm"
            style={{ fontFamily: SANS, color: '#64748B' }}
          >
            &copy; {new Date().getFullYear()} Raphamel Healthcare Marketplace
          </p>

          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Contact'].map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm transition-colors hover:text-white"
                style={{ fontFamily: SANS, color: '#64748B' }}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
