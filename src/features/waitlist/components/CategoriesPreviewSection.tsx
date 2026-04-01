'use client';

import { motion } from 'framer-motion';
import { SANS } from '../fonts';
import { HEALTH_CATEGORIES } from '@/domain/entities/category.entity';
import './waitlistHero.css';

const TILES: { slug: string; cls: string; pos?: string }[] = [
  { slug: 'hospital-consumables', cls: 'cat-a', pos: 'center' },
  { slug: 'surgical-equipment', cls: 'cat-b', pos: 'center top' },
  { slug: 'diagnostic-devices', cls: 'cat-c', pos: 'center' },
  { slug: 'personal-protective-equipment', cls: 'cat-d', pos: 'center' },
  { slug: 'rehabilitation-equipment', cls: 'cat-e', pos: 'center' },
  { slug: 'laboratory-supplies', cls: 'cat-f', pos: 'center' },
  { slug: 'pharmaceuticals', cls: 'cat-g', pos: 'center' },
  { slug: 'patient-care-products', cls: 'cat-h', pos: 'center' },
  { slug: 'imaging-monitoring-equipment', cls: 'cat-i', pos: 'center' },
  { slug: 'mobility-orthopaedic-aids', cls: 'cat-j', pos: 'center' },
  { slug: 'topicals', cls: 'cat-k', pos: 'center' },
];

export function CategoriesPreviewSection() {
  return (
    <section style={{ background: '#F0F4F8', borderTop: '1px solid #E2E8F0' }} className="py-20">
      <div style={{ maxWidth: '100%', padding: '0 clamp(24px, 5vw, 80px)' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
              marginBottom: '12px',
            }}
          >
            What You&apos;ll Find on Raphamel
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            style={{
              fontFamily: SANS,
              fontSize: '15px',
              color: '#64748B',
              maxWidth: '480px',
              lineHeight: 1.65,
              margin: '0 auto',
            }}
          >
            The medical supply catalog built for how hospitals actually buy. Thousands of verified products, transparent pricing, and real-time order tracking. All in one platform built for Nigerian healthcare.
          </motion.p>
        </div>

        {/* ── Bento grid ── */}
        <div className="cat-grid">
          {TILES.map((tile, i) => {
            const cat = HEALTH_CATEGORIES.find(c => c.slug === tile.slug);
            if (!cat) return null;

            return (
              <motion.div
                key={tile.slug}
                className={`cat-tile ${tile.cls}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: Math.min(i * 0.055, 0.38) }}
              >
                {/* Full-bleed image — no overlay */}
                <img
                  src={`/images/category-${tile.slug}.png`}
                  alt={cat.name}
                  style={{ objectPosition: tile.pos ?? 'center' }}
                  draggable={false}
                />

                {/* Name chip */}
                <div className="cat-label">
                  <div className="cat-label-chip">
                    <span
                      style={{
                        fontFamily: SANS,
                        fontSize: 'clamp(13px, 1.4vw, 15px)',
                        fontWeight: 700,
                        color: '#fff',
                        letterSpacing: '-0.01em',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {cat.name}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
