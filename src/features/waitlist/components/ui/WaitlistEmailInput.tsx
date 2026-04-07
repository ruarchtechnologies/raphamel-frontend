// 'use client';

// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { SANS } from '../../fonts';

// export const schema = z.object({
//   email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
// });
// export type FormData = z.infer<typeof schema>;

// export interface WaitlistPayload {
//   email: string;
//   role: 'buyer'; // DISABLED: 'supplier' role removed — vendor/supplier feature removed
//   fullName: string;
//   phone?: string;
//   // Buyer fields
//   facilityName?: string;
//   facilityType?: string;
//   state?: string;
//   monthlySpend?: string;
//   topCategories?: string[];
//   // DISABLED: supplier-only fields removed — vendor/supplier feature removed
//   // companyName?: string;
//   // productCategories?: string[];
//   // nafdacStatus?: string;
//   // yearsInBusiness?: string;
// }

// export async function submitToSheets(payload: WaitlistPayload | string, role?: string): Promise<void> {
//   const webhookUrl = process.env.NEXT_PUBLIC_SHEETS_WEBHOOK_URL;
//   if (!webhookUrl) return;

//   const data: WaitlistPayload =
//     typeof payload === 'string'
//       ? { email: payload, role: (role as 'buyer' | 'supplier') ?? 'buyer', fullName: '' }
//       : payload;

//   await fetch(webhookUrl, {
//     method: 'POST',
//     body: JSON.stringify({ ...data, timestamp: new Date().toISOString() }),
//     mode: 'no-cors',
//   });
// }

// export function HeroEmailInput({ onSuccess, activeTab }: { onSuccess: () => void; activeTab: 'buyer' | 'supplier' }) {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<FormData>({ resolver: zodResolver(schema) });

//   const onSubmit = async (data: FormData) => {
//     try { await submitToSheets(data.email, activeTab); } catch { /* no-cors */ }
//     onSuccess();
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <div
//         className="flex flex-col sm:flex-row gap-2 p-1.5 rounded-2xl"
//         style={{
//           background: 'rgba(255,255,255,0.05)',
//           border: errors.email ? '1px solid rgba(244,63,94,0.5)' : '1px solid rgba(255,255,255,0.1)',
//           backdropFilter: 'blur(8px)',
//           transition: 'border-color 0.2s',
//         }}
//       >
//         <input
//           type="email"
//           placeholder="Enter your work email"
//           {...register('email')}
//           style={{ fontFamily: SANS }}
//           className="flex-1 h-11 px-4 bg-transparent rounded-xl text-white placeholder:text-[#64748B] focus:outline-none transition-all"
//           onFocus={(e) => {
//             const parent = e.currentTarget.closest('div') as HTMLDivElement;
//             if (parent) parent.style.borderColor = '#0071DC';
//           }}
//           onBlur={(e) => {
//             const parent = e.currentTarget.closest('div') as HTMLDivElement;
//             if (parent) parent.style.borderColor = errors.email ? 'rgba(244,63,94,0.5)' : 'rgba(255,255,255,0.1)';
//           }}
//         />
//         <button
//           type="submit"
//           disabled={isSubmitting}
//           style={{ fontFamily: SANS, background: '#0071DC', boxShadow: '0 4px 14px rgba(0,113,220,0.4)' }}
//           className="h-11 px-8 text-white font-semibold rounded-[10px] hover:bg-[#005BB5] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 whitespace-nowrap shrink-0"
//         >
//           {isSubmitting ? 'Joining...' : 'Join Waitlist'}
//         </button>
//       </div>
//       {errors.email && (
//         <p className="mt-1.5 text-xs text-rose-400 px-1" style={{ fontFamily: SANS }}>{errors.email.message}</p>
//       )}
//     </form>
//   );
// }

// export function CTAEmailInput({ onSuccess }: { onSuccess: () => void }) {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<FormData>({ resolver: zodResolver(schema) });

//   const onSubmit = async (data: FormData) => {
//     const referral = typeof window !== 'undefined' ? document.referrer || 'direct' : 'direct';
//     try { await submitToSheets(data.email, referral); } catch { /* no-cors */ }
//     onSuccess();
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <div
//         className="flex flex-col sm:flex-row gap-2 p-1.5 rounded-2xl justify-center"
//         style={{
//           background: 'rgba(255,255,255,0.05)',
//           border: errors.email ? '1px solid rgba(244,63,94,0.5)' : '1px solid rgba(255,255,255,0.1)',
//           backdropFilter: 'blur(8px)',
//           transition: 'border-color 0.2s',
//         }}
//       >
//         <input
//           type="email"
//           placeholder="Enter your work email"
//           {...register('email')}
//           style={{ fontFamily: SANS }}
//           className="flex-1 h-11 px-4 bg-transparent rounded-xl text-white placeholder:text-[#64748B] focus:outline-none transition-all"
//           onFocus={(e) => {
//             const parent = e.currentTarget.closest('div') as HTMLDivElement;
//             if (parent) parent.style.borderColor = '#FACC15';
//           }}
//           onBlur={(e) => {
//             const parent = e.currentTarget.closest('div') as HTMLDivElement;
//             if (parent) parent.style.borderColor = errors.email ? 'rgba(244,63,94,0.5)' : 'rgba(255,255,255,0.1)';
//           }}
//         />
//         <button
//           type="submit"
//           disabled={isSubmitting}
//           style={{ fontFamily: SANS, background: '#FACC15', color: '#0F172A', boxShadow: '0 4px 14px rgba(250,204,21,0.35)' }}
//           className="h-11 px-8 font-semibold rounded-[10px] hover:bg-[#EAB308] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 whitespace-nowrap shrink-0"
//         >
//           {isSubmitting ? 'Joining...' : 'Get Early Access'}
//         </button>
//       </div>
//       {errors.email && (
//         <p className="mt-1.5 text-xs text-rose-400 text-left px-1" style={{ fontFamily: SANS }}>{errors.email.message}</p>
//       )}
//     </form>
//   );
// }
