'use client';

import Link from 'next/link';
import {
  Eye, EyeOff, Mail, Lock, User, Phone,
  ArrowRight, ArrowLeft, Upload, X,
  Hospital, Pill, Store, CheckCircle2,
} from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthLeftPanel } from '@/components/auth/AuthLeftPanel';
import { cn } from '@/lib/utils';
import { useRegister } from '@/features/auth/hooks/useAuth';
import { sdk } from '@/lib/medusa';

// ── Step 1 schema ─────────────────────────────────────────────────────────────
const step1Schema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().min(10, 'Enter a valid phone number'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type Step1Data = z.infer<typeof step1Schema>;

// ── Facility types ────────────────────────────────────────────────────────────
const FACILITY_TYPES = [
  {
    value: 'hospital',
    label: 'Hospital',
    desc: 'General, specialist or teaching hospitals',
    icon: Hospital,
  },
  {
    value: 'pharmacy',
    label: 'Pharmacy',
    desc: 'Retail or hospital pharmacies',
    icon: Pill,
  },
  {
    value: 'patent-medicine-vendor',
    label: 'Patent Medicine Vendor',
    desc: 'Licensed PMV outlets',
    icon: Store,
  },
] as const;

type FacilityType = typeof FACILITY_TYPES[number]['value'];

// ── Step indicator ────────────────────────────────────────────────────────────
function StepDots({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              s === current
                ? 'w-6 bg-blue-600'
                : s < current
                  ? 'w-2 bg-blue-400'
                  : 'w-2 bg-gray-200',
            )}
          />
        </div>
      ))}
      <span className="ml-1 text-xs text-gray-400">Step {current} of 3</span>
    </div>
  );
}

// ── Slide variants ────────────────────────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
};

// ── Document upload sub-component ─────────────────────────────────────────────
interface FileUploadProps {
  label: string;
  accept?: string;
  file: File | null;
  onFile: (f: File | null) => void;
}

