'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SANS, MONO } from '../fonts';
import { HEALTH_CATEGORIES } from '@/domain/entities/category.entity';

/* ── per-category accent colours ── */
const ACCENTS: Record<string, { chip: string; text: string; activeChip: string; activeText: string; stripe: string }> = {
  'hospital-consumables': { chip: '#DBEAFE', text: '#1D4ED8', activeChip: '#1D4ED8', activeText: '#fff', stripe: '#3B82F6' },
  'surgical-equipment': { chip: '#FEE2E2', text: '#B91C1C', activeChip: '#B91C1C', activeText: '#fff', stripe: '#EF4444' },
  'diagnostic-devices': { chip: '#EDE9FE', text: '#6D28D9', activeChip: '#6D28D9', activeText: '#fff', stripe: '#8B5CF6' },
  'personal-protective-equipment': { chip: '#FEF9C3', text: '#92400E', activeChip: '#D97706', activeText: '#fff', stripe: '#F59E0B' },
  'rehabilitation-equipment': { chip: '#D1FAE5', text: '#065F46', activeChip: '#059669', activeText: '#fff', stripe: '#10B981' },
  'laboratory-supplies': { chip: '#E0E7FF', text: '#3730A3', activeChip: '#4338CA', activeText: '#fff', stripe: '#6366F1' },
  'patient-care-products': { chip: '#FCE7F3', text: '#9D174D', activeChip: '#DB2777', activeText: '#fff', stripe: '#EC4899' },
  'first-aid-emergency': { chip: '#FFEDD5', text: '#9A3412', activeChip: '#EA580C', activeText: '#fff', stripe: '#F97316' },
  'mobility-orthopaedic-aids': { chip: '#CCFBF1', text: '#0F766E', activeChip: '#0D9488', activeText: '#fff', stripe: '#14B8A6' },
  'imaging-monitoring-equipment': { chip: '#F1F5F9', text: '#334155', activeChip: '#475569', activeText: '#fff', stripe: '#94A3B8' },
};

