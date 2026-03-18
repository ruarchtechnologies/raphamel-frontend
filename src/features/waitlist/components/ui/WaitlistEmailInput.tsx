'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SANS } from '../../fonts';

export const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
});
export type FormData = z.infer<typeof schema>;

export async function submitToSheets(email: string, referral: string): Promise<void> {
  const webhookUrl = process.env.NEXT_PUBLIC_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) return;
  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ email, timestamp: new Date().toISOString(), referral }),
    mode: 'no-cors',
  });
}

export function HeroEmailInput({ onSuccess, activeTab }: { onSuccess: () => void; activeTab: 'buyer' | 'supplier' }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    const referral = typeof window !== 'undefined' ? document.referrer || 'direct' : 'direct';
    try { await submitToSheets(data.email, referral); } catch { /* no-cors */ }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          placeholder="Enter your work email"
          {...register('email')}
          style={{ fontFamily: SANS, border: errors.email ? '1px solid rgba(244,63,94,0.6)' : '1px solid #334155' }}
          className="flex-1 h-12 px-4 bg-transparent rounded-md text-white placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#0071DC]/20 transition-all"
          onFocus={(e) => { e.currentTarget.style.borderColor = '#0071DC'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = errors.email ? 'rgba(244,63,94,0.6)' : '#334155'; }}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          style={{ fontFamily: SANS, background: '#0071DC' }}
          className="h-12 px-8 text-white font-semibold rounded-md hover:bg-[#005BB5] transition-all duration-150 disabled:opacity-60 whitespace-nowrap shrink-0"
        >
          {isSubmitting ? 'Joining...' : 'Join Waitlist'}
        </button>
      </div>
      {errors.email && (
        <p className="mt-1.5 text-xs text-rose-400" style={{ fontFamily: SANS }}>{errors.email.message}</p>
      )}
    </form>
  );
}

export function CTAEmailInput({ onSuccess }: { onSuccess: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    const referral = typeof window !== 'undefined' ? document.referrer || 'direct' : 'direct';
    try { await submitToSheets(data.email, referral); } catch { /* no-cors */ }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <input
          type="email"
          placeholder="Enter your work email"
          {...register('email')}
          style={{ fontFamily: SANS, border: errors.email ? '1px solid rgba(244,63,94,0.6)' : '1px solid #334155' }}
          className="flex-1 h-12 px-4 bg-transparent rounded-md text-white placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#0071DC]/20 transition-all"
          onFocus={(e) => { e.currentTarget.style.borderColor = '#0071DC'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = errors.email ? 'rgba(244,63,94,0.6)' : '#334155'; }}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          style={{ fontFamily: SANS, background: '#FACC15', color: '#0F172A' }}
          className="h-12 px-8 font-semibold rounded-md hover:bg-[#EAB308] hover:scale-[1.03] transition-all duration-150 disabled:opacity-60 whitespace-nowrap shrink-0"
        >
          {isSubmitting ? 'Joining...' : 'Get Early Access'}
        </button>
      </div>
      {errors.email && (
        <p className="mt-1.5 text-xs text-rose-400 text-left" style={{ fontFamily: SANS }}>{errors.email.message}</p>
      )}
    </form>
  );
}
