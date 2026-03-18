'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { SANS } from '../../fonts';

export function SuccessState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      className="flex items-center gap-4 p-4 rounded-xl"
      style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', delay: 0.1, stiffness: 220, damping: 16 }}
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
        style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}
      >
        <CheckCircle2 size={20} className="text-green-400" />
      </motion.div>
      <div>
        <p className="text-sm font-semibold text-white" style={{ fontFamily: SANS }}>
          You&apos;re on the list!
        </p>
        <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: SANS }}>
          We&apos;ll notify you the moment Raphamel goes live.
        </p>
      </div>
    </motion.div>
  );
}
