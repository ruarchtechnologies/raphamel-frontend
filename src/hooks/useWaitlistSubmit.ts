// hooks/useWaitlistSubmit.ts
// Usage: const { submit, loading, error, success } = useWaitlistSubmit()

import { useState } from "react";

const WAITLIST_URL = process.env.NEXT_PUBLIC_SHEETS_WEBHOOK_URL!;

export type BuyerPayload = {
  type: "buyer";
  fullName: string;
  workEmail: string;
  phone?: string;
  facilityName: string;
  facilityType: string;
  state: string;
  monthlySpend: string;
  categories: string[];
};

export function useWaitlistSubmit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function submit(payload: BuyerPayload) {
    console.log('[useWaitlistSubmit] submit called, WAITLIST_URL:', WAITLIST_URL);
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // text/plain avoids a CORS preflight — Google Apps Script handles simple requests fine.
      // Minimum 1.5s so the loading spinner is always visible.
      const [res] = await Promise.all([
        fetch(WAITLIST_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify(payload),
        }),
        new Promise((resolve) => setTimeout(resolve, 1500)),
      ]);

      if (!res.ok) {
        throw new Error(`Server error (${res.status})`);
      }

      const body = await res.json();
      if (body.status !== 200) {
        throw new Error(body.message ?? "Submission failed. Please try again.");
      }

      setSuccess(true);
    } catch (err: any) {
      const message = err?.message ?? "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return { submit, loading, error, success };
}
