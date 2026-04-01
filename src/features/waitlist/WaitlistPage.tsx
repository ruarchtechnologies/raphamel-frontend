'use client';

import { WaitlistHeroSection } from './components/waitlistHerosection';
import { TrustBar } from './components/ui/TrustBar';
import { CategoriesPreviewSection } from './components/CategoriesPreviewSection';
import { ValuePropsSection } from './components/valuePropssection';
import { HowItWorksSection } from './components/howItWorkssection';
import { EarlyAccessSection } from './components/EarlyAccessSection';
import { Footer } from './components/ui/Footer';

export function WaitlistPage() {
  return (
    <div className="min-h-screen" style={{ background: '#060E1C' }}>
      <WaitlistHeroSection />
      <TrustBar />
      <CategoriesPreviewSection />
      <ValuePropsSection />
      <HowItWorksSection />
      <EarlyAccessSection />
      <Footer />
    </div>
  );
}
