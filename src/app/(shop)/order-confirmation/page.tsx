'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, Mail, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const NEXT_STEPS = [
  {
    icon: Mail,
    title: 'Check your email',
    description: 'A confirmation with your order details will arrive shortly.',
  },
  {
    icon: Package,
    title: 'Order processing',
    description: 'Our team will verify and dispatch your order within 1–2 business days.',
  },
];

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16">
      <div className="container max-w-xl text-center">
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="flex justify-center mb-6"
        >
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle2 size={44} className="text-green-500" />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-500 text-base">
            Thank you for your purchase. Your payment was received successfully.
          </p>

          {/* Reference */}
          {ref && (
            <div className="mt-5 inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-[6px] px-4 py-2.5">
              <span className="text-xs text-gray-500 font-medium">Reference</span>
              <span className="text-xs font-mono font-bold text-gray-800">{ref}</span>
            </div>
          )}
        </motion.div>

        {/* Next steps */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.4 }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left"
        >
          {NEXT_STEPS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-white border border-gray-100 rounded-[10px] p-4 flex gap-3 shadow-sm"
            >
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon size={15} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-0.5">{title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Button variant="primary" asChild>
            <Link href="/products">
              Continue Shopping <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="h-4 w-4" /> Back to Home
            </Link>
          </Button>
        </motion.div>

        {/* Support note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="mt-8 text-xs text-gray-400"
        >
          Questions? Email us at{' '}
          <a href="mailto:support@raphamel.health" className="text-primary hover:underline">
            support@raphamel.health
          </a>
        </motion.p>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
