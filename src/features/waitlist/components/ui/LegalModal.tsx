'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SANS } from '../../fonts';

// ── Types ─────────────────────────────────────────────────────────────────────

type Section = { title: string; content: string | string[] };

interface Props {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

// ── Content ───────────────────────────────────────────────────────────────────

const PRIVACY_SECTIONS: Section[] = [
  {
    title: 'Introduction',
    content:
      'Raphamel Healthcare ("Raphamel," "we," "our," or "us") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you join our waitlist or use our platform. This Policy complies with the Nigeria Data Protection Regulation (NDPR) 2019 and the Nigeria Data Protection Act 2023.',
  },
  {
    title: 'Information We Collect',
    content: [
      'Full name and contact details (email address, phone number)',
      'Professional information (facility name, facility type, job role)',
      'Business details (state of operation, estimated monthly procurement spend)',
      'Product category preferences',
      'Technical data (IP address, browser type, device information, usage data)',
      'Communications you send us',
    ],
  },
  {
    title: 'How We Use Your Information',
    content: [
      'To manage your waitlist registration and notify you of our launch',
      'To personalise your early access experience based on your facility type',
      'To communicate product updates, pricing, and relevant offers',
      'To analyse platform usage and improve our services',
      'To comply with applicable laws and regulatory requirements',
      'To prevent fraud and ensure platform security',
    ],
  },
  {
    title: 'Legal Basis for Processing (NDPR)',
    content:
      'We process your personal data on the following lawful bases: (a) Consent — by submitting the waitlist form, you expressly consent to the processing of your data as described in this Policy; (b) Legitimate Interests — for analytics, security, and platform improvement; (c) Legal Obligation — where processing is required to comply with applicable Nigerian laws and regulations. You may withdraw your consent at any time by contacting us at privacy@raphamel.ng.',
  },
  {
    title: 'Data Sharing and Disclosure',
    content:
      'We do not sell, rent, or trade your personal data. We may share your data with: (a) Service providers who assist in operating our platform (e.g., cloud hosting, email delivery), bound by confidentiality obligations; (b) Regulatory authorities or law enforcement where required by Nigerian law; (c) Professional advisors (lawyers, accountants) under strict confidentiality. All third parties are required to handle your data in accordance with the NDPR.',
  },
  {
    title: 'Data Retention',
    content:
      'We retain your personal data for as long as necessary to fulfil the purposes outlined in this Policy, or as required by law. Waitlist data will be retained until you request deletion or for a maximum of three (3) years from collection, whichever is earlier. You may request deletion at any time.',
  },
  {
    title: 'Your Rights Under the NDPR',
    content: [
      'Right to access a copy of your personal data',
      'Right to rectify inaccurate or incomplete data',
      'Right to erasure ("right to be forgotten")',
      'Right to restrict or object to processing',
      'Right to data portability',
      'Right to withdraw consent at any time',
    ],
  },
  {
    title: 'Data Security',
    content:
      'We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction. These include encryption in transit (TLS), access controls, and regular security assessments. However, no method of transmission over the internet is 100% secure.',
  },
  {
    title: 'Cookies and Tracking',
    content:
      'Our waitlist page may use essential cookies to ensure proper functionality. We do not use third-party advertising cookies. You may disable cookies in your browser settings, though this may affect certain features of the platform.',
  },
  {
    title: 'Changes to This Policy',
    content:
      'We may update this Privacy Policy from time to time. We will notify you of material changes by email or by posting a notice on our platform. Continued use of our services after changes constitutes acceptance of the updated Policy.',
  },
  {
    title: 'Contact Us',
    content:
      'If you have any questions about this Privacy Policy or wish to exercise your rights, please contact our Data Protection Officer at: privacy@raphamel.ng | Raphamel Healthcare, Lagos, Nigeria.',
  },
];

const TERMS_SECTIONS: Section[] = [
  {
    title: 'Acceptance of Terms',
    content:
      'By accessing our website or joining the Raphamel waitlist, you agree to be bound by these Terms of Service ("Terms"). If you do not agree, please do not use our services. These Terms constitute a legally binding agreement between you and Raphamel Healthcare ("Raphamel," "we," "us," "our"), a company registered in Nigeria.',
  },
  {
    title: 'Description of Service',
    content:
      'Raphamel is a B2B medical supplies company that sources, stocks, and sells NAFDAC-compliant medical products directly to healthcare facilities across Nigeria. Raphamel acts solely as the supplier; we do not operate as a marketplace or intermediary between third-party suppliers and buyers. Our services include a product catalogue, order placement, invoicing, and delivery coordination to hospitals, clinics, pharmacies, and laboratories. The platform is currently in pre-launch; these Terms govern your participation in our waitlist programme and, upon launch, your use of the full platform.',
  },
  {
    title: 'Eligibility',
    content: [
      'You must be at least 18 years of age',
      'You must represent a legitimate healthcare facility, pharmacy, laboratory, or related organisation registered in Nigeria',
      'You must have the authority to bind your organisation to these Terms',
      'You must provide accurate, complete, and current information during registration',
    ],
  },
  {
    title: 'Waitlist Programme',
    content:
      'Joining our waitlist does not guarantee access to the platform or any specific pricing. Raphamel reserves the right to grant or deny early access at its sole discretion. We will use the information you provide to tailor your onboarding experience. Waitlist positions are non-transferable.',
  },
  {
    title: 'User Obligations',
    content: [
      'Provide truthful, accurate, and up-to-date information at all times',
      'Maintain the confidentiality of any account credentials',
      'Use the platform solely for lawful procurement purposes',
      'Comply with all applicable Nigerian laws, including NAFDAC regulations and the Counterfeit and Fake Drugs Miscellaneous Provisions Act',
      'Not attempt to reverse-engineer, scrape, or misuse the platform',
    ],
  },
  {
    title: 'Intellectual Property',
    content:
      'All content on the Raphamel platform — including logos, trademarks, software, product listings, and design elements — is the exclusive property of Raphamel Healthcare or its licensors. You are granted a limited, non-exclusive, non-transferable licence to access and use the platform for your internal procurement purposes. No rights are granted beyond what is expressly stated herein.',
  },
  {
    title: 'Disclaimer of Warranties',
    content:
      'The Raphamel platform and waitlist service are provided on an "as is" and "as available" basis without warranties of any kind, express or implied. We do not warrant that the platform will be error-free, uninterrupted, or free from harmful components. Product listings are provided for information purposes; Raphamel does not guarantee the accuracy of third-party supplier information.',
  },
  {
    title: 'Limitation of Liability',
    content:
      'To the maximum extent permitted by Nigerian law, Raphamel shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities, arising from your use of or inability to use the platform. Our aggregate liability for any claim shall not exceed the total amount paid by you to Raphamel in the twelve (12) months preceding the claim.',
  },
  {
    title: 'Indemnification',
    content:
      'You agree to indemnify, defend, and hold harmless Raphamel, its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses (including reasonable legal fees) arising from your use of the platform, your violation of these Terms, or your infringement of any third-party rights.',
  },
  {
    title: 'Governing Law and Dispute Resolution',
    content:
      'These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any dispute arising from or related to these Terms shall first be subject to good-faith negotiation. If unresolved within 30 days, disputes shall be submitted to arbitration in Lagos, Nigeria, in accordance with the Arbitration and Conciliation Act (as amended).',
  },
  {
    title: 'Changes to These Terms',
    content:
      'We reserve the right to modify these Terms at any time. We will provide notice of material changes via email or platform notification. Your continued use of the platform after the effective date of revised Terms constitutes your acceptance of the changes.',
  },
  {
    title: 'Contact Us',
    content:
      'For questions about these Terms, please contact us at: raphamel.tech@gmail.com | Raphamel Healthcare, Lagos, Nigeria.',
  },
];

// ── Section renderer ──────────────────────────────────────────────────────────

function DocSection({ section, index }: { section: Section; index: number }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <h3 style={{
        fontFamily: SANS,
        fontSize: '18px',
        fontWeight: 700,
        color: '#fff',
        margin: '0 0 12px 0',
      }}>
        {index + 1}. {section.title}
      </h3>
      {Array.isArray(section.content) ? (
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', borderLeft: '2px solid rgba(255,255,255,0.1)', paddingLeft: '16px' }}>
          {section.content.map((item, i) => (
            <li key={i} style={{
              fontFamily: SANS,
              fontSize: '16px',
              color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.85,
              marginBottom: '8px',
            }}>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{
          fontFamily: SANS,
          fontSize: '16px',
          color: 'rgba(255,255,255,0.65)',
          lineHeight: 1.85,
          margin: 0,
        }}>
          {section.content}
        </p>
      )}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────

export function LegalModal({ type, onClose }: Props) {
  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? 'Privacy Policy' : 'Terms of Service';
  const sections = isPrivacy ? PRIVACY_SECTIONS : TERMS_SECTIONS;

  // Close on Escape key
  useEffect(() => {
    if (!type) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [type, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (type) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [type]);

  return (
    <AnimatePresence>
      {type && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000 }}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1001,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px 16px',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                pointerEvents: 'auto',
                width: '100%',
                maxWidth: '700px',
                maxHeight: '88vh',
                display: 'flex',
                flexDirection: 'column',
                background: '#0a1628',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
              }}
            >
              {/* Header */}
              <div style={{
                padding: '20px 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0,
                background: '#0e2444',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <img src="/images/logo.png" alt="Raphamel" style={{ height: '24px', width: 'auto' }} />
                    <span style={{ fontFamily: SANS, fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>Raphamel</span>
                  </div>
                  <h2 style={{ fontFamily: SANS, fontSize: '24px', fontWeight: 700, color: '#fff', margin: '6px 0 2px' }}>
                    {title}
                  </h2>
                  <p style={{ fontFamily: SANS, fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                    Last updated: January 1, 2026
                  </p>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* Scrollable content */}
              <div style={{ overflowY: 'auto', padding: '32px 28px 40px', flex: 1 }}>
                {sections.map((section, i) => (
                  <DocSection key={i} section={section} index={i} />
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
