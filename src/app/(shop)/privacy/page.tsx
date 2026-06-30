import type { Metadata } from 'next';
import { StaticPage } from '@/features/static/components/StaticPage';

export const metadata: Metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPage() {
  return (
    <StaticPage
      title="Privacy Policy"
      subtitle="How we collect, use and protect your information."
      lastUpdated="June 2026"
      sections={[
        {
          heading: 'Information We Collect',
          body: [
            'Account information: name, email address, phone number and facility details provided during registration',
            'Order data: purchase history, delivery addresses and payment records',
            'Verification documents: CAC certificates and operating licences submitted for account approval',
            'Usage data: pages visited, search queries and feature interactions to improve the platform',
          ],
        },
        {
          heading: 'How We Use Your Information',
          body: [
            'To process and fulfil your orders',
            'To verify your business identity and maintain platform compliance',
            'To communicate order updates, account notifications and support responses',
            'To improve our product catalogue and platform experience',
          ],
        },
        {
          heading: 'Data Sharing',
          body: 'We do not sell your personal data to third parties. We may share necessary order information with logistics partners to fulfil deliveries. Verification documents are used solely for compliance purposes and are not shared externally.',
        },
        {
          heading: 'Data Security',
          body: 'We use industry-standard encryption and access controls to protect your data. Verification documents are stored securely and accessible only to authorised compliance personnel.',
        },
        {
          heading: 'Your Rights',
          body: [
            'Request access to the personal data we hold about you',
            'Request correction of inaccurate information',
            'Request deletion of your account and associated data',
            'Withdraw consent for marketing communications at any time',
          ],
        },
        {
          heading: 'Contact',
          body: 'For privacy-related requests or questions, contact us at info@raphamel.com.',
        },
      ]}
    />
  );
}
