'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { SANS, MONO } from '../fonts';
import { useWaitlistSubmit, type BuyerPayload } from '@/hooks/useWaitlistSubmit';
import { HEALTH_CATEGORIES } from '@/domain/entities/category.entity';

// ── Static data ──────────────────────────────────────────────────────────────

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT (Abuja)', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
  'Taraba', 'Yobe', 'Zamfara',
];

const CATEGORY_OPTIONS = HEALTH_CATEGORIES.map(c => ({ value: c.slug, label: c.name }));

// ── Schemas ──────────────────────────────────────────────────────────────────

const buyerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
  facilityName: z.string().min(2, 'Facility name is required'),
  facilityType: z.enum(['hospital', 'clinic', 'pharmacy', 'laboratory', 'ngo', 'other'], {
    errorMap: () => ({ message: 'Select a facility type' }),
  }),
  state: z.string().min(1, 'Select a state'),
  monthlySpend: z.enum(['under-500k', '500k-2m', '2m-10m', 'above-10m'], {
    errorMap: () => ({ message: 'Select estimated spend' }),
  }),
  topCategories: z.array(z.string()).min(1, 'Select at least one category'),
});

type BuyerFormData = z.infer<typeof buyerSchema>;

// ── Local primitives ─────────────────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{
      fontFamily: SANS, fontSize: '12px', fontWeight: 600,
      color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '8px',
      letterSpacing: '0.04em', textTransform: 'uppercase',
    }}>
      {children}
      {required && <span style={{ color: '#f87171', marginLeft: '3px' }}>*</span>}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p style={{ fontFamily: SANS, fontSize: '12px', color: '#f87171', marginTop: '5px' }}>
      {message}
    </p>
  );
}

