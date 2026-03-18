'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { CTAEmailInput } from './WaitlistEmailInput';
import { SuccessState } from './SuccessState';
import { SANS } from '../../fonts';

export function FinalCTA() {
  const [ctaSubmitted, setCtaSubmitted] = useState(false);
  const ctaRef = useInView({ threshold: 0.2 });

  return (
    <section ref={ctaRef.ref} className="py-20" style={{ background: '#0A1628' }}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={ctaRef.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: SANS }}
          >
            Reserve Your Early Access
          </h2>

          <p
            className="text-lg mb-8 max-w-2xl mx-auto"
            style={{ fontFamily: SANS, color: '#94A3B8' }}
          >
            Join 1,200+ healthcare providers and suppliers preparing to transform medical procurement in Nigeria.
          </p>

          <div className="max-w-xl mx-auto">
            <AnimatePresence mode="wait">
              {ctaSubmitted ? (
                <motion.div key="success" exit={{ opacity: 0 }}>
                  <SuccessState />
                </motion.div>
              ) : (
                <motion.div key="form" exit={{ opacity: 0 }}>
                  <CTAEmailInput onSuccess={() => setCtaSubmitted(true)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
