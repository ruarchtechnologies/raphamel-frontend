'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface PaystackSessionParams {
  /** Total amount in NGN — converted to kobo internally (×100). */
  amount: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  /**
   * access_code from the Medusa payment session (returned by the Paystack plugin).
   * When provided, the popup opens the existing Paystack transaction so Medusa's
   * authorizePayment can verify the correct reference after cart.complete().
   */
  accessCode?: string | null;
  /** Arbitrary metadata passed through to the Paystack dashboard. */
  metadata?: Record<string, unknown>;
}

export interface PaystackTransaction {
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  message: string;
}

/**
 * Manages the Paystack inline payment popup.
 *
 * USAGE:
 *   const { pay, isPaying } = usePaystackSession();
 *
 *   const ref = await pay({ amount, email, firstName, lastName });
 *   if (ref) {
 *     // payment confirmed — process order
 *   }
 *
 * - `pay()` returns the Paystack reference on success, or null on cancel / error.
 * - `isPaying` is true while the popup is open.
 * - Dynamic import keeps @paystack/inline-js out of the server bundle.
 */
export function usePaystackSession() {
  const [isPaying, setIsPaying] = useState(false);

  const pay = useCallback(
    (params: PaystackSessionParams): Promise<string | null> => {
      return new Promise((resolve) => {
        setIsPaying(true);

        import('@paystack/inline-js')
          .then(({ default: PaystackPop }) => {
            const popup = new PaystackPop();

            const callbacks = {
              onSuccess: (transaction: PaystackTransaction) => {
                setIsPaying(false);
                resolve(transaction.reference);
              },
              onCancel: () => {
                setIsPaying(false);
                toast.error('Payment cancelled. Your cart is still saved.');
                resolve(null);
              },
            };

            if (params.accessCode) {
              // Resume the existing Paystack transaction created by the Medusa plugin.
              // This ensures Medusa's authorizePayment verifies the correct reference.
              popup.newTransaction({
                key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
                accessCode: params.accessCode,
                ...callbacks,
              });
            } else {
              // Fallback: create a new transaction directly (non-plugin flow)
              popup.newTransaction({
                key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
                email: params.email,
                amount: Math.round(params.amount * 100),
                currency: 'NGN',
                firstname: params.firstName,
                lastname: params.lastName,
                phone: params.phone,
                ref: `rph_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                metadata: params.metadata,
                ...callbacks,
              });
            }
          })
          .catch(() => {
            setIsPaying(false);
            toast.error('Could not load payment module. Check your connection.');
            resolve(null);
          });
      });
    },
    [],
  );

  return { pay, isPaying };
}