function DarkInput({ error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return (
    <input
      {...props}
      style={{
        width: '100%',
        height: '48px',
        padding: '0 16px',
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${error ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: '12px',
        color: '#fff',
        fontFamily: SANS,
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      onFocus={e => {
        props.onFocus?.(e);
        e.currentTarget.style.borderColor = error ? 'rgba(248,113,113,0.7)' : '#0071DC';
        e.currentTarget.style.boxShadow = error ? '0 0 0 3px rgba(248,113,113,0.1)' : '0 0 0 3px rgba(0,113,220,0.12)';
      }}
      onBlur={e => {
        props.onBlur?.(e);
        e.currentTarget.style.borderColor = error ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.1)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    />
  );
}

function DarkSelect({ error, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: string }) {
  return (
    <select
      {...props}
      style={{
        width: '100%',
        height: '48px',
        padding: '0 36px 0 16px',
        background: '#0B1830',
        border: `1px solid ${error ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: '12px',
        color: props.value ? '#fff' : 'rgba(255,255,255,0.3)',
        fontFamily: SANS,
        fontSize: '14px',
        outline: 'none',
        cursor: 'pointer',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 14px center',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s',
      }}

      onFocus={(e) => props.onFocus?.(e)}
      onBlur={(e) => props.onBlur?.(e)}
    >
      {children}
    </select>
  );
}

function DarkRadioGroup({
  options,
  value,
  onChange,
  error,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {options.map(opt => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              style={{
                padding: '8px 18px',
                borderRadius: '999px',
                border: `1px solid ${active ? 'rgba(0,113,220,0.6)' : 'rgba(255,255,255,0.1)'}`,
                background: active
                  ? 'linear-gradient(135deg, rgba(0,113,220,0.25) 0%, rgba(0,87,184,0.2) 100%)'
                  : 'rgba(255,255,255,0.03)',
                color: active ? '#93C5FD' : 'rgba(255,255,255,0.45)',
                fontFamily: SANS,
                fontSize: '13px',
                fontWeight: active ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                boxShadow: active ? '0 0 0 1px rgba(0,113,220,0.25) inset' : 'none',
              }}
            >
              {active && (
                <span style={{ marginRight: '5px', fontSize: '10px', color: '#60A5FA' }}>●</span>
              )}
              {opt.label}
            </button>
          );
        })}
      </div>
      {error && <FieldError message={error} />}
    </div>
  );
}

function DarkCheckboxGroup({
  options,
  value,
  onChange,
  error,
}: {
  options: { value: string; label: string }[];
  value: string[];
  onChange: (v: string[]) => void;
  error?: string;
}) {
  const toggle = (v: string) => {
    if (value.includes(v)) onChange(value.filter(x => x !== v));
    else onChange([...value, v]);
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
        {options.map(opt => {
          const checked = value.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              style={{
                padding: '6px 13px',
                borderRadius: '8px',
                border: `1px solid ${checked ? 'rgba(0,113,220,0.5)' : 'rgba(255,255,255,0.09)'}`,
                background: checked
                  ? 'linear-gradient(135deg, rgba(0,113,220,0.2) 0%, rgba(0,87,184,0.15) 100%)'
                  : 'rgba(255,255,255,0.025)',
                color: checked ? '#93C5FD' : 'rgba(255,255,255,0.4)',
                fontFamily: SANS,
                fontSize: '12px',
                fontWeight: checked ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {checked && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {opt.label}
            </button>
          );
        })}
      </div>
      {error && <FieldError message={error} />}
    </div>
  );
}

// ── Submit button ─────────────────────────────────────────────────────────────

function SubmitBtn({ loading }: { loading: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      style={{
        width: '100%',
        height: '54px',
        background: loading
          ? 'rgba(0,113,220,0.5)'
          : 'linear-gradient(135deg, #0071DC 0%, #005BB5 100%)',
        color: '#fff',
        fontFamily: SANS,
        fontSize: '15px',
        fontWeight: 700,
        border: 'none',
        borderRadius: '14px',
        cursor: loading ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        transition: 'transform 0.15s ease, box-shadow 0.2s ease',
        boxShadow: loading ? 'none' : '0 8px 32px rgba(0,113,220,0.4), 0 2px 8px rgba(0,0,0,0.3)',
        marginTop: '8px',
        letterSpacing: '0.01em',
      }}
      onMouseEnter={e => {
        if (!loading) {
          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 40px rgba(0,113,220,0.55), 0 4px 12px rgba(0,0,0,0.3)';
        }
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLButtonElement).style.boxShadow = loading ? 'none' : '0 8px 32px rgba(0,113,220,0.4), 0 2px 8px rgba(0,0,0,0.3)';
      }}
    >
      {loading ? (
        <>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
            <circle cx="10" cy="10" r="8" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" />
            <path d="M10 2a8 8 0 0 1 8 8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          Submitting…
        </>
      ) : (
        <>
          Reserve My Early Access
          <ArrowRight size={16} />
        </>
      )}
    </button>
  );
}

// ── Buyer Form ────────────────────────────────────────────────────────────────

function BuyerForm({ onSuccess }: { onSuccess: () => void }) {
  const { submit, loading, error } = useWaitlistSubmit();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BuyerFormData>({
    resolver: zodResolver(buyerSchema),
    mode: 'onTouched',
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      facilityName: '',
      facilityType: undefined,
      state: '',
      monthlySpend: undefined,
      topCategories: [],
    },
  });

  const onSubmit = async (data: BuyerFormData) => {
    const payload: BuyerPayload = {
      type: 'buyer',
      fullName: data.fullName,
      workEmail: data.email,
      phone: data.phone,
      facilityName: data.facilityName,
      facilityType: data.facilityType,
      state: data.state,
      monthlySpend: data.monthlySpend,
      categories: data.topCategories,
    };
    await submit(payload);
    onSuccess();
  };

  const col2Mobile = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' } as React.CSSProperties;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Name + Email */}
        <div style={col2Mobile}>
          <div>
            <FieldLabel required>Full Name</FieldLabel>
            <DarkInput {...register('fullName')} placeholder="Dr. Amara Okafor" error={errors.fullName?.message} />
            <FieldError message={errors.fullName?.message} />
          </div>
          <div>
            <FieldLabel required>Work Email</FieldLabel>
            <DarkInput {...register('email')} type="email" placeholder="amara@hospital.ng" error={errors.email?.message} />
            <FieldError message={errors.email?.message} />
          </div>
        </div>

        {/* Phone + Facility Name */}
        <div style={col2Mobile}>
          <div>
            <FieldLabel>Phone Number <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>(optional)</span></FieldLabel>
            <DarkInput {...register('phone')} type="tel" placeholder="+234 801 234 5678" />
          </div>
          <div>
            <FieldLabel required>Facility / Hospital Name</FieldLabel>
            <DarkInput {...register('facilityName')} placeholder="Lagos University Teaching Hospital" error={errors.facilityName?.message} />
            <FieldError message={errors.facilityName?.message} />
          </div>
        </div>

        {/* Facility Type + State */}
        <div style={col2Mobile}>
          <div>
            <FieldLabel required>Facility Type</FieldLabel>
            <Controller
              name="facilityType"
              control={control}
              defaultValue={undefined}
              render={({ field }) => (
                <DarkSelect {...field} value={field.value ?? ''} error={errors.facilityType?.message}>
                  <option value="" disabled>Select type…</option>
                  <option value="hospital">Hospital</option>
                  <option value="clinic">Clinic</option>
                  <option value="pharmacy">Pharmacy</option>
                  <option value="laboratory">Laboratory</option>
                  <option value="ngo">NGO / Health Programme</option>
                  <option value="other">Other</option>
                </DarkSelect>
              )}
            />
            <FieldError message={errors.facilityType?.message} />
          </div>
          <div>
            <FieldLabel required>State</FieldLabel>
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <DarkSelect {...field} value={field.value ?? ''} error={errors.state?.message}>
                  <option value="" disabled>Select state…</option>
                  {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </DarkSelect>
              )}
            />
            <FieldError message={errors.state?.message} />
          </div>
        </div>

        {/* Monthly Spend */}
        <div>
          <FieldLabel required>Estimated Monthly Supply Spend</FieldLabel>
          <Controller
            name="monthlySpend"
            control={control}
            render={({ field }) => (
              <DarkRadioGroup
                options={[
                  { value: 'under-500k', label: 'Under ₦500k' },
                  { value: '500k-2m', label: '₦500k – ₦2m' },
                  { value: '2m-10m', label: '₦2m – ₦10m' },
                  { value: 'above-10m', label: 'Above ₦10m' },
                ]}
                value={field.value ?? ''}
                onChange={field.onChange}
                error={errors.monthlySpend?.message}
              />
            )}
          />
        </div>

        {/* Categories */}
        <div>
          <FieldLabel required>Top Categories You Source</FieldLabel>
          <Controller
            name="topCategories"
            control={control}
            render={({ field }) => (
              <DarkCheckboxGroup
                options={CATEGORY_OPTIONS}
                value={field.value ?? []}
                onChange={field.onChange}
                error={errors.topCategories?.message}
              />
            )}
          />
        </div>

        {error && <FieldError message={error} />}
        <SubmitBtn loading={loading} />
      </div>
    </form>
  );
}

// ── Success state ─────────────────────────────────────────────────────────────

function SuccessConfirmation() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: 'clamp(40px, 8vw, 80px) 24px',
        gap: '24px',
      }}
    >
      {/* Animated check ring */}
      <div style={{ position: 'relative', width: '80px', height: '80px' }}>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 70%)',
            border: '1px solid rgba(34,197,94,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CheckCircle size={38} color="#22C55E" strokeWidth={1.5} />
        </motion.div>
        {/* Outer pulsing ring */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0.6 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 1.2, delay: 0.3, repeat: Infinity, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '1px solid rgba(34,197,94,0.4)',
            pointerEvents: 'none',
          }}
        />
      </div>

      <div>
        <h3 style={{
          fontFamily: SANS,
          fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
          fontWeight: 800,
          color: '#fff',
          marginBottom: '10px',
          letterSpacing: '-0.025em',
        }}>
          {"You're on the list!"}
        </h3>
        <p style={{
          fontFamily: SANS,
          fontSize: '15px',
          color: 'rgba(255,255,255,0.5)',
          lineHeight: 1.7,
          maxWidth: '400px',
        }}>
          {"We'll reach out as we approach launch with early access details and exclusive pricing for healthcare facilities."}
        </p>
      </div>

    </motion.div>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────

export function EarlyAccessSection() {
  const [submitted, setSubmitted] = useState(false);
  const [panelUnoptimized, setPanelUnoptimized] = useState(false);

  return (
    <section
      id="early-access"
      style={{
        background: 'linear-gradient(135deg, #060E1C 0%, #0A1628 50%, #0E2444 100%)',
        padding: 'clamp(48px, 7vw, 96px) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.06,
        backgroundImage: 'linear-gradient(to right, #0071DC 1px, transparent 1px), linear-gradient(to bottom, #0071DC 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />
      {/* Blue glow — top left */}
      <div style={{
        position: 'absolute', top: '-140px', left: '-100px',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'rgba(0,113,220,0.16)', filter: 'blur(140px)',
        pointerEvents: 'none',
      }} />
      {/* Yellow glow — bottom right */}
      <div style={{
        position: 'absolute', bottom: '-120px', right: '-80px',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'rgba(250,204,21,0.07)', filter: 'blur(120px)',
        pointerEvents: 'none',
      }} />

      <div style={{ padding: '0 clamp(24px, 5vw, 80px)', position: 'relative', zIndex: 1 }}>
        <div className="ea-split">

          {/* ── Left: image panel ── */}
          <div
            className="ea-img-col"
            style={{ borderRadius: '24px', overflow: 'hidden', height: '460px', alignSelf: 'flex-start', position: 'sticky', top: '40px' }}
          >
            <div style={{ position: 'relative', width: '100%', height: '560px' }}>
              <Image
                src="/images/early-access-left.png"
                alt=""
                fill
                sizes="(max-width: 1024px) 0px, 52vw"
                style={{ objectFit: 'cover', objectPosition: '75% center' }}
                unoptimized={panelUnoptimized}
                onError={() => setPanelUnoptimized(true)}
              />
            </div>
          </div>

          {/* ── Right: form card ── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              background: 'linear-gradient(160deg, #080F1E 0%, #0B1830 50%, #0D2040 100%)',
              borderRadius: '32px',
              padding: 'clamp(36px, 5vw, 64px)',
              border: '1px solid rgba(255,255,255,0.07)',
              position: 'relative',
              overflow: 'hidden',
              height: '100%',
              boxSizing: 'border-box',
            }}>
              {/* Top accent line */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                background: 'linear-gradient(to right, transparent 5%, rgba(0,113,220,0.55) 35%, rgba(250,204,21,0.35) 65%, transparent 95%)',
                pointerEvents: 'none',
              }} />

              {/* Inner ambient glow */}
              <div style={{
                position: 'absolute', top: '-80px', right: '-80px',
                width: '340px', height: '340px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0,113,220,0.08) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <SuccessConfirmation />
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                    {/* Header */}
                    <div style={{ marginBottom: 'clamp(28px, 4vw, 44px)' }}>

                      <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55, delay: 0.05 }}
                        style={{
                          fontFamily: SANS,
                          fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                          fontWeight: 800,
                          color: '#fff',
                          letterSpacing: '-0.025em',
                          lineHeight: 1.15,
                          margin: 0,
                          marginBottom: '20px',
                        }}
                      >
                        Reserve Your{' '}
                        <span style={{ color: '#FACC15' }}>Early Access</span>
                      </motion.h2>

                      <motion.p
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        style={{
                          fontFamily: SANS,
                          fontSize: '14px',
                          color: 'rgba(255,255,255,0.45)',
                          lineHeight: 1.7,
                          maxWidth: '460px',
                          margin: 0,
                        }}
                      >
                        Tell us about your facility so we can tailor your early access experience.
                      </motion.p>
                    </div>

                    <BuyerForm onSuccess={() => setSubmitted(true)} />

                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
