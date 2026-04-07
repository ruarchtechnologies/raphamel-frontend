'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShieldCheck, Package, Truck, BadgeCheck } from 'lucide-react';

const FEATURES = [
  { icon: ShieldCheck, label: 'NAFDAC-verified products' },
  { icon: Package,     label: '15,000+ medical SKUs' },
  { icon: Truck,       label: 'Nationwide delivery' },
  { icon: BadgeCheck,  label: 'Admin-verified accounts' },
];

interface AuthLeftPanelProps {
  heading: string;
  subheading: string;
}

export function AuthLeftPanel({ heading, subheading }: AuthLeftPanelProps) {
  return (
    <div
      className="hidden lg:flex flex-col justify-between p-12 xl:p-16"
      style={{ background: 'linear-gradient(160deg, #0a1628 0%, #0e2444 60%, #0d3060 100%)' }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/images/logo.png"
          alt="Raphamel"
          width={40}
          height={40}
          className="object-contain"
          priority
        />
        <span className="text-white font-bold text-xl tracking-tight">Raphamel</span>
      </Link>

      {/* Main copy */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="space-y-5"
      >
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-300 mb-3">
            Nigeria&apos;s B2B Medical Supply
          </p>
          <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight">
            {heading}
          </h2>
          <p className="text-blue-200 mt-3 text-base leading-relaxed max-w-xs">
            {subheading}
          </p>
        </div>

        {/* Feature list */}
        <ul className="space-y-3 pt-2">
          {FEATURES.map(({ icon: Icon, label }, i) => (
            <motion.li
              key={label}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
              className="flex items-center gap-3"
            >
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <Icon size={14} className="text-blue-300" />
              </div>
              <span className="text-sm text-blue-100">{label}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Bottom quote */}
      <div className="border-t border-white/10 pt-6">
        <blockquote className="text-sm text-blue-200 italic leading-relaxed">
          &ldquo;Raphamel cut our procurement time in half and guaranteed every item was NAFDAC-compliant.&rdquo;
        </blockquote>
        <p className="text-xs text-blue-400 mt-2 not-italic">
          — Dr. Amaka Obi, Chief Pharmacist, Lagos University Teaching Hospital
        </p>
      </div>
    </div>
  );
}
