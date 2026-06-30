'use client';

import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { STATS } from '../constants';
import { SANS } from '../fonts';

export function StatsBand() {
    const statsRef = useInView({ threshold: 0.2 });

    return (
        <section ref={statsRef.ref} className="py-16" style={{ background: '#060E1C' }}>
            <div style={{ paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
                <div className="flex flex-row justify-center gap-12 md:gap-20">
                    {STATS.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={statsRef.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            className="text-center"
                        >
                            <div
                                className="text-5xl md:text-6xl font-bold mb-2"
                                style={{ fontFamily: SANS, color: stat.yellow ? '#FACC15' : '#fff' }}
                            >
                                {stat.value}
                            </div>
                            <div
                                className="uppercase tracking-wide text-base"
                                style={{ fontFamily: SANS, color: '#94A3B8' }}
                            >
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
