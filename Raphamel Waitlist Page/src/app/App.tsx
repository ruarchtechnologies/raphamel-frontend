import { useState } from 'react';
import { Nav } from './components/nav';
import { Hero } from './components/hero';
import { TrustBar } from './components/trust-bar';
import { ValueProps } from './components/value-props';
import { HowItWorks } from './components/how-it-works';
import { StatsBand } from './components/stats-band';
import { FinalCTA } from './components/final-cta';
import { Footer } from './components/footer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#060E1C]">
      <Nav />
      <Hero />
      <TrustBar />
      <ValueProps />
      <HowItWorks />
      <StatsBand />
      <FinalCTA />
      <Footer />
    </div>
  );
}
