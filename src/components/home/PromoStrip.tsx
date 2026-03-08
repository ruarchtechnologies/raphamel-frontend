/**
 * FLUTTER EQUIV: StatelessWidget with two side-by-side promotional banners.
 *
 * No internal state — pure display. 'use client' needed for framer-motion.
 *
 * IMAGE NEEDED per banner:
 *   promo-ppe-bulk.jpg | Size: 400x250 | Content: bulk PPE order — stacked boxes
 *   promo-nafdac-certified.jpg | Size: 400x250 | Content: NAFDAC certificate seal
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';

const BANNERS = [
  {
    title: 'Bulk PPE Orders?',
    subtitle: '20% off orders above 500 units',
    badge: 'Volume Discount',
    href: '/categories/personal-protective-equipment',
    bg: 'from-[#0a1628] to-[#1a3560]',
    // IMAGE NEEDED: promo-ppe-bulk.jpg | Size: 400x250
    // Content: Stacked PPE boxes (gloves, masks, gowns) with a bold discount tag
    image: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=400&h=250&fit=crop',
    accent: '#FACC15',
  },
  {
    title: 'NAFDAC Certified',
    subtitle: 'All suppliers verified & approved',
    badge: 'Trusted Suppliers',
    href: '/categories/hospital-consumables',
    bg: 'from-[#0f1f0a] to-[#1a3810]',
    // IMAGE NEEDED: promo-nafdac-certified.jpg | Size: 400x250
    // Content: NAFDAC registration document / seal + medical supplies in background
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=250&fit=crop',
    accent: '#86efac',
  },
] as const;

export function PromoStrip() {
  return (
    <section className="section py-6">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {BANNERS.map((banner, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Link
                href={banner.href}
                className={`relative flex items-center justify-between overflow-hidden rounded-[12px] p-6 bg-gradient-to-r ${banner.bg} group h-36`}
              >
                <div className="z-10">
                  <Badge variant="yellow-solid" className="mb-2 text-[10px]">
                    {banner.badge}
                  </Badge>
                  <h3 className="text-xl font-bold text-white">{banner.title}</h3>
                  <p className="text-sm mt-0.5" style={{ color: banner.accent }}>
                    {banner.subtitle}
                  </p>
                  <span className="inline-flex items-center mt-3 text-xs font-bold text-white/80 group-hover:text-white transition-colors">
                    Shop Now →
                  </span>
                </div>
                <div className="absolute right-0 top-0 h-full w-48 opacity-40 group-hover:opacity-60 transition-opacity">
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/50" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
