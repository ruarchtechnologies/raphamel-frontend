'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroEmailInput } from './ui/WaitlistEmailInput';
import { SuccessState } from './ui/SuccessState';
import { DashboardCard } from './ui/DashboardCard';
import { AVATARS } from '../constants';
import { SANS, SERIF } from '../fonts';

export function WaitlistHeroSection() {
  const [activeHeroTab, setActiveHeroTab] = useState<'buyer' | 'supplier'>('buyer');
  const [heroSubmitted, setHeroSubmitted] = useState(false);

  return (
    <section className="relative min-h-screen pt-24 pb-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom right, #060E1C, #0A1628, #0E2444)' }} />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(to right, #0071DC 1px, transparent 1px), linear-gradient(to bottom, #0071DC 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Radial glows */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'rgba(0,113,220,0.2)', filter: 'blur(150px)' }} />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'rgba(250,204,21,0.15)', filter: 'blur(150px)' }} />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left column */}
          <div className="space-y-8">

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1]"
              style={{ fontFamily: SERIF }}
            >
              Nigeria&apos;s{' '}
              <span style={{ color: '#0071DC' }}>B2B Medical</span>{' '}
              Marketplace is Launching Soon
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg max-w-xl"
              style={{ fontFamily: SANS, color: '#94A3B8' }}
            >
              Connect verified suppliers with healthcare facilities. Transparent pricing, reliable delivery, NAFDAC compliance built-in.
            </motion.p>

            {/* Buyer / Supplier toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex gap-3"
            >
              {(['buyer', 'supplier'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveHeroTab(tab)}
                  style={{
                    fontFamily: SANS,
                    background: activeHeroTab === tab ? '#0071DC' : 'rgba(255,255,255,0.06)',
                    color: activeHeroTab === tab ? '#fff' : '#94A3B8',
                  }}
                  className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:opacity-90"
                >
                  {tab === 'buyer' ? "I'm a Buyer" : "I'm a Supplier"}
                </button>
              ))}
            </motion.div>

            {/* Email form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <AnimatePresence mode="wait">
                {heroSubmitted ? (
                  <motion.div key="success" exit={{ opacity: 0 }}>
                    <SuccessState />
                  </motion.div>
                ) : (
                  <motion.div key="form" exit={{ opacity: 0 }}>
                    <HeroEmailInput onSuccess={() => setHeroSubmitted(true)} activeTab={activeHeroTab} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Avatar stack */}
            {!heroSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex items-center gap-4"
              >
                <div className="flex -space-x-2">
                  {AVATARS.map((avatar, i) => (
                    <img
                      key={i}
                      src={avatar}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                      style={{ border: '2px solid #060E1C' }}
                    />
                  ))}
                </div>
                <p className="text-sm" style={{ fontFamily: SANS, color: '#94A3B8' }}>
                  <span className="text-white font-semibold">1,200+</span> already waiting
                </p>
              </motion.div>
            )}
          </div>

          {/* Right column — dashboard card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <DashboardCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
