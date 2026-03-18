import { useState } from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

const avatars = [
  'https://images.unsplash.com/photo-1605369473971-c5e417ac3220?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOaWdlcmlhbiUyMGRvY3RvciUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc3Mjk4MjcyNnww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1655720357761-f18ea9e5e7e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwcGhhcm1hY2lzdCUyMHBvcnRyYWl0JTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3Mjk4MjcyNnww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1762237798212-bcc000c00891?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3NwaXRhbCUyMGFkbWluaXN0cmF0b3IlMjBwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzI5ODI3MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1694787590597-ba49c7cdc2cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwaGVhbHRoY2FyZSUyMHByb2N1cmVtZW50JTIwb2ZmaWNlciUyMGhvc3BpdGFsfGVufDF8fHx8MTc3Mjk4MjcyNXww&ixlib=rb-4.1.0&q=80&w=1080',
];

export function Hero() {
  const [activeTab, setActiveTab] = useState<'buyer' | 'supplier'>('buyer');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email submitted:', email, 'Type:', activeTab);
    // Handle waitlist signup
  };

  return (
    <section className="relative min-h-screen pt-24 pb-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#060E1C] via-[#0A1628] to-[#0E2444]" />
      
      {/* Blueprint grid overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, #0071DC 1px, transparent 1px),
            linear-gradient(to bottom, #0071DC 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Radial glows */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#0071DC] rounded-full blur-[150px] opacity-20" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#FACC15] rounded-full blur-[150px] opacity-15" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Yellow badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ fontFamily: "'DM Mono', monospace" }}
              className="inline-block px-4 py-2 bg-[#FACC15] text-[#0F172A] rounded-full text-xs font-semibold uppercase tracking-wide"
            >
              Early Access Opening Soon
            </motion.div>

            {/* H1 Display */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ fontFamily: "'Fraunces', serif" }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1]"
            >
              Nigeria's{' '}
              <span className="text-[#0071DC]">B2B Medical</span>{' '}
              Marketplace is Launching Soon
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              className="text-lg text-[#94A3B8] max-w-xl"
            >
              Connect verified suppliers with healthcare facilities. Transparent pricing, reliable delivery, NAFDAC compliance built-in.
            </motion.p>

            {/* Tab toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex gap-3"
            >
              <button
                onClick={() => setActiveTab('buyer')}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === 'buyer'
                    ? 'bg-[#0071DC] text-white'
                    : 'bg-white/[0.06] text-[#94A3B8] hover:bg-white/[0.1]'
                }`}
              >
                I'm a Buyer
              </button>
              <button
                onClick={() => setActiveTab('supplier')}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === 'supplier'
                    ? 'bg-[#0071DC] text-white'
                    : 'bg-white/[0.06] text-[#94A3B8] hover:bg-white/[0.1]'
                }`}
              >
                I'm a Supplier
              </button>
            </motion.div>

            {/* Email form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3"
            >
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
                className="h-12 px-8 bg-[#0071DC] text-white font-semibold rounded-md hover:bg-[#005BB5] transition-all duration-150"
              >
                Join Waitlist
              </button>
            </motion.form>

            {/* Avatar stack */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-4"
            >
              <div className="flex -space-x-2">
                {avatars.map((avatar, i) => (
                  <img
                    key={i}
                    src={avatar}
                    alt=""
                    className="w-10 h-10 rounded-full border-2 border-[#060E1C] object-cover"
                  />
                ))}
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-sm text-[#94A3B8]">
                <span className="text-white font-semibold">1,200+</span> already waiting
              </p>
            </motion.div>
          </div>

          {/* Right Column - Floating Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              <div className="bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] rounded-2xl p-6 space-y-6">
                {/* Mini Dashboard Header */}
                <div className="flex items-center justify-between">
                  <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-white font-semibold">
                    Recent Orders
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-[#22C55E]/[0.12] rounded-full">
                    <motion.div
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-2 h-2 bg-[#22C55E] rounded-full"
                    />
                    <span style={{ fontFamily: "'DM Mono', monospace" }} className="text-[10px] text-[#22C55E] font-semibold uppercase">
                      NAFDAC Verified
                    </span>
                  </div>
                </div>

                {/* Product Row */}
                <div className="flex items-start gap-4 p-4 bg-white/[0.04] rounded-lg">
                  <img
                    src="https://images.unsplash.com/photo-1664902265139-934219cee42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZXF1aXBtZW50JTIwZmxhdCUyMGxheSUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NzI5ODI3MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt=""
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 space-y-2">
                    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-white font-semibold text-sm">
                      IV Fluid Set - 1000ml
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Check className="w-3 h-3 text-[#22C55E]" />
                        <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-[#94A3B8]">
                          MedSupply Nigeria
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-lg text-white font-bold">
                        ₦45,000
                      </span>
                      <span style={{ fontFamily: "'DM Mono', monospace" }} className="text-xs text-[#FACC15] font-semibold">
                        In Transit
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mini Sparkline Chart */}
                <div className="space-y-2">
                  <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-[#94A3B8]">
                    Order Volume (Last 7 Days)
                  </div>
                  <div className="h-12 flex items-end gap-1">
                    {[40, 65, 55, 80, 70, 90, 75].map((height, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                        className="flex-1 bg-gradient-to-t from-[#0071DC] to-[#0071DC]/40 rounded-t"
                      />
                    ))}
                  </div>
                </div>

                {/* Order Status */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Pending', value: '12', color: 'bg-[#FACC15]' },
                    { label: 'In Transit', value: '8', color: 'bg-[#0071DC]' },
                    { label: 'Delivered', value: '34', color: 'bg-[#22C55E]' },
                  ].map((stat, i) => (
                    <div key={i} className="p-3 bg-white/[0.04] rounded-lg">
                      <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-2xl text-white font-bold">
                        {stat.value}
                      </div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-[#94A3B8]">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
