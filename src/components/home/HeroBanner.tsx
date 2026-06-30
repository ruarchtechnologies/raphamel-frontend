/**
 * FLUTTER EQUIV: A StatefulWidget with PageController + Timer
 *
 * In Flutter you'd use:
 *   PageView.builder + PageController.animateToPage() + Timer.periodic()
 *
 * In React we use the Embla Carousel library + useEffect for the same result.
 *
 * STATE COMPARISON:
 *   Flutter: int _selectedIndex inside StatefulWidget
 *   React:   const [selectedIndex, setSelectedIndex] = useState(0)
 *
 * LIFECYCLE COMPARISON:
 *   Flutter: initState() { _controller.addListener(...); }
 *            dispose()   { _controller.dispose(); }
 *   React:   useEffect(() => { emblaApi.on(...); return () => emblaApi.off(...); }, [emblaApi])
 *            The cleanup function returned from useEffect IS Flutter's dispose().
 */

'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

function SecondaryCtaButton({ href, label, accent }: { href: string; label: string; accent: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="inline-flex items-center h-12 px-6 text-sm font-semibold rounded-[6px] border transition-all duration-200"
      style={{
        borderColor: hovered ? accent : 'rgba(255,255,255,0.2)',
        backgroundColor: hovered ? `${accent}22` : 'transparent',
        color: hovered ? accent : 'white',
      }}
    >
      {label}
    </Link>
  );
}

// ── Slide data — healthcare B2B content ──────────────────────────────────────
//
// IMAGE NEEDED (slide 1): hero-hospital-consumables.jpg | Size: 700x500
//   Content: Clean flatlay of sterile IV bags, syringes, gloves on white/blue bg
// IMAGE NEEDED (slide 2): hero-surgical-equipment.jpg | Size: 700x500
//   Content: Stainless steel surgical instruments spread on sterile blue drape
// IMAGE NEEDED (slide 3): hero-diagnostic-devices.jpg | Size: 700x500
//   Content: Doctor using stethoscope + glucose monitor in bright clinical setting

const SLIDES = [
  {
    id: 1,
    badge: 'Nigeria\'s B2B Healthcare Marketplace',
    title: 'Source Medical Supplies\nwith Confidence',
    subtitle:
      'Connect with NAFDAC-verified suppliers of hospital consumables, surgical instruments and diagnostic devices across Nigeria.',
    cta: { label: 'Browse Consumables', href: '/categories/hospital-consumables' },
    secondaryCta: { label: 'All Categories', href: '/categories' },
    bg: 'from-[#0a1628] to-[#0e2444]',
    accent: '#0071DC',
    image:
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=700&h=500&fit=crop',
    imageAlt: 'Hospital consumables — IV bags, syringes, sterile gloves',
    stats: [
      { label: 'Products', value: '15K+' },
      { label: 'Verified Suppliers', value: '800+' },
      { label: 'Orders Fulfilled', value: '50K+' },
    ],
  },
  {
    id: 2,
    badge: 'Certified Surgical Instruments',
    title: 'NAFDAC-Certified\nSurgical Equipment',
    subtitle:
      'Scalpels, forceps, retractors and complete surgical kits sourced from registered importers and distributors.',
    cta: { label: 'Shop Surgical', href: '/categories/surgical-equipment' },
    secondaryCta: { label: 'View All Products', href: '/products' }, // DISABLED: was 'Find a Supplier' → '/vendors' — vendor/supplier feature removed
    bg: 'from-[#0f1f0a] to-[#1a3810]',
    accent: '#22c55e',
    image:
      'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=700&h=500&fit=crop',
    imageAlt: 'Surgical instruments on sterile drape',
    stats: [
      { label: 'Instrument SKUs', value: '5K+' },
      { label: 'Certifications', value: 'ISO + NAFDAC' },
      { label: 'Active Suppliers', value: '200+' },
    ],
  },
  {
    id: 3,
    badge: 'Diagnostic Innovation',
    title: 'Advanced Diagnostic\nDevices for Your Facility',
    subtitle:
      'From portable glucometers to ultrasound units — all diagnostic equipment in one verified B2B platform.',
    cta: { label: 'Explore Diagnostics', href: '/categories/diagnostic-devices' },
    secondaryCta: { label: 'View All Products', href: '/products' },
    bg: 'from-[#1a0a28] to-[#2d1547]',
    accent: '#FACC15',
    image:
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=700&h=500&fit=crop',
    imageAlt: 'Digital diagnostic medical devices',
    stats: [
      { label: 'Device Models', value: '3K+' },
      { label: 'Brands', value: '150+' },
      { label: 'Partner Hospitals', value: '1K+' },
    ],
  },
] as const;

