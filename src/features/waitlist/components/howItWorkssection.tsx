'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { BUYER_STEPS, SUPPLIER_STEPS } from '../constants';
import { SANS } from '../fonts';

export function HowItWorksSection() {
    const [activeHowTab, setActiveHowTab] = useState<'buyers' | 'suppliers'>('buyers');
    const howRef = useInView({ threshold: 0.2 });
    const howSteps = activeHowTab === 'buyers' ? BUYER_STEPS : SUPPLIER_STEPS;

    return (
        <section ref={howRef.ref} className="py-20 bg-white" style={{ borderTop: '1px solid #F1F5F9' }}>
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    animate={howRef.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2
                        className="text-4xl md:text-5xl font-bold mb-4"
                        style={{ fontFamily: SANS, color: '#0F172A' }}
                    >
                        How It Works
                    </h2>
                    <p
                        className="text-lg max-w-2xl mx-auto mb-8"
                        style={{ fontFamily: SANS, color: '#475569' }}
                    >
                        Simple, transparent procurement in minutes
                    </p>

                    {/* Tabs */}
                    <div className="flex justify-center gap-4">
                        {(['buyers', 'suppliers'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveHowTab(tab)}
                                style={{
                                    fontFamily: SANS,
                                    background: activeHowTab === tab ? '#0071DC' : '#F8FAFC',
                                    color: activeHowTab === tab ? '#fff' : '#475569',
                                    border: activeHowTab === tab ? 'none' : '1px solid #E2E8F0',
                                }}
                                className="px-8 py-3 rounded-xl font-semibold transition-all duration-200"
                            >
                                {tab === 'buyers' ? 'For Buyers' : 'For Suppliers'}
                            </button>
                        ))}
                    </div>
                </motion.div>

                <div className="overflow-x-auto mt-16">
                    <div className="flex flex-row-5 gap-6 min-w-[640px]">
                        {howSteps.map((step, i) => (
                            <div className="flex-1 text-center">
                                <motion.div
                                    key={`${activeHowTab}-${i}`}
                                    initial={{ opacity: 0, y: 32 }}
                                    animate={howRef.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
                                    transition={{ duration: 0.6, delay: i * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="flex justify-center mb-4">
                                        <div
                                            className="w-12 h-12 rounded-full flex items-center justify-center"
                                            style={{ background: '#0071DC' }}
                                        >
                                            <span
                                                className="text-white font-bold text-lg"
                                                style={{ fontFamily: SANS }}
                                            >
                                                {step.number}
                                            </span>
                                        </div>
                                    </div>

                                    <h3
                                        className="text-lg font-bold mb-2"
                                        style={{ fontFamily: SANS, color: '#0F172A' }}
                                    >
                                        {step.title}
                                    </h3>

                                    <p
                                        className="text-sm"
                                        style={{ fontFamily: SANS, color: '#475569' }}
                                    >
                                        {step.description}
                                    </p>
                                </motion.div>
                            </div>

                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
