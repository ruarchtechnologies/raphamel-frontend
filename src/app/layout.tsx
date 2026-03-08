/**
 * FLUTTER EQUIV: MaterialApp / main.dart
 *
 * In Flutter: MaterialApp is the root widget that configures theme, routes,
 * locale, and global providers.
 *
 * In Next.js: RootLayout is the top-level wrapper rendered on EVERY page.
 * It's the equivalent of your main.dart + MaterialApp combined.
 *
 * KEY CONCEPTS:
 *
 * 1. Metadata (SEO):
 *    Flutter has no concept of HTML <title> or <meta> tags.
 *    In Next.js, `export const metadata` generates these automatically.
 *    Next.js injects them into the <head> of every HTML page.
 *
 * 2. Font loading:
 *    Flutter: pubspec.yaml + ThemeData(fontFamily: 'Outfit')
 *    Next.js: next/font/google — downloads font at build time, self-hosts it,
 *    zero layout shift (no FOUT). The CSS variable --font-outfit is set on <html>.
 *
 * 3. Providers:
 *    Flutter: MultiProvider or ProviderScope at the top of runApp()
 *    Next.js: <Providers> wraps children — same concept, different API.
 *    See src/providers/Providers.tsx for React Query + Sonner setup.
 *
 * 4. Server vs Client:
 *    This file has NO 'use client' — it's a Server Component.
 *    It runs on the server only. Children can be Server or Client Components.
 */

import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { Providers } from '@/providers/Providers';

/*
 * FLUTTER EQUIV: fontFamily in pubspec.yaml + ThemeData
 *
 * next/font automatically:
 *   - Downloads Outfit from Google at build time (no runtime CDN dependency)
 *   - Self-hosts it for performance
 *   - Generates a CSS variable (--font-outfit) you can use in Tailwind
 *   - Prevents layout shift (unlike loading fonts via @import in CSS)
 */
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

/*
 * FLUTTER EQUIV: No direct equivalent — Flutter apps don't have HTML metadata.
 * These values populate <title>, <meta name="description">, and Open Graph tags
 * that search engines and social media platforms read.
 *
 * `template: '%s | Raphamel Health'` means any page-level title like
 * "Hospital Consumables" becomes "Hospital Consumables | Raphamel Health".
 */
export const metadata: Metadata = {
  title: {
    default: 'Raphamel Health — Nigeria\'s B2B Medical Marketplace',
    template: '%s | Raphamel Health',
  },
  description:
    'Nigeria\'s B2B healthcare marketplace connecting verified medical suppliers with hospitals, clinics and pharmacies. Source hospital consumables, surgical equipment, diagnostic devices and more.',
  keywords: [
    'medical supplies Nigeria',
    'B2B healthcare marketplace',
    'hospital consumables',
    'surgical equipment',
    'NAFDAC certified suppliers',
    'diagnostic devices Nigeria',
    'medical equipment suppliers',
    'raphamel health',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    siteName: 'Raphamel Health Marketplace',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /*
   * FLUTTER EQUIV:
   *   runApp(
   *     MultiProvider(
   *       providers: [...],
   *       child: MaterialApp(
   *         title: 'Raphamel Health',
   *         theme: ThemeData(fontFamily: 'Outfit'),
   *         home: children,
   *       ),
   *     ),
   *   );
   *
   * In Next.js:
   *   - <html lang="en"> sets the document language (accessibility + SEO)
   *   - outfit.variable sets the CSS custom property on the root
   *   - outfit.className applies Outfit as the body font
   *   - <Providers> wraps with React Query + Sonner (toasts)
   */
  return (
    <html lang="en" className={outfit.variable}>
      <body className={outfit.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
