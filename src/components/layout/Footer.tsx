import Link from 'next/link';
import Image from 'next/image';
import { Linkedin, Mail, Phone, MapPin } from 'lucide-react';

function XIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const COMPANY_LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms & Conditions', href: '/terms' },
];

const CATEGORY_LINKS = [
  { label: 'Hospital Consumables', href: '/categories/hospital-consumables' },
  { label: 'Surgical Equipment', href: '/categories/surgical-equipment' },
  { label: 'Diagnostic Devices', href: '/categories/diagnostic-devices' },
  { label: 'PPE', href: '/categories/personal-protective-equipment' },
  { label: 'Lab Supplies', href: '/categories/laboratory-supplies' },
  { label: 'Rehabilitation', href: '/categories/rehabilitation-equipment' },
];

const SOCIAL_LINKS = [
  { href: 'https://x.com/raphamelhealth', icon: XIcon, label: 'X' },
  { href: 'https://linkedin.com/company/raphamelhealth', icon: Linkedin, label: 'LinkedIn' },
];

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="container py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src="/images/logo.png" alt="Raphamel" width={36} height={36} className="object-contain" priority />
              <span className="text-white font-bold text-lg">Raphamel</span>
            </Link>
            <p className="text-sm leading-relaxed">
              Nigeria&apos;s B2B healthcare company supplying NAFDAC-compliant medical
              products directly to hospitals, clinics, pharmacies and healthcare institutions.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Categories</h4>
            <ul className="space-y-3">
              {CATEGORY_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-3">
              {COMPANY_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Social */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Contact</h4>
            <div className="space-y-3 text-sm mb-6">
              <a href="tel:+2348169087630" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone size={13} /> +234 816 908 7630
              </a>
              <a href="mailto:info@raphamel.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail size={13} /> info@raphamel.com
              </a>
              <p className="flex items-center gap-2">
                <MapPin size={13} /> Lagos, Nigeria
              </p>
            </div>
            <div className="flex gap-2">
              {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      <div className="border-t border-gray-800 py-5">
        <div className="container text-xs text-gray-600">
          <p>&copy; {new Date().getFullYear()} Raphamel Marketplace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
