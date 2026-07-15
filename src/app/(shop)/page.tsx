/**
 * FLUTTER EQUIV: HomeScreen — the first screen users see.
 *
 * In Flutter (GoRouter): GoRoute(path: '/', builder: (ctx, state) => HomeScreen())
 * In Next.js: app/(shop)/page.tsx IS the '/' route. No route config needed.
 *
 * SERVER COMPONENT: No 'use client'. This renders on the server.
 * Each child component decides independently if it needs client interactivity.
 * The composition pattern here is the KEY DIFFERENCE from Flutter:
 *
 * Flutter: HomeScreen is a widget that builds its entire widget tree.
 *          If any part needs state, the whole widget becomes StatefulWidget.
 *
 * Next.js: This SERVER page composes CLIENT components (HeroBanner, CategorySection).
 *          Only the interactive parts ship JavaScript — the server renders the rest.
 *          This is called "React Server Components" — Flutter has no equivalent.
 *
 * PERFORMANCE ANALOGY:
 *   Flutter: entire UI is client-rendered (on device).
 *   Next.js: server renders HTML → browser displays → React "hydrates" interactivity.
 *            Less JavaScript = faster initial load (like a pre-built Flutter app vs a web app).
 */

import { HeroBanner } from '@/components/home/HeroBanner';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Raphamel',
  description:
    'Hospital consumables, surgical equipment, diagnostic devices and PPE — NAFDAC-compliant medical products delivered directly to healthcare facilities across Nigeria.',
};

export default function HomePage() {
  /*
   * FLUTTER EQUIV:
   *   @override
   *   Widget build(BuildContext context) {
   *     return SingleChildScrollView(
   *       child: Column(children: [
   *         HeroBanner(),
   *         CategorySection(),
   *         PromoStrip(),
   *         FeaturedProducts(),
   *         VendorSection(),
   *       ]),
   *     );
   *   }
   *
   * In Next.js: JSX replaces Widget trees. Each section is a component.
   * 'page-enter' applies a fade-in animation via globals.css.
   */
  return (
    <div className="page-enter">
      <HeroBanner />
      <FeaturedProducts />
    </div>
  );
}
