'use client';

import { useState } from 'react';
import { Shield, Bell, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useMe, useForgotPassword } from '@/features/auth/hooks/useAuth';

// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({ title, description, children }: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-[12px] border border-gray-200 shadow-sm p-6">
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 mt-0.5 mb-5">{description}</p>
      {children}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { data: me } = useMe();
  const forgotPassword = useForgotPassword();

  const [resetSent, setResetSent]     = useState(false);
  const [emailPrefs, setEmailPrefs]   = useState({
    orderUpdates:   true,
    promotions:     false,
    productAlerts:  false,
  });

  async function handlePasswordReset() {
    await forgotPassword.mutateAsync(me?.email ?? '').catch(() => {});
    setResetSent(true);
  }

  return (
    <div className="space-y-5">
      <div className="mb-2">
        <h2 className="text-xl font-semibold text-gray-900">Account Settings</h2>
        <p className="text-sm text-gray-500 mt-0.5">Manage your security and notification preferences.</p>
      </div>

      {/* Security */}
      <Section
        title="Security"
        description="We&apos;ll send a password reset link to your registered email."
      >
        {resetSent ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-[12px]"
          >
            <CheckCircle2 size={18} className="text-green-500 shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-800">Reset link sent</p>
              <p className="text-xs text-green-600 mt-0.5">
                Check your inbox at <span className="font-semibold">{me?.email}</span>. Link expires in 30 minutes.
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center">
                <Shield size={16} className="text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Password</p>
                <p className="text-xs text-gray-500">Last changed: unknown</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePasswordReset}
              loading={forgotPassword.isPending}
            >
              Send Reset Link
            </Button>
          </div>
        )}
      </Section>

      {/* Email Preferences */}
      <Section
        title="Email Notifications"
        description="Choose which emails you want to receive from Raphamel."
      >
        <ul className="space-y-4">
          {(
            [
              {
                key: 'orderUpdates' as const,
                label: 'Order updates',
                description: 'Shipping confirmations, delivery alerts, and invoices.',
                locked: true,
              },
              {
                key: 'promotions' as const,
                label: 'Promotions & offers',
                description: 'Exclusive deals, flash sales, and discount codes.',
                locked: false,
              },
              {
                key: 'productAlerts' as const,
                label: 'Product restock alerts',
                description: 'Get notified when out-of-stock items become available.',
                locked: false,
              },
            ] as const
          ).map(({ key, label, description, locked }) => (
            <li key={key} className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <Bell size={15} className="text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-800">{label}</p>
                  <p className="text-xs text-gray-500">{description}</p>
                  {locked && (
                    <p className="text-[10px] text-gray-400 mt-0.5">Required — cannot be disabled</p>
                  )}
                </div>
              </div>
              <label className="flex items-center cursor-pointer shrink-0">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={emailPrefs[key]}
                    disabled={locked}
                    onChange={(e) =>
                      setEmailPrefs((p) => ({ ...p, [key]: e.target.checked }))
                    }
                  />
                  <div
                    className={`w-10 h-6 rounded-full transition-colors ${
                      emailPrefs[key] ? 'bg-primary' : 'bg-gray-200'
                    } ${locked ? 'opacity-60 cursor-not-allowed' : ''}`}
                    style={emailPrefs[key] ? { backgroundColor: 'var(--color-primary)' } : {}}
                  />
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      emailPrefs[key] ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </div>
              </label>
            </li>
          ))}
        </ul>

        <div className="mt-5">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              // Stub — wire to API when backend supports notification prefs
            }}
          >
            Save Preferences
          </Button>
        </div>
      </Section>

      {/* Account Deactivation */}
      <Section
        title="Danger Zone"
        description="Permanently deactivate your account. This action cannot be undone."
      >
        <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-[12px]">
          <AlertTriangle size={16} className="text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-rose-800">Deactivate account</p>
            <p className="text-xs text-rose-600 mt-1 leading-relaxed">
              To deactivate your Raphamel account, please contact us at{' '}
              <a
                href="mailto:support@raphamel.com"
                className="font-semibold underline hover:no-underline"
              >
                support@raphamel.com
              </a>
              . Your order history will be retained for legal and financial purposes.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
