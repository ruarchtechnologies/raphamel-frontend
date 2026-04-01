// hooks/useWaitlistSubmit.ts
// Usage: const { submit, loading, error, success } = useWaitlistSubmit()

import { useState } from "react";
import { toast } from "sonner";

const WAITLIST_URL = process.env.NEXT_PUBLIC_WAITLIST_URL!;

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
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Google Apps Script doesn't support JSON Content-Type from browser (CORS)
      // So we use no-cors mode — we won't get a response body, but it works.
      // Minimum 1.5s delay so the loading state is visible to the user.
      await Promise.all([
        fetch(WAITLIST_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify(payload),
        }),
        new Promise((resolve) => setTimeout(resolve, 1500)),
      ]);

      setSuccess(true);
      toast.success("You're on the list!", {
        description: "We'll be in touch as we approach launch.",
        duration: 5000,
      });
    } catch (err: any) {
      const message = err?.message ?? "Something went wrong. Please try again.";
      setError(message);
      toast.error("Submission failed", { description: message, duration: 5000 });
    } finally {
      setLoading(false);
    }
  }

  return { submit, loading, error, success };
}
