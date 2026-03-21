'use client';

import { useState } from 'react';
import Link from 'next/link';
import './waitlistHero.css';
import { submitToSheets } from './ui/WaitlistEmailInput';
import { MONO, SANS } from '../fonts';

const avatars = [
  'https://images.unsplash.com/photo-1605369473971-c5e417ac3220?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1655720357761-f18ea9e5e7e6?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1762237798212-bcc000c00891?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1694787590597-ba49c7cdc2cc?w=80&h=80&fit=crop&crop=face',
];

const barHeights = [40, 65, 55, 80, 70, 90, 75];

interface Props {
  activeTab: 'buyer' | 'supplier';
  setActiveTab: (tab: 'buyer' | 'supplier') => void;
}

export function WaitlistHeroSection({ activeTab, setActiveTab }: Props) {
  const [email, setEmail] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

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

          <div className="toggle-wrap">
            {(['buyer', 'supplier'] as const).map((tab) => (
              <button
                key={tab}
                className={`toggle-btn${activeTab === tab ? ' active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'buyer' ? "I'm a Buyer" : "I'm a Supplier"}
              </button>
            ))}
          </div>

          {submitted ? (
            <div className="success-state">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="#22C55E" strokeWidth="1.5" />
                <path d="M6 10l3 3 5-5" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              You&apos;re on the list! We&apos;ll be in touch soon.
            </div>
          ) : (
            <div id="hero-email">
              <div className="form-row" style={{ borderColor: emailError ? 'rgba(244,63,94,0.6)' : undefined }}>
                <input
                  type="email"
                  className="email-input"
                  placeholder="Enter your work email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                />
                <button
                  className="cta-btn"
                  disabled={loading}
                  onClick={async () => {
                    if (loading) return;
                    if (!email) { setEmailError('Email is required'); return; }
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError('Please enter a valid email'); return; }
                    setEmailError('');
                    setLoading(true);
                    try { await submitToSheets(email, activeTab); } catch { /* no-cors */ }
                    setLoading(false);
                    setSubmitted(true);
                  }}
                  style={{ opacity: loading ? 0.8 : 1 }}
                >
                  {loading ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block' }}>
                      <circle cx="10" cy="10" r="8" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" />
                      <path d="M10 2a8 8 0 0 1 8 8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  ) : 'Join Waitlist'}
                </button>
              </div>
              {emailError && (
                <p style={{ color: '#f43f5e', fontSize: '12px', marginTop: '6px', fontFamily: 'DM Sans, sans-serif' }}>
                  {emailError}
                </p>
              )}
            </div>
          )}

          {!submitted && (
            <div className="avatar-row">
              <div className="avatar-stack">
                {avatars.map((src, i) => (
                  <img key={i} src={src} alt="" />
                ))}
              </div>
              <p className="avatar-text">
                <strong>1,200+</strong> already waiting
              </p>
            </div>
          )}
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
