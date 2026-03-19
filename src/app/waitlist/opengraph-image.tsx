import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = "Raphamel — Africa's B2B Medical Marketplace";
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #060E1C 0%, #0A1628 50%, #0E2444 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Grid overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.07,
            backgroundImage:
              'linear-gradient(to right, #0071DC 1px, transparent 1px), linear-gradient(to bottom, #0071DC 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Blue glow */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            left: '-100px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'rgba(0,113,220,0.25)',
            filter: 'blur(120px)',
          }}
        />

        {/* Logo + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://raphamel.pages.dev/images/logo.png"
            width={64}
            height={64}
            alt=""
            style={{ objectFit: 'contain' }}
          />
          <span style={{ color: '#fff', fontSize: '36px', fontWeight: 700 }}>Raphamel</span>
        </div>

        {/* Headline */}
        <div
          style={{
            color: '#fff',
            fontSize: '52px',
            fontWeight: 900,
            textAlign: 'center',
            lineHeight: 1.1,
            maxWidth: '900px',
            marginBottom: '20px',
          }}
        >
          Africa&apos;s{' '}
          <span style={{ color: '#0071DC' }}>B2B Medical</span>{' '}
          Marketplace is Launching Soon
        </div>

        {/* Subtext */}
        <div style={{ color: '#94A3B8', fontSize: '22px', textAlign: 'center', maxWidth: '700px', marginBottom: '40px' }}>
          Join 1,200+ healthcare providers on the waitlist
        </div>

        {/* Badge */}
        <div
          style={{
            background: '#FACC15',
            color: '#0F172A',
            padding: '10px 28px',
            borderRadius: '999px',
            fontSize: '14px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Early Access Opening Soon
        </div>
      </div>
    ),
    { ...size },
  );
}
