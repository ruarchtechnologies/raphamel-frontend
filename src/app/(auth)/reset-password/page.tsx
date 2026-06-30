'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Lock, ArrowRight, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthLeftPanel } from '@/components/auth/AuthLeftPanel';
import { useResetPassword } from '@/features/auth/hooks/useAuth';

const schema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (v: string) => v.length >= 8 },
  { label: 'One uppercase letter',  test: (v: string) => /[A-Z]/.test(v) },
  { label: 'One number',            test: (v: string) => /\d/.test(v) },
];

function ResetPasswordForm() {
  const [done, setDone]               = useState(false);
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const searchParams  = useSearchParams();
  const router        = useRouter();
  const token         = searchParams.get('token') ?? '';
  const email         = searchParams.get('email') ?? '';
  const resetPassword = useResetPassword();

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const pwd = watch('password', '');

  const invalidLink = !token || !email;

  const onSubmit = async (data: FormData) => {
    await resetPassword.mutateAsync({ token, email, password: data.password });
    setDone(true);
    // Redirect to login after a brief moment so the success animation plays
    setTimeout(() => router.push('/login'), 2000);
  };

  return (
    <AnimatePresence mode="wait">
      {invalidLink ? (
        /* ── Missing token or email in URL ── */
        <motion.div
          key="invalid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[400px] flex flex-col items-center text-center"
        >
          <div className="w-20 h-20 rounded-full bg-rose-50 border-2 border-rose-200 flex items-center justify-center mb-6">
            <AlertCircle size={36} className="text-rose-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid reset link</h1>
          <p className="text-sm text-gray-500 leading-relaxed max-w-[300px]">
            This link is missing required information. Please request a new password reset.
          </p>
          <Button variant="primary" size="lg" className="w-full mt-8" asChild>
            <Link href="/forgot-password">Request new link</Link>
          </Button>
        </motion.div>
      ) : !done ? (
        /* ── Reset form ── */
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-[400px]"
        >
          <div className="mb-8">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-5">
              <ShieldCheck size={22} style={{ color: 'var(--color-primary)' }} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Set new password</h1>
            <p className="text-sm text-gray-500">
              Choose a strong password you haven&apos;t used before.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="New password"
              type={showPass ? 'text' : 'password'}
              placeholder="Min 8 characters"
              leftIcon={<Lock size={15} />}
              rightIcon={
                <button type="button" onClick={() => setShowPass(!showPass)} className="text-gray-400 hover:text-gray-700">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
              error={errors.password?.message}
              {...register('password')}
            />

            {/* Strength indicators */}
            {pwd.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-1.5 px-1"
              >
                {PASSWORD_RULES.map(({ label, test }) => {
                  const passes = test(pwd);
                  return (
                    <li key={label} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${passes ? 'bg-green-500' : 'bg-gray-200'}`}>
                        {passes && <CheckCircle2 size={10} className="text-white" />}
                      </div>
                      <span className={`text-xs transition-colors ${passes ? 'text-green-600' : 'text-gray-400'}`}>
                        {label}
                      </span>
                    </li>
                  );
                })}
              </motion.ul>
            )}

            <Input
              label="Confirm new password"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repeat password"
              leftIcon={<Lock size={15} />}
              rightIcon={
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-gray-400 hover:text-gray-700">
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              loading={isSubmitting}
              rightIcon={!isSubmitting ? <ArrowRight size={16} /> : undefined}
            >
              Reset Password
            </Button>
          </form>
        </motion.div>
      ) : (
        /* ── Success state ── */
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[400px] flex flex-col items-center text-center"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.1 }}
            className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mb-6"
          >
            <CheckCircle2 size={36} className="text-green-500" />
          </motion.div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Password reset!</h1>
          <p className="text-sm text-gray-500 leading-relaxed max-w-[300px]">
            Your password has been updated. Redirecting you to sign in&hellip;
          </p>

          <Button
            variant="primary"
            size="lg"
            className="w-full mt-8"
            rightIcon={<ArrowRight size={16} />}
            asChild
          >
            <Link href="/login">Sign in now</Link>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <AuthLeftPanel
        heading="Create a strong new password."
        subheading="Your new password must be different from your previous one."
      />

      <div className="flex flex-col min-h-screen bg-white overflow-hidden">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 px-6 pt-6 pb-2">
          <Image src="/images/logo.png" alt="Raphamel" width={36} height={36} className="object-contain" priority />
          <span className="font-bold text-lg text-gray-900">Raphamel</span>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12 xl:px-16">
          <Suspense fallback={<div className="w-full max-w-[400px] animate-pulse space-y-4"><div className="h-12 bg-gray-100 rounded-[6px]" /><div className="h-10 bg-gray-100 rounded-[6px]" /><div className="h-10 bg-gray-100 rounded-[6px]" /></div>}>
            <ResetPasswordForm />
          </Suspense>
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