export function HeroBanner() {
  /*
   * FLUTTER EQUIV: PageController _ctrl = PageController();
   * Embla is our carousel engine. The ref is attached to the scroll container.
   */
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 6000, stopOnInteraction: false }),
  ]);

  /*
   * FLUTTER EQUIV: int _selectedIndex = 0;  (inside StatefulWidget state)
   * useState is React's setState. Every call to setSelectedIndex re-renders.
   */
  const [selectedIndex, setSelectedIndex] = useState(0);

  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  /*
   * FLUTTER EQUIV: @override initState() + dispose()
   *
   * useEffect with a dependency array runs AFTER render (like initState for
   * first render, like didUpdateWidget when deps change).
   * The returned function is the CLEANUP (Flutter's dispose()).
   *
   * [emblaApi] as dependency = "re-run this effect when emblaApi changes"
   */
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect); // cleanup = dispose
    };
  }, [emblaApi]);

  return (
    <div className="relative overflow-hidden bg-gray-900">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {SLIDES.map((slide, idx) => (
            <div
              key={slide.id}
              className={cn(
                'flex-[0_0_100%] min-w-0 relative bg-gradient-to-r',
                slide.bg,
              )}
              style={{ minHeight: '540px' }}
            >
              <div className="container h-full">
                <div className="flex items-center h-full py-12 lg:py-16 gap-8 lg:gap-12">

                  {/* Left: Text content */}
                  <div className="flex-1 z-10">
                    {selectedIndex === idx && (
                      <>
                        {/* Badge — FLUTTER EQUIV: AnimatedOpacity + SlideTransition */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="flex items-center gap-2 mb-4"
                        >
                          <ShieldCheck size={14} style={{ color: slide.accent }} />
                          <span
                            className="text-xs font-bold uppercase tracking-widest"
                            style={{ color: slide.accent }}
                          >
                            {slide.badge}
                          </span>
                        </motion.div>

                        <motion.h1
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 whitespace-pre-line"
                        >
                          {slide.title}
                        </motion.h1>

                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-gray-300 text-base lg:text-lg max-w-md mb-8 leading-relaxed"
                        >
                          {slide.subtitle}
                        </motion.p>

                        {/* CTA buttons */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="flex flex-wrap gap-3"
                        >
                          {/*
                           * FLUTTER EQUIV: ElevatedButton with onPressed navigation
                           * In Next.js: <Link> handles routing, styled as a button
                           */}
                          <Link
                            href={slide.cta.href}
                            className="inline-flex items-center h-12 px-6 text-sm font-bold rounded-[6px] transition-transform hover:scale-105"
                            style={{ backgroundColor: slide.accent, color: '#111827' }}
                          >
                            {slide.cta.label}
                          </Link>
                          <SecondaryCtaButton
                            href={slide.secondaryCta.href}
                            label={slide.secondaryCta.label}
                            accent={slide.accent}
                          />
                        </motion.div>

                      </>
                    )}
                  </div>

                  {/* Right: Hero image */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{
                      opacity: selectedIndex === idx ? 1 : 0,
                      scale: selectedIndex === idx ? 1 : 0.95,
                    }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                    className="hidden lg:block flex-shrink-0 w-[42%] max-w-[520px]"
                  >
                    {/*
                     * FLUTTER EQUIV: ClipRRect(borderRadius: 16, child: CachedNetworkImage(...))
                     * Next.js <Image> = CachedNetworkImage + optimisation (lazy load, WebP, resize)
                     */}
                    <div
                      className="relative rounded-2xl overflow-hidden shadow-2xl"
                      style={{ height: 380 }}
                    >
                      <Image
                        src={slide.image}
                        alt={slide.imageAlt}
                        fill
                        priority={idx === 0}
                        className="object-cover"
                        sizes="520px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20" />
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prev/Next arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-colors z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-colors z-10"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              'rounded-full transition-all',
              i === selectedIndex
                ? 'w-6 h-2 bg-white'
                : 'w-2 h-2 bg-white/40 hover:bg-white/60',
            )}
          />
        ))}
      </div>
    </div>
  );
}
