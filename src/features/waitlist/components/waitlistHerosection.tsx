'use client';

import Link from 'next/link';
import './waitlistHero.css';
import { MONO, SANS } from '../fonts';


const barHeights = [40, 65, 55, 80, 70, 90, 75];

export function WaitlistHeroSection() {

  return (
    <section className="hero-root">
      <div className="grid-overlay" />
      <div className="glow-blue" />
      <div className="glow-yellow" />

      {/* NAV ROW — full width, top of hero */}
      <div className="hero-nav">
        <Link href="/" className="flex items-center rounded-full" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', padding: '6px 24px 6px 4px', gap: '2px' }}>
          <img src="/images/logo.png" alt="Raphamel" className="h-16 w-auto" />
          <span className="font-bold text-white text-3xl pl-1" style={{ fontFamily: SANS }}>Raphamel</span>
        </Link>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide" style={{ fontFamily: MONO, background: 'rgba(250,204,21,0.1)', border: '1px solid rgba(250,204,21,0.2)', color: '#FACC15' }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#FACC15' }} />
          Now Accepting Early Members
        </div>
      </div>

      <div className="hero-container">
        {/* LEFT */}
        <div className="left-col">
          <h1 className="headline">
            Africa&apos;s{' '}
            <span className="blue">B2B Medical</span>{' '}
            Marketplace is Launching Soon
          </h1>

          <p className="subheadline">
            Connect verified suppliers with healthcare facilities. Transparent pricing, reliable delivery, NAFDAC compliance built-in.
          </p>

          <button
            onClick={() => document.getElementById('early-access')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              padding: '10px 28px',
              borderRadius: '999px',
              background: '#0071DC',
              color: '#fff',
              fontFamily: SANS,
              fontSize: '14px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              width: 'fit-content',
              boxShadow: '0 4px 20px rgba(0,113,220,0.45)',
              transition: 'all 0.25s ease',
            }}
          >
            Reserve Your Early Access
          </button>

        </div>

        {/* RIGHT — Dashboard Card */}
        <div className="dashboard-col">
          <div className="card-float">
            <div className="dashboard-card">
              <div className="card-header">
                <span className="card-title">Recent Orders</span>
                <div className="nafdac-badge">
                  <div className="nafdac-dot" />
                  <span className="nafdac-text">NAFDAC Verified</span>
                </div>
              </div>

              <div className="product-row">
                <img
                  className="product-img"
                  src="/images/iv_fluid_test.jpg"
                  alt="IV Fluid"
                />
                <div className="product-info">
                  <div className="product-name">IV Fluid Set – 1000ml</div>
                  <div className="supplier-row">
                    <svg className="check-icon" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    MedSupply Nigeria
                  </div>
                  <div className="price-row">
                    <span className="price">&#8358;45,000</span>
                  </div>
                </div>
              </div>

              <div className="chart-section">
                <span className="chart-label">Order Volume (Last 7 Days)</span>
                <div className="bars">
                  {barHeights.map((h, i) => (
                    <div
                      key={i}
                      className="bar"
                      style={{ height: `${h}%`, animationDelay: `${0.6 + i * 0.08}s` }}
                    />
                  ))}
                </div>
              </div>

              <div className="stats-grid">
                {[
                  { label: 'Pending', value: '12' },
                  { label: 'In Transit', value: '8' },
                  { label: 'Delivered', value: '34' },
                ].map((s, i) => (
                  <div key={i} className="stat-cell">
                    <span className="stat-value">{s.value}</span>
                    <span className="stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
