'use client';

import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { VALUE_CARDS } from '../constants';
import { SANS, SERIF } from '../fonts';

export function ValuePropsSection() {
  const valueRef = useInView({ threshold: 0.2 });

  return (
    <section ref={valueRef.ref} className="py-20 bg-white">
      <div style={{ paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={valueRef.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: SANS, color: '#0F172A' }}
          >
            Why Healthcare Providers Choose Raphamel
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto mb-6"
            style={{ fontFamily: SANS, color: '#475569' }}
          >
            Built for the unique needs of Nigerian healthcare procurement
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {VALUE_CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }}
                animate={valueRef.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="relative p-8 rounded-2xl"
                style={{ background: card.color.bg, border: `1px solid ${card.color.border}` }}
              >
                {/* Ghost number */}
                <div
                  className="absolute top-6 right-6 text-6xl font-extrabold leading-none"
                  style={{ fontFamily: SERIF, color: card.color.number }}
                >
                  {card.number}
                </div>

                <Icon
                  className="w-12 h-12 mb-6"
                  style={{ color: card.color.icon }}
                  strokeWidth={1.5}
                />

                <h3
                  className="text-xl font-bold mb-3"
                  style={{ fontFamily: SANS, color: '#0F172A' }}
                >
                  {card.title}
                </h3>

                <p style={{ fontFamily: SANS, color: '#475569' }}>
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
