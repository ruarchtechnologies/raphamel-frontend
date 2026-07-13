'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Clock, XCircle } from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthLeftPanel } from '@/components/auth/AuthLeftPanel';
import { useLogin, useMe } from '@/features/auth/hooks/useAuth';
import type { AuthUser } from '@/data/api/auth.api';

const schema = z.object({
  email:    z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

type View = 'form' | 'pending' | 'rejected';

function getViewForUser(user: AuthUser): View | 'home' {
  if (user.verificationStatus === 'approved') return 'home';
  if (user.verificationStatus === 'rejected') return 'rejected';
  return 'pending';
}

function LoginPageContent() {
  const [showPass, setShowPass]   = useState(false);
  const [view, setView]           = useState<View>('form');
  const [rejectedUser, setRejectedUser] = useState<AuthUser | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') ?? '/';

  const { data: me, isLoading: meLoading } = useMe();
  const { mutate: signIn, isPending } = useLogin();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // If already logged in on mount — redirect or show status screen immediately
  useEffect(() => {
    if (meLoading || !me) return;
    const destination = getViewForUser(me);
    if (destination === 'home') {
      router.replace(returnTo);
    } else if (destination === 'rejected') {
      setRejectedUser(me);
      setView('rejected');
    } else {
      setView('pending');
    }
  }, [me, meLoading, router]);

  const onSubmit = (data: FormData) => {
    signIn(
      { email: data.email, password: data.password },
      {
        onSuccess: ({ user }) => {
          const destination = getViewForUser(user);
          if (destination === 'home') {
            router.push(returnTo);
          } else if (destination === 'rejected') {
            setRejectedUser(user);
            setView('rejected');
          } else {
            setView('pending');
          }
        },
      },
    );
  };

  // ── Shell wrapper shared across all views ──────────────────────────────────
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <AuthLeftPanel
        heading="Procurement that works at the speed of care."
        subheading="Sign in to manage your orders, track deliveries, and restock critical supplies."
      />

      <div className="flex flex-col min-h-screen bg-white overflow-hidden">
        {/* Mobile-only logo */}
        <div className="lg:hidden flex items-center gap-2 px-6 pt-6 pb-2">
          <Image src="/images/logo.png" alt="Raphamel" width={36} height={36} className="object-contain" priority />
          <span className="font-bold text-lg text-gray-900">Raphamel</span>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12 xl:px-16">

          {/* ── FORM VIEW ──────────────────────────────────────────────────── */}
          {view === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-[400px]"
            >
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Sign in</h1>
                <p className="text-sm text-gray-500">
                  Don&apos;t have an account?{' '}
                  <Link href="/register" className="font-semibold hover:underline" style={{ color: 'var(--color-primary)' }}>
                    Create one free
                  </Link>
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <Input
                  label="Email address"
                  type="email"
                  placeholder="you@hospital.ng"
                  leftIcon={<Mail size={15} />}
                  error={errors.email?.message}
                  {...register('email')}
                />

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">Password</label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium hover:underline"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="login-password"
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    leftIcon={<Lock size={15} />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="text-gray-400 hover:text-gray-700 transition-colors"
                      >
                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    }
                    error={errors.password?.message}
                    {...register('password')}
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full mt-2"
                  aria-label="Sign in"
                  loading={isPending}
                  rightIcon={<ArrowRight size={16} />}
                >
                  Sign In
                </Button>
              </form>
            </motion.div>
          )}

          {/* ── PENDING VIEW ───────────────────────────────────────────────── */}
          {view === 'pending' && (
            <motion.div
              key="pending"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-[420px] text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-50 mb-6">
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">Account under review</h1>
              <p className="text-gray-500 mb-6 leading-relaxed">
                Your account has been created and your documents are being reviewed by our team.
                You will receive an email once your account is approved — this usually takes 1–2 business days.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-[6px] p-4 mb-6 text-left">
                <p className="text-sm text-yellow-800 font-medium mb-1">What happens next?</p>
                <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                  <li>Our compliance team verifies your CAC and licence documents</li>
                  <li>You receive an approval email with login access</li>
                  <li>You can start placing orders immediately after approval</li>
                </ul>
              </div>
              <p className="text-xs text-gray-400">
                Questions?{' '}
                <a href="mailto:support@raphamel.com" className="hover:underline" style={{ color: 'var(--color-primary)' }}>
                  Contact support
                </a>
              </p>
            </motion.div>
          )}

          {/* ── REJECTED VIEW ──────────────────────────────────────────────── */}
          {view === 'rejected' && (
            <motion.div
              key="rejected"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-[420px] text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-50 mb-6">
                <XCircle className="h-8 w-8 text-rose-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">Application not approved</h1>
              <p className="text-gray-500 mb-6 leading-relaxed">
                Unfortunately, your account application was not approved after review.
                Please see the reason below and contact our support team if you believe this is an error.
              </p>

              {rejectedUser?.rejectionNotes && (
                <div className="bg-rose-50 border border-rose-200 rounded-[6px] p-4 mb-6 text-left">
                  <p className="text-sm font-medium text-rose-800 mb-1">Reason for rejection</p>
                  <p className="text-sm text-rose-700">{rejectedUser.rejectionNotes}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="primary"
                  asChild
                >
                  <a href="mailto:support@raphamel.com">Contact Support</a>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setView('form')}
                >
                  Try another account
                </Button>
              </div>
            </motion.div>
          )}

        </div>

        <footer className="text-center py-5 text-xs text-gray-400 border-t border-gray-100">
          © {new Date().getFullYear()} Raphamel ·{' '}
          <Link href="/privacy" className="hover:text-gray-700 transition-colors">Privacy</Link>
          {' '}·{' '}
          <Link href="/terms" className="hover:text-gray-700 transition-colors">Terms</Link>
        </footer>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageContent />
    </Suspense>
  );
}
