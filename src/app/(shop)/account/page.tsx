'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  Phone, Mail, Building2, CheckCircle2, Clock, XCircle, FileText, CreditCard,
} from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useMe, useUpdateProfile } from '@/features/auth/hooks/useAuth';
import { setStatusCookie } from '@/lib/auth-cookie';
import type { AuthUser } from '@/data/api/auth.api';

// ── Zod schema ────────────────────────────────────────────────────────────────

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName:  z.string().min(1, 'Last name is required'),
  phone:     z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

// ── Verification status badge ─────────────────────────────────────────────────

const STATUS_CONFIG = {
  approved: {
    label: 'Verified',
    icon:  CheckCircle2,
    variant: 'green' as const,
  },
  pending: {
    label: 'Under Review',
    icon:  Clock,
    variant: 'yellow' as const,
  },
  rejected: {
    label: 'Not Approved',
    icon:  XCircle,
    variant: 'red' as const,
  },
  not_submitted: {
    label: 'Pending Submission',
    icon:  Clock,
    variant: 'yellow' as const,
  },
} satisfies Record<AuthUser['verificationStatus'], { label: string; icon: React.ElementType; variant: 'green' | 'yellow' | 'red' }>;

function VerificationBadge({ status }: { status: AuthUser['verificationStatus'] }) {
  const { label, icon: Icon, variant } = STATUS_CONFIG[status];
  return (
    <Badge variant={variant} className="flex items-center gap-1.5 px-2.5 py-1">
      <Icon size={12} />
      {label}
    </Badge>
  );
}

