import type { Metadata } from 'next';
import { Fraunces, DM_Sans, DM_Mono } from 'next/font/google';
import { Toaster } from 'sonner';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Join the Waitlist | Raphamel',
  description:
    "Be first to access Nigeria's B2B medical marketplace. Join the waitlist and get early access to 15,000+ NAFDAC-verified medical products.",
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png' }],
  },
  openGraph: {
    title: "Join the Waitlist | Raphamel",
    description: "Be first to access Africa's B2B medical marketplace.",
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Join the Waitlist | Raphamel",
    description: "Be first to access Africa's B2B medical marketplace.",
  },
};

export default function WaitlistLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${fraunces.variable} ${dmSans.variable} ${dmMono.variable}`}>
      {children}
      <Toaster position="top-center" richColors />
    </div>
  );
}
