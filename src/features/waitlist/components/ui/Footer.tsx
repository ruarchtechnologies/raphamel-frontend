'use client';

import { useState } from 'react';
import { SANS } from '../../fonts';
import { LegalModal } from './LegalModal';

export function Footer() {
  const [openModal, setOpenModal] = useState<'privacy' | 'terms' | null>(null);

  return (
    <>
      <LegalModal type={openModal} onClose={() => setOpenModal(null)} />

      <footer
        className="py-8"
        style={{ background: '#060E1C', borderTop: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div style={{ paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
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
              <button
                onClick={() => setOpenModal('privacy')}
                className="text-sm transition-colors hover:text-white"
                style={{ fontFamily: SANS, color: '#64748B', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setOpenModal('terms')}
                className="text-sm transition-colors hover:text-white"
                style={{ fontFamily: SANS, color: '#64748B', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Terms of Service
              </button>
              <a
                href="mailto:support@raphamel.com"
                className="text-sm transition-colors hover:text-white"
                style={{ fontFamily: SANS, color: '#64748B' }}
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
