/**
 * FLUTTER EQUIV: A StatelessWidget rendered at the bottom of the app.
 *
 * In Flutter this would be a widget inside a Column at the bottom of
 * SingleChildScrollView. In Next.js, it's placed inside the (shop) layout
 * after {children} so it appears on every shop page automatically.
 *
 * 'use client' is NOT needed here — this is a Server Component.
 * Server Components render on the server: faster initial load, no JS bundle.
 * FLUTTER ANALOGY: Like a const widget (no setState anywhere).
 */

import Link from 'next/link';
import Image from "next/image";
import {
  Store, Facebook, Instagram, Twitter, Youtube,
  Mail, Phone, MapPin, ChevronRight, Shield, Truck, RefreshCcw, Headphones,
} from 'lucide-react';
import { NewsletterForm } from './NewsletterForm';

const LINKS = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
    { label: 'Accreditations', href: '/accreditations' },
  ],
  buyer: [
    { label: 'My Account', href: '/account' },
    { label: 'My Orders', href: '/account/orders' },
    { label: 'Wishlist', href: '/account/wishlist' },
    { label: 'Returns & Claims', href: '/returns' },
    { label: 'Track Order', href: '/track' },
  ],
  supplier: [
    { label: 'Sell on Raphamel', href: '/vendor/register' },
    { label: 'Supplier Dashboard', href: '/vendor/dashboard' },
    { label: 'Supplier Policies', href: '/vendor-policies' },
    { label: 'Business Verification', href: '/vendor/verification' },
    { label: 'Help Centre', href: '/help' },
  ],
  categories: [
    { label: 'Hospital Consumables', href: '/categories/hospital-consumables' },
    { label: 'Surgical Equipment', href: '/categories/surgical-equipment' },
    { label: 'Diagnostic Devices', href: '/categories/diagnostic-devices' },
    { label: 'PPE', href: '/categories/personal-protective-equipment' },
    { label: 'Lab Supplies', href: '/categories/laboratory-supplies' },
    { label: 'Rehabilitation', href: '/categories/rehabilitation-equipment' },
    { label: 'Topicals', href: '/categories/topicals' },
  ],
};

const FEATURES = [
  { icon: Truck, title: 'Nationwide Delivery', desc: 'Cold-chain logistics available' },
  { icon: Shield, title: 'Verified Suppliers', desc: 'NAFDAC-registered vendors only' },
  { icon: RefreshCcw, title: 'Easy Returns', desc: '14-day return policy' },
  { icon: Headphones, title: '24/7 Support', desc: 'Dedicated procurement support' },
];

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      {/* Trust strip */}
      <div className="border-b border-gray-800">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-800">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4 py-6 px-6 first:pl-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="container py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">

              <Image
                src="/logo.png"
                alt="Raphamel"
                width={50}
                height={50}
                className="object-contain"
                priority
              />
              {/* <div className="w-9 h-9 bg-primary rounded-[6px] flex items-center justify-center">
                <Store size={20} className="text-white" />
              </div> */}

              <span className="text-white font-bold text-xl">Raphamel</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-5 max-w-xs">
              Nigeria&apos;s B2B healthcare marketplace — connecting verified medical
              suppliers with hospitals, clinics, pharmacies and healthcare institutions.
            </p>

            {/* Social icons */}
            <div className="flex gap-3">
              {[
                { href: '#', icon: Facebook, label: 'Facebook' },
                { href: '#', icon: Instagram, label: 'Instagram' },
                { href: '#', icon: Twitter, label: 'Twitter/X' },
                { href: '#', icon: Youtube, label: 'YouTube' },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>

            {/* Contact */}
            <div className="mt-6 space-y-2 text-sm text-gray-400">
              <a
                href="tel:+2348012345678"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone size={14} className="text-primary" /> +234 801 234 5678
              </a>
              <a
                href="mailto:hello@raphamel.health"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail size={14} className="text-primary" /> hello@raphamel.health
              </a>
              <p className="flex items-start gap-2">
                <MapPin size={14} className="text-primary mt-0.5 flex-shrink-0" />
                Lagos, Nigeria
              </p>
            </div>
          </div>

          {/* Link columns — FLUTTER EQUIV: Column of ListTile widgets */}
          {[
            { title: 'Company', links: LINKS.company },
            { title: 'Buyers', links: LINKS.buyer },
            { title: 'Suppliers', links: LINKS.supplier },
            { title: 'Categories', links: LINKS.categories },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1 group"
                    >
                      <ChevronRight
                        size={12}
                        className="opacity-0 group-hover:opacity-100 -ml-3 group-hover:ml-0 transition-all"
                      />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h4 className="text-white font-semibold text-lg mb-1">
                Healthcare Supply Updates
              </h4>
              <p className="text-sm text-gray-400">
                New products, supplier approvals and procurement news in your inbox.
              </p>
            </div>
            {/* Client Component — Server Components cannot own event handlers */}
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 py-5">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Raphamel Marketplace. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-gray-300 transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
