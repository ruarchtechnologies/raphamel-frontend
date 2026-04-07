'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, ArrowRight, ArrowLeft, Inbox } from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthLeftPanel } from '@/components/auth/AuthLeftPanel';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
});
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent]   = useState(false);
  const [email, setEmail] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // await api.post('/auth/forgot-password', { email: data.email });
    setEmail(data.email);
    setSent(true);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <AuthLeftPanel
        heading="Reset your password in seconds."
        subheading="Enter your email and we'll send you a secure link to create a new password."
      />

      <div className="flex flex-col min-h-screen bg-white overflow-hidden">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 px-6 pt-6 pb-2">
          <Image src="/images/logo.png" alt="Raphamel" width={36} height={36} className="object-contain" priority />
          <span className="font-bold text-lg text-gray-900">Raphamel</span>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12 xl:px-16">
          <AnimatePresence mode="wait">
            {!sent ? (
              /* ── Step 1: email entry ── */
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-[400px]"
              >
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-8"
                >
                  <ArrowLeft size={15} /> Back to sign in
                </Link>

                <div className="mb-8">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-5">
                    <Mail size={22} style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">Forgot password?</h1>
                  <p className="text-sm text-gray-500">
                    No worries — enter the email on your account and we&apos;ll send a reset link.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <Input
                    label="Email address"
                    type="email"
                    placeholder="you@hospital.ng"
                    leftIcon={<Mail size={15} />}
                    error={errors.email?.message}
                    {...register('email')}
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    loading={isSubmitting}
                    rightIcon={!isSubmitting ? <ArrowRight size={16} /> : undefined}
                  >
                    Send Reset Link
                  </Button>
                </form>
              </motion.div>
            ) : (
              /* ── Step 2: check email ── */
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-[400px] flex flex-col items-center text-center"
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-blue-50 border-2 border-blue-100 flex items-center justify-center mb-6"
                >
                  <Inbox size={36} style={{ color: 'var(--color-primary)' }} />
                </motion.div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your inbox</h1>
                <p className="text-sm text-gray-500 leading-relaxed max-w-[300px]">
                  We sent a password reset link to{' '}
                  <span className="font-semibold text-gray-800">{email}</span>.
                  It expires in 30 minutes.
                </p>

                <div className="w-full mt-8 p-4 bg-gray-50 rounded-[8px] text-left space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Didn&apos;t get the email?</p>
                  <ul className="text-sm text-gray-500 space-y-1 list-disc list-inside">
                    <li>Check your spam or junk folder</li>
                    <li>Make sure you typed the right address</li>
                    <li>
                      <button
                        type="button"
                        onClick={() => setSent(false)}
                        className="font-medium hover:underline"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        Try a different email
                      </button>
                    </li>
                  </ul>
                </div>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full mt-6"
                  asChild
                >
                  <Link href="/login">
                    <ArrowLeft size={15} className="mr-1.5" /> Back to sign in
                  </Link>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
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
