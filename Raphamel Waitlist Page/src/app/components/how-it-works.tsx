import { useState } from 'react';
import { motion } from 'motion/react';
import { useInView } from './use-in-view';

const buyerSteps = [
  {
    number: 1,
    title: 'Create Your Account',
    description: 'Register as a healthcare facility with your business details.',
  },
  {
    number: 2,
    title: 'Browse Verified Catalog',
    description: 'Search 15,000+ medical products from NAFDAC-verified suppliers.',
  },
  {
    number: 3,
    title: 'Compare & Order',
    description: 'View transparent pricing, compare suppliers, and place orders instantly.',
  },
  {
    number: 4,
    title: 'Track Delivery',
    description: 'Monitor your shipment in real-time with delivery confirmations.',
  },
  {
    number: 5,
    title: 'Manage Invoices',
    description: 'Access order history, invoices, and automated compliance reports.',
  },
];

const supplierSteps = [
  {
    number: 1,
    title: 'Apply & Verify',
    description: 'Submit your NAFDAC license and business documents for verification.',
  },
  {
    number: 2,
    title: 'List Your Products',
    description: 'Upload your catalog with pricing, stock levels, and product details.',
  },
  {
    number: 3,
    title: 'Receive Orders',
    description: 'Get instant notifications when healthcare facilities place orders.',
  },
  {
    number: 4,
    title: 'Fulfill & Ship',
    description: 'Process orders with integrated logistics and tracking.',
  },
  {
    number: 5,
    title: 'Get Paid Securely',
    description: 'Receive payments through our secure escrow system.',
  },
];

export function HowItWorks() {
  const [activeTab, setActiveTab] = useState<'buyers' | 'suppliers'>('buyers');
  const { ref, isInView } = useInView({ threshold: 0.2 });

  const steps = activeTab === 'buyers' ? buyerSteps : supplierSteps;

  return (
    <section ref={ref} className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4"
          >
            How It Works
          </h2>
          <p
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            className="text-lg text-[#475569] max-w-2xl mx-auto mb-8"
          >
            Simple, transparent procurement in minutes
          </p>

          {/* Tabs */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setActiveTab('buyers')}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'buyers'
                  ? 'bg-[#0071DC] text-white'
                  : 'bg-[#F8FAFC] text-[#475569] hover:bg-[#F1F5F9]'
              }`}
            >
              For Buyers
            </button>
            <button
              onClick={() => setActiveTab('suppliers')}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'suppliers'
                  ? 'bg-[#0071DC] text-white'
                  : 'bg-[#F8FAFC] text-[#475569] hover:bg-[#F1F5F9]'
              }`}
            >
              For Suppliers
            </button>
          </div>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-5 gap-6 mt-16">
          {steps.map((step, i) => (
            <motion.div
              key={`${activeTab}-${i}`}
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-[#0071DC] rounded-full flex items-center justify-center">
                  <span
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                    className="text-white font-bold text-lg"
                  >
                    {step.number}
                  </span>
                </div>
              </div>
              
              <h3
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                className="text-lg font-bold text-[#0F172A] mb-2"
              >
                {step.title}
              </h3>
              
              <p
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                className="text-sm text-[#475569]"
              >
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
