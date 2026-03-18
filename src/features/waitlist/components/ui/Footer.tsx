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
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: '#0071DC' }}
            >
              <span className="font-bold text-white text-sm" style={{ fontFamily: SANS }}>R</span>
            </div>
            <span className="font-bold text-white" style={{ fontFamily: SANS }}>
              Raphamel
            </span>
          </div>

          <p
            className="text-sm"
            style={{ fontFamily: SANS, color: '#64748B' }}
          >
            &copy; {new Date().getFullYear()} Raphamel. Healthcare Commerce, Connected.
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
