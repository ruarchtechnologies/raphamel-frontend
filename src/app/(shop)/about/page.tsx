import type { Metadata } from 'next';
import { StaticPage } from '@/features/static/components/StaticPage';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Raphamel — Nigeria\'s B2B healthcare supply company.',
};

export default function AboutPage() {
  return (
    <StaticPage
      title="About Raphamel"
      subtitle="Nigeria's B2B healthcare company supplying NAFDAC-compliant medical products directly to hospitals, clinics, pharmacies and healthcare institutions."
      sections={[
        {
          heading: 'Who We Are',
          body: 'Raphamel is a B2B medical supply company built for healthcare institutions across Nigeria. We source, verify and deliver NAFDAC-compliant medical products — from hospital consumables and surgical equipment to diagnostic devices and PPE — directly to the facilities that need them.',
        },
        {
          heading: 'Our Mission',
          body: 'To make reliable, quality-assured medical procurement accessible to every healthcare institution in Nigeria, removing friction, reducing costs and ensuring supply chain compliance at every step.',
        },
        {
          heading: 'What We Offer',
          body: [
            'NAFDAC-compliant medical products across all major healthcare categories',
            'Verified procurement with transparent pricing and no hidden fees',
            'Cold-chain logistics and nationwide delivery',
            'Dedicated procurement support for hospitals, clinics and pharmacies',
            '14-day return policy and easy claims process',
          ],
        },
        {
          heading: 'Compliance & Verification',
          body: 'Every product listed on Raphamel is sourced from NAFDAC-registered importers and distributors. We verify all supplier documentation before onboarding and conduct periodic audits to maintain compliance standards.',
        },
        {
          heading: 'Contact Us',
          body: 'For procurement enquiries or partnership opportunities, reach us at info@raphamel.com or call +234 816 908 7630. Our team is available Monday to Friday, 8am to 6pm WAT.',
        },
      ]}
    />
  );
}