// ── Section wrapper — reusable card shell ─────────────────────────────────────

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-[6px] border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ── Info row — reusable read-only field display ───────────────────────────────

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string | null }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={15} className="text-gray-500" />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-sm text-gray-900 mt-0.5">{value || '—'}</p>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AccountProfilePage() {
  const router = useRouter();
  const { data: me, isLoading } = useMe();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const [mounted, setMounted] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => { setMounted(true); }, []);

  // Populate form + sync status cookie when user data loads
  useEffect(() => {
    if (me) {
      reset({
        firstName: me.firstName,
        lastName:  me.lastName,
        phone:     me.phone ?? '',
      });
      setStatusCookie(me.verificationStatus);
    }
  }, [me, reset]);

  // Stale cookie — Medusa session expired. Clear cookie and send to login.
  useEffect(() => {
    if (mounted && !isLoading && !me) {
      document.cookie = 'raphamel_auth=; path=/; max-age=0';
      router.replace('/login');
    }
  }, [mounted, isLoading, me, router]);

  function onSubmit(data: FormValues) {
    updateProfile({
      firstName: data.firstName,
      lastName:  data.lastName,
      phone:     data.phone || undefined,
    });
  }

  // Show skeleton on server AND on client first-render (before mount) so both sides
  // agree on the initial HTML — prevents hydration mismatch caused by useQuery
  // resolving instantly on the client while the server rendered a loading state.
  if (!mounted || isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-[6px] border border-gray-200 h-48 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!me) return null;

  // ── Non-approved gate ─────────────────────────────────────────────────────────
  if (me.verificationStatus !== 'approved') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-lg mx-auto"
      >
        <div className="bg-white rounded-[6px] border border-gray-200 shadow-sm p-8 text-center">
          {me.verificationStatus === 'rejected' ? (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-50 mb-5">
                <XCircle className="h-8 w-8 text-rose-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Application not approved</h2>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                Your account application was not approved after review.
              </p>
              {me.rejectionNotes && (
                <div className="bg-rose-50 border border-rose-200 rounded-[6px] p-4 mb-6 text-left">
                  <p className="text-sm font-medium text-rose-800 mb-1">Reason</p>
                  <p className="text-sm text-rose-700">{me.rejectionNotes}</p>
                </div>
              )}
              <a
                href="mailto:support@raphamel.com"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-[6px] text-sm font-medium text-white"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Contact Support
              </a>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-50 mb-5">
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Account under review</h2>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Your documents are being reviewed by our compliance team.
                You&apos;ll receive an email once approved — usually within 1–2 business days.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-[6px] p-4 text-left mb-6">
                <p className="text-sm font-medium text-yellow-800 mb-2">Submitted details</p>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li><span className="font-medium">Name:</span> {me.firstName} {me.lastName}</li>
                  <li><span className="font-medium">Email:</span> {me.email}</li>
                  {me.facilityType && (
                    <li>
                      <span className="font-medium">Facility:</span>{' '}
                      {me.facilityType === 'hospital' ? 'Hospital'
                        : me.facilityType === 'pharmacy' ? 'Pharmacy'
                        : 'Patent Medicine Vendor'}
                    </li>
                  )}
                  {me.cacDocUrl && <li><span className="font-medium">Document:</span> CAC Certificate</li>}
                  {me.licenceDocUrl && <li><span className="font-medium">Document:</span> Operating Licence</li>}
                </ul>
              </div>
              <p className="text-xs text-gray-400">
                Questions?{' '}
                <a href="mailto:support@raphamel.com" className="underline" style={{ color: 'var(--color-primary)' }}>
                  support@raphamel.com
                </a>
              </p>
            </>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* ── Profile header ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-[6px] border border-gray-200 shadow-sm p-6 flex items-center gap-5">
        {/* Avatar */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shrink-0 bg-primary/10"
          style={{ color: 'var(--color-primary)' }}
        >
          {`${me.firstName.charAt(0)}${me.lastName.charAt(0)}`.toUpperCase()}
        </div>

        {/* Name + status */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-gray-900">
              {me.firstName} {me.lastName}
            </h1>
            <VerificationBadge status={me.verificationStatus} />
          </div>
          <p className="text-sm text-gray-500">{me.email}</p>
        </div>
      </div>

      {/* ── Rejection notice (only when rejected) ──────────────────────────── */}
      {me.rejectionNotes && (
        <div className="bg-rose-50 border border-rose-200 rounded-[6px] p-4 flex gap-3">
          <XCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-rose-800">Application not approved</p>
            <p className="text-sm text-rose-700 mt-0.5">{me.rejectionNotes}</p>
            <p className="text-xs text-rose-500 mt-2">
              Contact{' '}
              <a href="mailto:support@raphamel.com" className="underline font-medium">
                support@raphamel.com
              </a>{' '}
              if you believe this is an error.
            </p>
          </div>
        </div>
      )}

      {/* ── Edit personal information ───────────────────────────────────────── */}
      <Section
        title="Personal Information"
        description="Update your name and phone number."
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First name"
              placeholder="John"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <Input
              label="Last name"
              placeholder="Doe"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>

          <Input
            label="Phone number"
            type="tel"
            placeholder="+234 800 000 0000"
            leftIcon={<Phone size={15} />}
            error={errors.phone?.message}
            {...register('phone')}
          />

          {/* Email is read-only — changing email requires a separate flow */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email address
            </label>
            <div className="input-base flex items-center gap-2 bg-gray-50 text-gray-500 cursor-not-allowed select-none">
              <Mail size={15} className="shrink-0 text-gray-400" />
              {me.email}
            </div>
            <p className="mt-1 text-xs text-gray-400">
              Email changes require identity verification — contact{' '}
              <a href="mailto:support@raphamel.com" className="underline" style={{ color: 'var(--color-primary)' }}>
                support@raphamel.com
              </a>
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              loading={isPending}
              disabled={!isDirty}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Section>

      {/* ── Account details (read-only) ─────────────────────────────────────── */}
      <Section
        title="Account Details"
        description="Information submitted during registration."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InfoRow
            icon={Building2}
            label="Facility type"
            value={
              me.facilityType === 'hospital' ? 'Hospital'
              : me.facilityType === 'pharmacy' ? 'Pharmacy'
              : me.facilityType === 'patent-medicine-vendor' ? 'Patent Medicine Vendor'
              : undefined
            }
          />
          <InfoRow
            icon={CreditCard}
            label="Payment window"
            value={
              me.creditTerm === '30' ? 'Less than 30 days'
              : me.creditTerm === '60' ? 'Less than 60 days'
              : undefined
            }
          />
          {me.cacDocUrl && (
            <InfoRow icon={FileText} label="Verification document" value="CAC Certificate" />
          )}
          {me.licenceDocUrl && (
            <InfoRow icon={FileText} label="Verification document" value="Operating Licence" />
          )}
          {!me.cacDocUrl && !me.licenceDocUrl && (
            <InfoRow icon={FileText} label="Verification document" value="None on file" />
          )}
        </div>
        <p className="text-xs text-gray-400 mt-6">
          To update your business documents, contact{' '}
          <a href="mailto:support@raphamel.com" className="underline" style={{ color: 'var(--color-primary)' }}>
            support@raphamel.com
          </a>
          .
        </p>
      </Section>
    </motion.div>
  );
}
