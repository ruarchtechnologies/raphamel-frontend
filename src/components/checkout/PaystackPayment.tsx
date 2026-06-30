'use client';

import { ShieldCheck, Lock, Smartphone, Building2, CreditCard } from 'lucide-react';

const PAYMENT_METHODS = [
  { icon: CreditCard,  label: 'Debit / Credit Card' },
  { icon: Building2,   label: 'Bank Transfer' },
  { icon: Smartphone,  label: 'USSD' },
] as const;

interface PaystackPaymentProps {
  /** Total amount in NGN — displayed to the user for confirmation. */
  amount: number;
}

/**
 * Display component for the Payment section of checkout.
 *
 * Shows accepted payment channels and trust signals.
 * The actual payment trigger happens via usePaystackSession in the
 * checkout form's onSubmit — this component is purely informational UI.
 */
export function PaystackPayment({ amount: _ }: PaystackPaymentProps) {
  return (
    <div className="space-y-4">
      {/* Accepted channels */}
      <div className="grid grid-cols-3 gap-3">
        {PAYMENT_METHODS.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-[8px] border border-gray-100 text-center"
          >
            <Icon size={20} className="text-gray-500" />
            <span className="text-[11px] font-medium text-gray-600 leading-tight">{label}</span>
          </div>
        ))}
      </div>

      {/* Trust row */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-1">
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={13} className="text-green-500" />
          256-bit SSL
        </span>
        <span className="flex items-center gap-1.5">
          <Lock size={13} className="text-green-500" />
          PCI DSS Compliant
        </span>
        <span className="flex items-center gap-1.5 font-semibold" style={{ color: 'var(--color-primary)' }}>
          Powered by Paystack
        </span>
      </div>
    </div>
  );
}
