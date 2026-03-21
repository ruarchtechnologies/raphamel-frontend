'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { BUYER_STEPS, SUPPLIER_STEPS } from '../constants';
import { SANS, MONO } from '../fonts';

interface Props {
  activeTab: 'buyer' | 'supplier';
  setActiveTab: (tab: 'buyer' | 'supplier') => void;
}

const TAB_IMAGES = {
  buyers: '/images/how-buyer.png',
  suppliers: '/images/how-supplier.png',
};

export function HowItWorksSection({ activeTab, setActiveTab }: Props) {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const activeHowTab = activeTab === 'buyer' ? 'buyers' : 'suppliers';
  const setActiveHowTab = (tab: 'buyers' | 'suppliers') =>
    setActiveTab(tab === 'buyers' ? 'buyer' : 'supplier');
  const howRef = useInView({ threshold: 0.1 });
  const howSteps = activeHowTab === 'buyers' ? BUYER_STEPS : SUPPLIER_STEPS;

  const tabs = [
    { id: 'buyers', label: 'For Buyers' },
    { id: 'suppliers', label: 'For Suppliers' },
  ] as const;

  return (
    <section
      ref={howRef.ref}
      className="overflow-hidden"
      style={{ background: '#F0F4F8', padding: 'clamp(48px, 7vw, 96px) 0' }}
    >
      <div className="max-w-7xl mx-auto" style={{ padding: '0 clamp(24px, 8vw, 120px)' }}>

        {/* ── Card container ── */}
        <div
          style={{
            background: 'linear-gradient(160deg, #080F1E 0%, #0B1830 45%, #0D2040 100%)',
            borderRadius: '32px',
            padding: 'clamp(40px, 6vw, 72px)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.05)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle mesh glow top-right */}
          <div
            style={{
              position: 'absolute',
              top: '-80px',
              right: '-80px',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,113,220,0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          {/* Subtle yellow glow bottom-left */}
          <div
            style={{
              position: 'absolute',
              bottom: '-60px',
              left: '20%',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(250,204,21,0.05) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* ── Section header ── */}
          <div style={{ marginBottom: 'clamp(36px, 5vw, 56px)' }}>
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={howRef.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.55, delay: 0.05 }}
                style={{
                  fontFamily: SANS,
                  fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                  fontWeight: 800,
                  color: '#fff',
                  letterSpacing: '-0.025em',
                  lineHeight: 1.15,
                  margin: 0,
                  marginBottom: '20px',
                }}
              >
                How It Works,{' '}
                <span style={{ color: '#FACC15' }}>Step by Step</span>
              </motion.h2>

              {/* Tab switcher */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={howRef.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                transition={{ duration: 0.45, delay: 0.1 }}
                style={{ marginBottom: '16px' }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    padding: '4px',
                    borderRadius: '999px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {tabs.map((tab) => {
                    const isActive = activeHowTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveHowTab(tab.id)}
                        style={{
                          position: 'relative',
                          padding: '7px 20px',
                          borderRadius: '999px',
                          fontFamily: SANS,
                          fontSize: '13px',
                          fontWeight: isActive ? 700 : 500,
                          color: isActive ? '#0B1830' : 'rgba(255,255,255,0.55)',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          outline: 'none',
                          transition: 'color 0.2s ease',
                        }}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="how-pill"
                            style={{
                              position: 'absolute',
                              inset: 0,
                              borderRadius: '999px',
                              background: '#fff',
                            }}
                            transition={{ type: 'spring', stiffness: 440, damping: 34 }}
                          />
                        )}
                        <span style={{ position: 'relative', zIndex: 1 }}>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={howRef.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                style={{
                  fontFamily: SANS,
                  fontSize: '15px',
                  color: 'rgba(255,255,255,0.5)',
                  lineHeight: 1.7,
                  maxWidth: '460px',
                  margin: 0,
                }}
              >
                {activeHowTab === 'buyers'
                  ? "Whether you're procuring for a hospital or clinic, Raphamel makes healthcare supply seamless."
                  : "List your inventory, get verified, and start reaching healthcare facilities across Nigeria."}
              </motion.p>
            </div>
          </div>

          {/* ── Body: steps + image ── */}
          <div className="flex flex-col lg:flex-row" style={{ gap: 'clamp(32px, 5vw, 72px)', alignItems: 'stretch' }}>
            {/* LEFT — Timeline steps */}
            <div style={{ flex: '1 1 52%' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeHowTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.28 }}
                >
                  {howSteps.map((step, i) => {
                    const isHovered = hoveredStep === i;
                    const isLast = i === howSteps.length - 1;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -16 }}
                        animate={howRef.isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
                        transition={{ duration: 0.45, delay: 0.18 + i * 0.09 }}
                        onMouseEnter={() => setHoveredStep(i)}
                        onMouseLeave={() => setHoveredStep(null)}
                        style={{
                          display: 'flex',
                          gap: '16px',
                          cursor: 'default',
                        }}
                      >
                        {/* Timeline column */}
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            flexShrink: 0,
                            width: '36px',
                          }}
                        >
                          {/* Number badge */}
                          <motion.div
                            animate={{
                              background: isHovered
                                ? 'linear-gradient(135deg, #0071DC, #0057B8)'
                                : 'rgba(255,255,255,0.08)',
                              borderColor: isHovered
                                ? 'rgba(0,113,220,0.6)'
                                : 'rgba(255,255,255,0.12)',
                              boxShadow: isHovered
                                ? '0 0 0 4px rgba(0,113,220,0.15)'
                                : '0 0 0 0px rgba(0,113,220,0)',
                            }}
                            transition={{ duration: 0.25 }}
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '10px',
                              border: '1px solid rgba(255,255,255,0.12)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <span
                              style={{
                                fontFamily: MONO,
                                fontSize: '11px',
                                fontWeight: 700,
                                color: isHovered ? '#fff' : 'rgba(255,255,255,0.6)',
                                letterSpacing: '0.02em',
                                transition: 'color 0.2s',
                              }}
                            >
                              {String(step.number).padStart(2, '0')}
                            </span>
                          </motion.div>

                          {/* Connector line */}
                          {!isLast && (
                            <div
                              style={{
                                width: '1px',
                                flex: 1,
                                marginTop: '6px',
                                marginBottom: '0px',
                                background: 'linear-gradient(to bottom, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)',
                              }}
                            />
                          )}
                        </div>

                        {/* Step content */}
                        <div
                          style={{
                            flex: 1,
                            paddingBottom: isLast ? '0' : '28px',
                            paddingTop: '4px',
                          }}
                        >
                          <motion.div
                            animate={{
                              background: isHovered
                                ? 'rgba(255,255,255,0.04)'
                                : 'transparent',
                            }}
                            transition={{ duration: 0.2 }}
                            style={{
                              borderRadius: '12px',
                              padding: isHovered ? '12px 14px' : '0px 0px',
                              marginLeft: '-2px',
                              transition: 'padding 0.2s ease',
                            }}
                          >
                            <p
                              style={{
                                fontFamily: SANS,
                                fontSize: '15px',
                                fontWeight: 700,
                                color: '#fff',
                                lineHeight: 1.35,
                                marginBottom: '5px',
                              }}
                            >
                              {step.title}
                            </p>
                            <p
                              style={{
                                fontFamily: SANS,
                                fontSize: '13px',
                                color: 'rgba(255,255,255,0.5)',
                                lineHeight: 1.7,
                              }}
                            >
                              {step.description}
                            </p>
                          </motion.div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* RIGHT — Image card */}
            <div className="w-full lg:flex-1" style={{ minHeight: '300px' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeHowTab + '-img'}
                  initial={{ opacity: 0, scale: 0.97, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '20px',
                    width: '100%',
                    height: '0',
                    paddingBottom: '62%',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
                  }}
                >
                  <img
                    src={TAB_IMAGES[activeHowTab]}
                    alt=""
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      filter: 'brightness(0.95) saturate(0.95)',
                    }}
                  />

                  {/* Multi-stop gradient overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(170deg, rgba(6,14,28,0.05) 0%, rgba(6,14,28,0.08) 60%, rgba(6,14,28,0.3) 100%)',
                    }}
                  />

                  {/* Top-right glow accent */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '180px',
                      height: '180px',
                      background: 'radial-gradient(circle at top right, rgba(0,113,220,0.25) 0%, transparent 70%)',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Top badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      padding: '6px 14px',
                      borderRadius: '999px',
                      background: 'rgba(6,14,28,0.55)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#FACC15',
                        display: 'inline-block',
                        boxShadow: '0 0 6px rgba(250,204,21,0.7)',
                      }}
                    />
                    <span
                      style={{
                        fontFamily: MONO,
                        fontSize: '10px',
                        fontWeight: 600,
                        color: '#fff',
                        letterSpacing: '0.09em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {activeHowTab === 'buyers' ? 'Healthcare Buyer' : 'Verified Supplier'}
                    </span>
                  </div>

                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