function FileUpload({ label, accept = '.pdf,.jpg,.jpeg,.png', file, onFile }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) onFile(dropped);
  }, [onFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    if (picked) onFile(picked);
  };

  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
      {file ? (
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-[6px]">
          <div className="flex items-center gap-2 min-w-0">
            <CheckCircle2 size={16} className="text-blue-600 flex-shrink-0" />
            <span className="text-sm text-gray-800 truncate">{file.name}</span>
            <span className="text-xs text-gray-400 flex-shrink-0">
              {(file.size / 1024).toFixed(0)} KB
            </span>
          </div>
          <button
            type="button"
            onClick={() => onFile(null)}
            className="text-gray-400 hover:text-gray-700 flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-[8px] py-6 px-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50/40 transition-all"
        >
          <Upload size={20} className="text-gray-400" />
          <p className="text-sm text-gray-500 text-center">
            <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-400">PDF, JPG, PNG — max 5 MB</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [facility, setFacility] = useState<FacilityType | null>(null);
  const [cacDoc, setCacDoc] = useState<File | null>(null);
  const [licenceDoc, setLicenceDoc] = useState<File | null>(null);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
  });

  const { mutate: signUp, isPending } = useRegister();

  const goTo = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  // Step 1 submit
  const onStep1 = (data: Step1Data) => {
    setStep1Data(data);
    goTo(2);
  };

  // Step 2 submit — uploads docs then creates the Medusa customer account
  const onStep2 = async () => {
    if (!facility) {
      toast.error('Please select your facility type.');
      return;
    }
    if (!cacDoc && !licenceDoc) {
      toast.error('Please upload at least one verification document.');
      return;
    }
    if (!step1Data) return;

    // 1. Upload documents to /store/customers/upload-docs
    let cacDocUrl: string | undefined;
    let licenceDocUrl: string | undefined;

    try {
      const form = new FormData();
      if (cacDoc)     form.append('files', cacDoc,     cacDoc.name);
      if (licenceDoc) form.append('files', licenceDoc, licenceDoc.name);

      const { urls } = await sdk.client.fetch<{ urls: string[] }>(
        '/store/customers/upload-docs',
        { method: 'POST', body: form },
      );

      if (cacDoc)     cacDocUrl     = urls[0];
      if (licenceDoc) licenceDocUrl = cacDoc ? urls[1] : urls[0];
    } catch {
      toast.error('Document upload failed. Please try again.');
      return;
    }

    // 2. Register account with document URLs saved to customer metadata
    signUp(
      {
        firstName: step1Data.firstName,
        lastName: step1Data.lastName,
        email: step1Data.email,
        password: step1Data.password,
        phone: step1Data.phone,
        facilityType: facility,
        cacDocUrl,
        licenceDocUrl,
      },
      { onSuccess: () => goTo(3) },
    );
  };

  const leftPanelProps = {
    1: {
      heading: 'Your supply chain, finally stress-free.',
      subheading: 'Create a free account and access thousands of verified medical products.',
    },
    2: {
      heading: 'Almost there — tell us about your facility.',
      subheading: 'We verify every account to keep our platform safe and NAFDAC-compliant.',
    },
    3: {
      heading: 'Your account is being reviewed.',
      subheading: 'Our team verifies every account within 24–48 hours.',
    },
  }[step]!;

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* ── Left brand panel ── */}
      <AuthLeftPanel heading={leftPanelProps.heading} subheading={leftPanelProps.subheading} />

      {/* ── Right form panel ── */}
      <div className="flex flex-col min-h-screen bg-white overflow-hidden">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 px-6 pt-6 pb-2">
          <Image src="/images/logo.png" alt="Raphamel" width={36} height={36} className="object-contain" priority />
          <span className="font-bold text-lg text-gray-900">Raphamel</span>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-10 lg:px-12 xl:px-16">
          <div className="w-full max-w-[420px]">
            <AnimatePresence mode="wait" custom={direction}>
              {/* ── STEP 1: Personal details ── */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div className="mb-6">
                    <StepDots current={1} />
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
                    <p className="text-sm text-gray-500">
                      Already registered?{' '}
                      <Link href="/login" className="font-semibold hover:underline" style={{ color: 'var(--color-primary)' }}>
                        Sign in
                      </Link>
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(onStep1)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="First name"
                        placeholder="Chidi"
                        leftIcon={<User size={14} />}
                        error={errors.firstName?.message}
                        {...register('firstName')}
                      />
                      <Input
                        label="Last name"
                        placeholder="Okafor"
                        error={errors.lastName?.message}
                        {...register('lastName')}
                      />
                    </div>

                    <Input
                      label="Phone number"
                      type="tel"
                      placeholder="+234 801 234 5678"
                      leftIcon={<Phone size={15} />}
                      error={errors.phone?.message}
                      {...register('phone')}
                    />

                    <Input
                      label="Email address"
                      type="email"
                      placeholder="you@hospital.ng"
                      leftIcon={<Mail size={15} />}
                      error={errors.email?.message}
                      {...register('email')}
                    />

                    <Input
                      label="Password"
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

                    <Input
                      label="Confirm password"
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

                    <p className="text-xs text-gray-400 pt-1">
                      By continuing you agree to our{' '}
                      <Link href="/terms" className="hover:underline" style={{ color: 'var(--color-primary)' }}>Terms</Link>
                      {' '}and{' '}
                      <Link href="/privacy" className="hover:underline" style={{ color: 'var(--color-primary)' }}>Privacy Policy</Link>.
                    </p>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full"
                      rightIcon={<ArrowRight size={16} />}
                    >
                      Continue
                    </Button>
                  </form>
                </motion.div>
              )}

              {/* ── STEP 2: Facility type + document upload ── */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div className="mb-6">
                    <StepDots current={2} />
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Verify your facility</h1>
                    <p className="text-sm text-gray-500">
                      This helps us ensure only licensed healthcare businesses access Raphamel.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Facility type picker */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2.5">Facility type</p>
                      <div className="grid grid-cols-1 gap-2.5">
                        {FACILITY_TYPES.map(({ value, label, desc, icon: Icon }) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setFacility(value)}
                            className={cn(
                              'flex items-center gap-4 px-4 py-3.5 rounded-[8px] border-2 text-left transition-all',
                              facility === value
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300',
                            )}
                          >
                            <div
                              className={cn(
                                'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors',
                                facility === value ? 'bg-blue-600' : 'bg-gray-100',
                              )}
                            >
                              <Icon size={16} className={facility === value ? 'text-white' : 'text-gray-500'} />
                            </div>
                            <div>
                              <p className={cn('text-sm font-semibold', facility === value ? 'text-blue-700' : 'text-gray-800')}>
                                {label}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                            </div>
                            {facility === value && (
                              <CheckCircle2 size={18} className="ml-auto text-blue-600 flex-shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Document upload */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Verification documents</p>
                        <p className="text-xs text-gray-400 mb-3">
                          Upload your CAC registration certificate and/or your operating licence. Both accepted.
                        </p>
                      </div>
                      <FileUpload
                        label="CAC Certificate"
                        file={cacDoc}
                        onFile={setCacDoc}
                      />
                      <FileUpload
                        label="Operating Licence"
                        file={licenceDoc}
                        onFile={setLicenceDoc}
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="flex-1"
                        leftIcon={<ArrowLeft size={16} />}
                        onClick={() => goTo(1)}
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        variant="primary"
                        size="lg"
                        className="flex-1"
                        rightIcon={<ArrowRight size={16} />}
                        loading={isPending}
                        onClick={onStep2}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 3: Registration complete ── */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <StepDots current={3} />

                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="flex flex-col items-center text-center py-4"
                  >
                    <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mb-6">
                      <CheckCircle2 size={36} className="text-green-500" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      Registration complete!
                    </h1>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-[320px]">
                      Your account has been created. Sign in to continue, our team will review your documents and activate full access within <strong className="text-gray-700">24–48 hours</strong>.
                    </p>

                    <div className="w-full mt-8">
                      <Button
                        variant="primary"
                        size="lg"
                        className="w-full"
                        rightIcon={<ArrowRight size={16} />}
                        asChild
                      >
                        <Link href="/login">Sign in to your account</Link>
                      </Button>
                    </div>

                    <p className="text-xs text-gray-400 mt-6">
                      Questions? Email us at{' '}
                      <a href="mailto:support@raphamel.ng" className="hover:underline" style={{ color: 'var(--color-primary)' }}>
                        support@raphamel.ng
                      </a>
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
