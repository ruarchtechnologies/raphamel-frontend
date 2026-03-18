/**
 * FLUTTER EQUIV: StatelessWidget rendering a ListView of vendor cards.
 *
 * No internal state here — pure display. 'use client' is only needed for
 * framer-motion animations. Without animation this would be a Server Component.
 *
 * In production: replace MOCK_VENDORS with useFeaturedVendors() from
 * src/features/vendors/hooks/useVendors.ts
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRight, BadgeCheck, Star } from 'lucide-react';

// ── Mock healthcare supplier data ─────────────────────────────────────────────
//
// IMAGE NEEDED per vendor logo — 100x100 PNG or SVG on white background
// Filename convention: vendor-logo-{slug}.png

const MOCK_VENDORS = [
  {
    id: '1',
    name: 'MediSupply Nigeria',
    slug: 'medisupply-nigeria',
    // IMAGE NEEDED: vendor-logo-medisupply-nigeria.png | Size: 100x100
    // Content: Professional medical cross logo, blue & white
    logo: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop',
    products: 842,
    rating: 4.8,
    category: 'Hospital Consumables',
    verified: true,
  },
  {
    id: '2',
    name: 'SurgiTech Africa',
    slug: 'surgitech-africa',
    // IMAGE NEEDED: vendor-logo-surgitech-africa.png | Size: 100x100
    // Content: Scalpel/surgical icon, professional dark green
    logo: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=100&h=100&fit=crop',
    products: 316,
    rating: 4.7,
    category: 'Surgical Equipment',
    verified: true,
  },
  {
    id: '3',
    name: 'DiagnosPro NG',
    slug: 'diagnospro-ng',
    // IMAGE NEEDED: vendor-logo-diagnospro-ng.png | Size: 100x100
    // Content: Stethoscope icon, professional purple/violet
    logo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop',
    products: 428,
    rating: 4.9,
    category: 'Diagnostic Devices',
    verified: true,
  },
  {
    id: '4',
    name: 'SafeGuard PPE',
    slug: 'safeguard-ppe',
    // IMAGE NEEDED: vendor-logo-safeguard-ppe.png | Size: 100x100
    // Content: Shield icon with mask, yellow/black
    logo: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=100&h=100&fit=crop',
    products: 195,
    rating: 4.5,
    category: 'PPE',
    verified: true,
  },
  {
    id: '5',
    name: 'RehabCare Solutions',
    slug: 'rehabcare-solutions',
    // IMAGE NEEDED: vendor-logo-rehabcare-solutions.png | Size: 100x100
    // Content: Person with mobility aid icon, green
    logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
    products: 143,
    rating: 4.6,
    category: 'Rehabilitation',
    verified: false,
  },
  {
    id: '6',
    name: 'LabEquip Nigeria',
    slug: 'labequip-nigeria',
    // IMAGE NEEDED: vendor-logo-labequip-nigeria.png | Size: 100x100
    // Content: Test tube / flask icon, indigo/blue
    logo: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=100&h=100&fit=crop',
    products: 287,
    rating: 4.4,
    category: 'Laboratory Supplies',
    verified: true,
  },
];

export function VendorSection() {
  return (
    <section className="section">
      <div className="container">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
              Marketplace
            </p>
            <h2 className="section-title mb-0">Top Medical Suppliers</h2>
          </div>
          <Link
            href="/vendors"
            className="flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all"
          >
            All Suppliers <ChevronRight size={16} />
          </Link>
        </div>

        {/* Vendor grid — 3 columns on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_VENDORS.map((vendor, i) => (
            <motion.div
              key={vendor.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
            >
              <Link
                href={`/vendors/${vendor.slug}`}
                className="flex items-center gap-4 p-4 bg-slate-50 rounded-[10px] hover:bg-slate-100 hover:shadow-md transition-all group"
              >
                {/* Logo — FLUTTER EQUIV: CircleAvatar with CachedNetworkImage */}
                <div className="relative w-14 h-14 rounded-full overflow-hidden bg-white shadow-sm flex-shrink-0">
                  <Image
                    src={vendor.logo}
                    alt={vendor.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="56px"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">
                      {vendor.name}
                    </h3>
                    {vendor.verified && (
                      <BadgeCheck size={15} className="text-primary flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {vendor.category} &middot; {vendor.products.toLocaleString()} products
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={11} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs font-semibold text-gray-700">{vendor.rating}</span>
                  </div>
                </div>

                <span className="text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  Visit →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Supplier CTA banner */}
        <div className="mt-8 bg-gradient-to-r from-primary to-[#005bb5] rounded-[12px] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              Supply Medical Equipment on Raphamel
            </h3>
            <p className="text-sm text-blue-100">
              Join 800+ verified suppliers reaching 1,000+ hospitals, clinics and pharmacies.
            </p>
          </div>
          <Link
            href="/register?role=vendor"
            className="flex-shrink-0 inline-flex items-center h-11 px-6 bg-[#FACC15] text-gray-900 text-sm font-bold rounded-[6px] hover:bg-[#e6b800] transition-colors"
          >
            Become a Supplier
          </Link>
        </div>
      </div>
    </section>
  );
}
