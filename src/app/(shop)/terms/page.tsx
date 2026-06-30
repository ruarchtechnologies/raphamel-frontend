import type { Metadata } from 'next';
import { StaticPage } from '@/features/static/components/StaticPage';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
};

export default function TermsPage() {
  return (
    <StaticPage
      title="Terms & Conditions"
      subtitle="Please read these terms carefully before using the Raphamel platform."
      lastUpdated="June 2026"
      sections={[
        {
          heading: 'Eligibility',
          body: 'Raphamel is a B2B platform available exclusively to registered healthcare businesses in Nigeria, including hospitals, clinics, pharmacies and patent medicine vendors. By creating an account you confirm that you represent a legally registered business entity.',
        },
        {
          heading: 'Account Verification',
          body: 'All accounts are subject to verification before full platform access is granted. You must provide accurate business documents including CAC certificates or operating licences. Raphamel reserves the right to reject or suspend accounts that fail verification.',
        },
        {
          heading: 'Orders & Pricing',
          body: [
            'All prices are listed in Nigerian Naira (NGN) and are exclusive of delivery fees unless stated',
            'Orders are confirmed only after successful payment or approved credit arrangement',
            'Raphamel reserves the right to cancel orders affected by pricing errors or stock unavailability',
            'Bulk pricing and institutional credit terms are available for verified accounts — contact support for details',
          ],
        },
        {
          heading: 'Delivery',
          body: 'Delivery timelines vary by location and product category. Estimated delivery windows are provided at checkout. Raphamel is not liable for delays caused by logistics partners, force majeure or inaccurate delivery information provided by the buyer.',
        },
        {
          heading: 'Returns & Claims',
          body: 'Products may be returned within 14 days of delivery if they are unused, in original packaging and accompanied by proof of purchase. Products damaged in transit or incorrectly supplied must be reported within 48 hours of delivery. Returns for regulated or cold-chain products are subject to additional conditions.',
        },
        {
          heading: 'Prohibited Use',
          body: [
            'Reselling products to unlicensed third parties',
            'Submitting false verification documents',
            'Using the platform for any activity that violates NAFDAC regulations or Nigerian law',
            'Attempting to manipulate pricing, reviews or procurement records',
          ],
        },
        {
          heading: 'Limitation of Liability',
          body: 'Raphamel is a procurement platform and is not liable for clinical outcomes arising from the use of purchased products. All products are sourced from NAFDAC-registered distributors; however, buyers remain responsible for verifying product suitability for their specific clinical requirements.',
        },
        {
          heading: 'Changes to Terms',
          body: 'Raphamel may update these terms at any time. Continued use of the platform after changes constitutes acceptance of the revised terms. Material changes will be communicated via email.',
        },
        {
          heading: 'Contact',
          body: 'For questions about these terms, contact us at info@raphamel.com.',
        },
      ]}
    />
  );
}
