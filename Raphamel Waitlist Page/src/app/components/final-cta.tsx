import { useState } from 'react';
import { motion } from 'motion/react';
import { useInView } from './use-in-view';

export function FinalCTA() {
  const [email, setEmail] = useState('');
  const { ref, isInView } = useInView({ threshold: 0.2 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Final CTA email submitted:', email);
    // Handle waitlist signup
  };

  return (
    <section ref={ref} className="bg-[#0A1628] py-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
          transition={{ duration: 0.6 }}
        >
          <h2
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Reserve Your Early Access
          </h2>

          <p
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            className="text-lg text-[#94A3B8] mb-8 max-w-2xl mx-auto"
          >
            Join 1,200+ healthcare providers and suppliers preparing to transform medical procurement in Nigeria.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your work email"
              required
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              className="flex-1 h-12 px-4 bg-transparent border border-[#334155] rounded-md text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#0071DC] focus:ring-2 focus:ring-[#0071DC]/20 transition-all"
            />
            <button
              type="submit"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              className="h-12 px-12 bg-[#FACC15] text-[#0F172A] font-semibold rounded-full hover:bg-[#EAB308] hover:scale-[1.03] transition-all duration-150"
            >
              Get Early Access
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
