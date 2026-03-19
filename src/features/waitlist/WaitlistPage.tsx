import { Nav } from './components/ui/Nav';
import { WaitlistHeroSection } from './components/waitlistHerosection';
import { TrustBar } from './components/ui/TrustBar';
import { ValuePropsSection } from './components/valuePropssection';
import { HowItWorksSection } from './components/howItWorkssection';
import { StatsBand } from './components/statsBand';
import { FinalCTA } from './components/ui/FinalCTA';
import { Footer } from './components/ui/Footer';

export function WaitlistPage() {
  return (
    <div className="min-h-screen" style={{ background: '#060E1C' }}>
      <Nav />
      <WaitlistHeroSection />
      <TrustBar />
      <ValuePropsSection />
      <HowItWorksSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}
