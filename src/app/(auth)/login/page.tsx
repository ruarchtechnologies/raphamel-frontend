'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Clock } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthLeftPanel } from '@/components/auth/AuthLeftPanel';
import { useAuthStore } from '@/stores/auth.store';

const schema = z.object({
  email:    z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPass, setShowPass]   = useState(false);
  const [loggedIn, setLoggedIn]   = useState(false);
  const login = useAuthStore((s) => s.login);

  const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // await api.post('/auth/login', data);
    login({ firstName: '', lastName: '', email: data.email });
    setLoggedIn(true);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* ── Left brand panel ── */}
      <AuthLeftPanel
        heading={
          loggedIn
            ? 'Your account is being reviewed.'
            : 'Procurement that works at the speed of care.'
        }
        subheading={
          loggedIn
            ? 'Our compliance team verifies every account within 24–48 hours.'
            : 'Sign in to manage your orders, track deliveries, and restock critical supplies.'
        }
      />

      {/* ── Right form panel ── */}
      <div className="flex flex-col min-h-screen bg-white overflow-hidden">
        {/* Mobile-only logo */}
        <div className="lg:hidden flex items-center gap-2 px-6 pt-6 pb-2">
          <Image src="/images/logo.png" alt="Raphamel" width={36} height={36} className="object-contain" priority />
          <span className="font-bold text-lg text-gray-900">Raphamel</span>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12 xl:px-16">
          <AnimatePresence mode="wait">
            {!loggedIn ? (
              /* ── Sign-in form ── */
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
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

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                      <label className="block text-sm font-medium text-gray-700">Password</label>
                      <Link
                        href="/forgot-password"
                        className="text-xs font-medium hover:underline"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Input
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
                    loading={isSubmitting}
                    rightIcon={!isSubmitting ? <ArrowRight size={16} /> : undefined}
                  >
                    Sign In
                  </Button>
                </form>
              </motion.div>
            ) : (
              /* ── Under review state ── */
              <motion.div
                key="review"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-[400px] flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center mb-6">
                  <Clock size={36} className="text-amber-500" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Account under review
                </h1>
                <p className="text-gray-500 text-sm leading-relaxed max-w-[320px]">
                  Welcome! Our compliance team is reviewing your documents and will activate your account within <strong className="text-gray-700">24–48 hours</strong>. You&apos;ll receive an email when you&apos;re approved.
                </p>

                <div className="w-full mt-8 space-y-3 text-left">
                  {[
                    { n: '01', text: 'Our team reviews your submitted documents' },
                    { n: '02', text: "You'll receive an approval email" },
                    { n: '03', text: 'Sign in and start procuring' },
                  ].map(({ n, text }) => (
                    <div key={n} className="flex items-start gap-3 px-4 py-3 bg-gray-50 rounded-[8px]">
                      <span className="text-xs font-bold text-gray-400 pt-0.5 flex-shrink-0">{n}</span>
                      <span className="text-sm text-gray-600">{text}</span>
                    </div>
                  ))}
                </div>

                <div className="w-full mt-8">
                  <Button variant="primary" size="lg" className="w-full" asChild>
                    <Link href="/">Browse the platform</Link>
                  </Button>
                </div>

                <p className="text-xs text-gray-400 mt-6">
                  Questions?{' '}
                  <a href="mailto:support@raphamel.ng" className="hover:underline" style={{ color: 'var(--color-primary)' }}>
                    support@raphamel.ng
                  </a>
                </p>
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
