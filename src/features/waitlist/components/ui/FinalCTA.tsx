'use client';

import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { SANS } from '../../fonts';

export function FinalCTA() {
  const ctaRef = useInView({ threshold: 0.2 });

  const scrollToHero = () => {
    document.getElementById('hero-email')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

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

          <button
            onClick={scrollToHero}
            style={{
              fontFamily: SANS,
              background: '#FACC15',
              color: '#0F172A',
              boxShadow: '0 4px 20px rgba(250,204,21,0.35)',
              padding: '0 64px',
              height: '48px',
              borderRadius: '999px',
              fontWeight: 700,
              fontSize: '16px',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-block',
              transition: 'all 0.2s',
            }}
          >
            Join the Waitlist
          </button>
        </motion.div>
      </div>
    </section>
  );
}
