'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { SANS, MONO } from '../../fonts';

export function DashboardCard() {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      className="relative"
    >
      <div
        className="rounded-2xl p-6 space-y-6"
        style={{
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-white font-semibold" style={{ fontFamily: SANS }}>
            Recent Orders
          </div>
          <div
            className="flex items-center gap-2 px-3 py-1 rounded-full"
            style={{ background: 'rgba(34,197,94,0.12)' }}
          >
            <motion.div
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full"
              style={{ background: '#22C55E' }}
            />
            <span
              className="text-[10px] font-semibold uppercase"
              style={{ fontFamily: MONO, color: '#22C55E' }}
            >
              NAFDAC Verified
            </span>
          </div>
        </div>

        {/* Product row */}
        <div
          className="flex items-start gap-4 p-4 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          <img
            src="https://images.unsplash.com/photo-1664902265139-934219cee42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZXF1aXBtZW50JTIwZmxhdCUyMGxheSUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NzI5ODI3MjZ8MA&ixlib=rb-4.1.0&q=80&w=200"
            alt="IV Fluid Set"
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex-1 space-y-2">
            <div className="text-white font-semibold text-sm" style={{ fontFamily: SANS }}>
              IV Fluid Set - 1000ml
            </div>
            <div className="flex items-center gap-1">
              <Check className="w-3 h-3" style={{ color: '#22C55E' }} />
              <span className="text-xs" style={{ fontFamily: SANS, color: '#94A3B8' }}>
                MedSupply Nigeria
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg text-white font-bold" style={{ fontFamily: SANS }}>
                &#8358;45,000
              </span>
              <span className="text-xs font-semibold" style={{ fontFamily: MONO, color: '#FACC15' }}>
                In Transit
              </span>
            </div>
          </div>
        </div>

        {/* Sparkline */}
        <div className="space-y-2">
          <div className="text-xs" style={{ fontFamily: SANS, color: '#94A3B8' }}>
            Order Volume (Last 7 Days)
          </div>
          <div className="h-12 flex items-end gap-1">
            {[40, 65, 55, 80, 70, 90, 75].map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                className="flex-1 rounded-t"
                style={{ background: 'linear-gradient(to top, #0071DC, rgba(0,113,220,0.4))' }}
              />
            ))}
          </div>
        </div>

        {/* Status grid */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Pending', value: '12', color: '#FACC15' },
            { label: 'In Transit', value: '8', color: '#0071DC' },
            { label: 'Delivered', value: '34', color: '#22C55E' },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-3 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <div className="text-2xl text-white font-bold" style={{ fontFamily: SANS }}>
                {stat.value}
              </div>
              <div className="text-xs" style={{ fontFamily: SANS, color: '#94A3B8' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
