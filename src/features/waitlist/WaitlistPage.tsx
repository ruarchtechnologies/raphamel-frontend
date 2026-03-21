'use client';

import { useState } from 'react';
import { WaitlistHeroSection } from './components/waitlistHerosection';
import { TrustBar } from './components/ui/TrustBar';
import { CategoriesPreviewSection } from './components/CategoriesPreviewSection';
import { ValuePropsSection } from './components/valuePropssection';
import { HowItWorksSection } from './components/howItWorkssection';
import { FinalCTA } from './components/ui/FinalCTA';
import { Footer } from './components/ui/Footer';

export function WaitlistPage() {
  const [activeTab, setActiveTab] = useState<'buyer' | 'supplier'>('buyer');

  return (
    <div className="min-h-screen" style={{ background: '#060E1C' }}>
      <WaitlistHeroSection activeTab={activeTab} setActiveTab={setActiveTab} />
      <TrustBar />
      <CategoriesPreviewSection />
      <ValuePropsSection />
      <HowItWorksSection activeTab={activeTab} setActiveTab={setActiveTab} />
      <FinalCTA />
      <Footer />
    </div>
  );
}
