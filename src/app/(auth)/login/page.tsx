'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthLeftPanel } from '@/components/auth/AuthLeftPanel';
import { useLogin } from '@/features/auth/hooks/useAuth';

const schema = z.object({
  email:    z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();
  const { mutate: signIn, isPending } = useLogin();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    signIn(
      { email: data.email, password: data.password },
      { onSuccess: () => router.push('/') },
    );
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* ── Left brand panel ── */}
      <AuthLeftPanel
        heading="Procurement that works at the speed of care."
        subheading="Sign in to manage your orders, track deliveries, and restock critical supplies."
      />

      {/* ── Right form panel ── */}
      <div className="flex flex-col min-h-screen bg-white overflow-hidden">
        {/* Mobile-only logo */}
        <div className="lg:hidden flex items-center gap-2 px-6 pt-6 pb-2">
          <Image src="/images/logo.png" alt="Raphamel" width={36} height={36} className="object-contain" priority />
          <span className="font-bold text-lg text-gray-900">Raphamel</span>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12 xl:px-16">
          <motion.div
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
                loading={isPending}
                rightIcon={!isPending ? <ArrowRight size={16} /> : undefined}
              >
                Sign In
              </Button>
            </form>
          </motion.div>
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
