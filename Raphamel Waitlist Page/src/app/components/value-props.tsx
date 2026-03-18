import { motion } from 'motion/react';
import { ShieldCheck, Package, Building2 } from 'lucide-react';
import { useInView } from './use-in-view';

const cards = [
  {
    number: '01',
    title: 'NAFDAC-Verified Suppliers',
    description: 'Every supplier is vetted and verified to meet Nigerian pharmaceutical standards.',
    icon: ShieldCheck,
    color: {
      bg: 'rgba(0, 113, 220, 0.06)',
      border: 'rgba(0, 113, 220, 0.15)',
      icon: '#0071DC',
      number: 'rgba(0, 113, 220, 0.1)',
    },
  },
  {
    number: '02',
    title: '15,000+ Medical Products',
    description: 'From consumables to diagnostics, find everything your facility needs in one place.',
    icon: Package,
    color: {
      bg: 'rgba(250, 204, 21, 0.06)',
      border: 'rgba(250, 204, 21, 0.15)',
      icon: '#FACC15',
      number: 'rgba(250, 204, 21, 0.1)',
    },
  },
  {
    number: '03',
    title: 'Built for Healthcare Facilities',
    description: 'Procurement tools designed specifically for Nigerian hospitals, clinics, and pharmacies.',
    icon: Building2,
    color: {
      bg: 'rgba(34, 197, 94, 0.06)',
      border: 'rgba(34, 197, 94, 0.15)',
      icon: '#22C55E',
      number: 'rgba(34, 197, 94, 0.1)',
    },
  },
];

export function ValueProps() {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section ref={ref} className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
          transition={{ duration: 0.6 }}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4">
            Why Healthcare Providers Choose Raphamel
          </h2>
          <p className="text-lg text-[#475569] max-w-2xl mx-auto">
            Built for the unique needs of Nigerian healthcare procurement
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="relative p-8 rounded-2xl"
                style={{
                  backgroundColor: card.color.bg,
                  border: `1px solid ${card.color.border}`,
                }}
              >
                {/* Ghost number */}
                <div
                  style={{
                    fontFamily: "'Fraunces', serif",
                    color: card.color.number,
                  }}
                  className="absolute top-6 right-6 text-6xl font-extrabold"
                >
                  {card.number}
                </div>

                <Icon
                  className="w-12 h-12 mb-6"
                  style={{ color: card.color.icon }}
                  strokeWidth={1.5}
                />
                
                <h3
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                  className="text-xl font-bold text-[#0F172A] mb-3"
                >
                  {card.title}
                </h3>
                
                <p
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                  className="text-[#475569]"
                >
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
