'use client';

import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, Phone, Store, UserRound } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

const schema = z.object({
  firstName: z.string().min(2, 'First name required'),
  lastName:  z.string().min(2, 'Last name required'),
  email:     z.string().email('Invalid email'),
  phone:     z.string().optional(),
  password:  z.string().min(8, 'At least 8 characters'),
  role:      z.enum(['customer', 'vendor']),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState<'customer' | 'vendor'>('customer');

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'customer' },
  });

  const selectRole = (r: 'customer' | 'vendor') => {
    setRole(r);
    setValue('role', r);
  };

  const onSubmit = async (data: FormData) => {
    try {
      // await api.post('/auth/register', data);
      toast.success('Account created! Check your email to verify.');
    } catch {
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-lg"
    >
      <div className="bg-white rounded-[14px] shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-sm text-gray-500 mt-1">Join millions of Nigerians on Raphamel</p>
        </div>

        {/* Role selector */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {([
            { value: 'customer', label: 'Shop as Customer', icon: UserRound, desc: 'Buy from vendors' },
            { value: 'vendor',   label: 'Sell as Vendor',   icon: Store,      desc: 'Start your store' },
          ] as const).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => selectRole(opt.value)}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-[10px] border-2 transition-all text-center',
                role === opt.value
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300',
              )}
            >
              <opt.icon size={22} />
              <div>
                <p className="text-sm font-bold">{opt.label}</p>
                <p className="text-[11px] opacity-70 mt-0.5">{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              placeholder="Chidi"
              leftIcon={<User size={14} />}
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <Input
              label="Last Name"
              placeholder="Okafor"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>

          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            leftIcon={<Mail size={15} />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Phone number (optional)"
            type="tel"
            placeholder="+234 801 234 5678"
            leftIcon={<Phone size={15} />}
            error={errors.phone?.message}
            {...register('phone')}
          />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-gray-700">Password</label>
            </div>
            <Input
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
          </div>

          {role === 'vendor' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-blue-50 rounded-[8px] p-3 text-sm text-blue-700"
            >
              As a vendor, you&apos;ll need to verify your business documents (CAC certificate) after registration to start selling.
            </motion.div>
          )}

          <p className="text-xs text-gray-400">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
          </p>

          <Button type="submit" variant="primary" size="lg" className="w-full" loading={isSubmitting}>
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