/* ── mock products ── */
const PRODUCTS: Record<string, { name: string; price: string; unit: string; img: string; nafdac?: boolean }[]> = {
  'hospital-consumables': [
    { name: 'IV Infusion Set – 60 drops/ml', price: '₦4,500', unit: 'per carton · 100 pcs', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=240&fit=crop', nafdac: true },
    { name: 'Disposable Syringe 5ml', price: '₦2,800', unit: 'per pack · 100 pcs', img: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=240&fit=crop', nafdac: true },
    { name: 'Foley Catheter Fr18', price: '₦6,200', unit: 'per box · 10 pcs', img: 'https://images.unsplash.com/photo-1631815589068-dc4e43d53a39?w=400&h=240&fit=crop' },
    { name: 'Sterile Surgical Gloves 7.5', price: '₦8,500', unit: 'per box · 50 pairs', img: 'https://images.unsplash.com/photo-1606206873764-fd15e242a29f?w=400&h=240&fit=crop', nafdac: true },
  ],
  'diagnostic-devices': [
    { name: 'Digital Stethoscope – Dual Head', price: '₦28,000', unit: 'per unit', img: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=240&fit=crop', nafdac: true },
    { name: 'Automatic Blood Pressure Monitor', price: '₦45,000', unit: 'per unit', img: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=400&h=240&fit=crop' },
    { name: 'Glucometer Kit + 50 Strips', price: '₦18,500', unit: 'per set', img: 'https://images.unsplash.com/photo-1543333995-a78aea2eee50?w=400&h=240&fit=crop', nafdac: true },
    { name: 'Fingertip Pulse Oximeter', price: '₦9,200', unit: 'per unit', img: 'https://images.unsplash.com/photo-1585435557343-3b348031e13e?w=400&h=240&fit=crop' },
  ],
  'surgical-equipment': [
    { name: 'Surgical Scalpel Handle No.4', price: '₦3,400', unit: 'per unit', img: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=240&fit=crop', nafdac: true },
    { name: 'Haemostatic Forceps – 14cm', price: '₦12,000', unit: 'per unit', img: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=400&h=240&fit=crop', nafdac: true },
    { name: 'Surgical Instrument Tray Set', price: '₦85,000', unit: 'per set · 32 pcs', img: 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?w=400&h=240&fit=crop' },
    { name: 'Self-Retaining Retractor', price: '₦24,500', unit: 'per unit', img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=240&fit=crop', nafdac: true },
  ],
  'laboratory-supplies': [
    { name: 'Rapid Malaria RDT (25 tests)', price: '₦14,000', unit: 'per box', img: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=240&fit=crop', nafdac: true },
    { name: 'Micro Centrifuge Tubes 1.5ml', price: '₦3,200', unit: 'per pack · 500 pcs', img: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=240&fit=crop' },
    { name: 'Micropipette 100–1000µl', price: '₦38,000', unit: 'per unit', img: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=400&h=240&fit=crop', nafdac: true },
    { name: 'Serum Separator Tubes (SST)', price: '₦7,500', unit: 'per box · 100 pcs', img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=240&fit=crop' },
  ],
  'personal-protective-equipment': [
    { name: 'N95 Respirator Mask – FFP2', price: '₦18,000', unit: 'per box · 20 pcs', img: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=400&h=240&fit=crop', nafdac: true },
    { name: 'Nitrile Exam Gloves – Medium', price: '₦9,500', unit: 'per box · 100 pcs', img: 'https://images.unsplash.com/photo-1606206873764-fd15e242a29f?w=400&h=240&fit=crop', nafdac: true },
    { name: 'Isolation Gown – Level 2', price: '₦22,000', unit: 'per pack · 10 pcs', img: 'https://images.unsplash.com/photo-1631815589068-dc4e43d53a39?w=400&h=240&fit=crop' },
    { name: 'Full-Face Shield – Reusable', price: '₦5,800', unit: 'per unit', img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=240&fit=crop' },
  ],
  'imaging-monitoring-equipment': [
    { name: 'Portable Patient Monitor 5-param', price: '₦380,000', unit: 'per unit', img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&h=240&fit=crop', nafdac: true },
    { name: 'Fingertip Pulse Oximeter Pro', price: '₦12,500', unit: 'per unit', img: 'https://images.unsplash.com/photo-1585435557343-3b348031e13e?w=400&h=240&fit=crop' },
    { name: '12-Lead ECG Machine', price: '₦520,000', unit: 'per unit', img: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400&h=240&fit=crop', nafdac: true },
    { name: 'Portable Ultrasound Scanner', price: '₦1,200,000', unit: 'per unit', img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=240&fit=crop', nafdac: true },
  ],
  'patient-care-products': [
    { name: 'Adjustable Hospital Bed – Manual', price: '₦185,000', unit: 'per unit', img: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=240&fit=crop' },
    { name: 'Wound Dressing Kit – Sterile', price: '₦4,800', unit: 'per kit', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=240&fit=crop', nafdac: true },
    { name: 'IV Drip Stand – 4 Hook', price: '₦18,500', unit: 'per unit', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=240&fit=crop' },
    { name: 'Disposable Bed Sheets', price: '₦6,200', unit: 'per roll · 50 sheets', img: 'https://images.unsplash.com/photo-1631815589068-dc4e43d53a39?w=400&h=240&fit=crop' },
  ],
  'first-aid-emergency': [
    { name: 'AED – Automated Defibrillator', price: '₦620,000', unit: 'per unit', img: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&h=240&fit=crop', nafdac: true },
    { name: 'Trauma First Aid Kit', price: '₦28,000', unit: 'per kit', img: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&h=240&fit=crop' },
    { name: 'Oxygen Mask – Non-Rebreather', price: '₦3,500', unit: 'per pack · 10 pcs', img: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=240&fit=crop', nafdac: true },
    { name: 'Emergency Stretcher – Foldable', price: '₦75,000', unit: 'per unit', img: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=400&h=240&fit=crop' },
  ],
  'rehabilitation-equipment': [
    { name: 'TENS Unit – Dual Channel', price: '₦45,000', unit: 'per unit', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=240&fit=crop' },
    { name: 'Parallel Bars – Adjustable', price: '₦220,000', unit: 'per unit', img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=240&fit=crop' },
    { name: 'Resistance Band Set (5 levels)', price: '₦8,500', unit: 'per set', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=240&fit=crop' },
    { name: 'Balance Board – Professional', price: '₦32,000', unit: 'per unit', img: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=400&h=240&fit=crop' },
  ],
  'mobility-orthopaedic-aids': [
    { name: 'Lightweight Wheelchair – Foldable', price: '₦95,000', unit: 'per unit', img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=240&fit=crop' },
    { name: 'Forearm Crutches – Pair', price: '₦14,500', unit: 'per pair', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=240&fit=crop' },
    { name: 'Ankle Support Brace', price: '₦6,800', unit: 'per unit', img: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400&h=240&fit=crop' },
    { name: 'Compression Stockings Class II', price: '₦9,200', unit: 'per pair', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=240&fit=crop', nafdac: true },
  ],
};

export function CategoriesPreviewSection() {
  const [activeSlug, setActiveSlug] = useState('hospital-consumables');

  const activeCategory = HEALTH_CATEGORIES.find(c => c.slug === activeSlug);
  const products = PRODUCTS[activeSlug] ?? [];
  const accent = ACCENTS[activeSlug] ?? ACCENTS['hospital-consumables'];

  return (
    <section
      style={{ background: '#FAFAF8', borderTop: '1px solid #F1F0ED' }}
      className="py-20"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* ── Header ── */}
        <div className="text-center" style={{ marginBottom: '56px' }}>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: SANS, color: '#0F172A' }}
          >
            What You&apos;ll Find on Raphamel
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto mb-6"
            style={{ fontFamily: SANS, color: '#475569' }}
          >
            From everyday consumables to advanced diagnostic equipment — stocked, verified, and ready to order.
          </p>
        </div>

        {/* ── Category Chips — 3 / 4 / 3 pyramid ── */}
        {(() => {
          const rows = [
            HEALTH_CATEGORIES.slice(0, 3),
            HEALTH_CATEGORIES.slice(3, 7),
            HEALTH_CATEGORIES.slice(7, 10),
          ];
          let globalIndex = 0;
          return (
            <div className="flex flex-col items-center gap-2.5" style={{ marginBottom: '48px' }}>
              {rows.map((row, rowIdx) => (
                <div key={rowIdx} className="flex justify-center gap-2 flex-wrap">
                  {row.map((cat) => {
                    const i = globalIndex++;
                    const a = ACCENTS[cat.slug] ?? ACCENTS['hospital-consumables'];
                    const isActive = activeSlug === cat.slug;
                    return (
                      <motion.button
                        key={cat.slug}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: i * 0.05 }}
                        onClick={() => setActiveSlug(cat.slug)}
                        className="text-sm font-medium rounded-full"
                        style={{
                          fontFamily: SANS,
                          padding: '6px 16px',
                          background: isActive ? a.activeChip : a.chip,
                          color: isActive ? a.activeText : a.text,
                          border: 'none',
                          outline: 'none',
                          cursor: 'pointer',
                          boxShadow: isActive ? `0 2px 10px ${a.activeChip}55` : 'none',
                          transform: isActive ? 'translateY(-1px)' : 'none',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {cat.name}
                      </motion.button>
                    );
                  })}
                </div>
              ))}
            </div>
          );
        })()}

        {/* ── Product Cards ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {products.map((product, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: i * 0.06 }}
                className="group flex flex-col overflow-hidden"
                style={{
                  background: '#fff',
                  border: '1px solid #EEF1F5',
                  borderLeft: `3px solid ${accent.stripe}`,
                  borderRadius: '12px',
                  transition: 'box-shadow 0.2s ease, transform 0.2s ease, border-left-color 0.3s ease',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = '0 12px 36px rgba(0,0,0,0.11)';
                  el.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = 'none';
                  el.style.transform = 'none';
                }}
              >
                {/* Image */}
                <div className="relative overflow-hidden" style={{ height: '200px', background: '#F1F5F9' }}>
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 60%)' }} />

                  {/* Product name overlay */}
                  <p
                    className="absolute bottom-3 left-3 right-3 text-sm font-semibold leading-snug line-clamp-2"
                    style={{ fontFamily: SANS, color: '#fff' }}
                  >
                    {product.name}
                  </p>

                  {/* NAFDAC badge — top right */}
                  {product.nafdac && (
                    <span
                      className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{ fontFamily: MONO, background: accent.activeChip, color: '#fff' }}
                    >
                      ✓ NAFDAC
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex items-center justify-between p-4" style={{ borderTop: '1px solid #F1F5F9' }}>
                  <div>
                    <span
                      className="text-sm font-bold block"
                      style={{ fontFamily: SANS, color: '#0F172A' }}
                    >
                      {product.price}
                    </span>
                    <span
                      className="text-xs"
                      style={{ fontFamily: SANS, color: '#94A3B8' }}
                    >
                      {product.unit}
                    </span>
                  </div>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ fontFamily: MONO, background: '#F8FAFC', color: '#94A3B8', border: '1px solid #E2E8F0' }}
                  >
                    B2B
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>


      </div>
    </section>
  );
}
