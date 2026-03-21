import { SANS, MONO } from '../../fonts';

export function TrustBar() {
  return (
    <section style={{ background: '#FAFAF8' }} className="py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
          <div
            className="text-sm font-semibold uppercase tracking-wide"
            style={{ fontFamily: SANS, color: '#334155' }}
          >
            Built For:
          </div>

          {['Hospitals', 'Clinics', 'Pharmacies', 'Labs', 'NGOs'].map((item) => (
            <div
              key={item}
              className="text-sm font-medium"
              style={{ fontFamily: SANS, color: '#334155' }}
            >
              {item}
            </div>
          ))}

          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ background: 'rgba(34,197,94,0.12)' }}
          >
            <div className="w-2 h-2 rounded-full" style={{ background: '#22C55E' }} />
            <span
              className="text-[10px] font-semibold uppercase tracking-wide"
              style={{ fontFamily: MONO, color: '#22C55E' }}
            >
              NAFDAC Compliant
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
