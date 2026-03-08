/**
 * FLUTTER EQUIV: lib/domain/entities/category.dart
 *
 * In Flutter Clean Architecture you'd write:
 *   class Category extends Equatable {
 *     final String id;
 *     final String name;
 *     ...
 *   }
 *
 * In TypeScript we use plain interfaces — comparison is structural, not
 * nominal, so we don't need Equatable. The compiler guarantees type safety.
 *
 * DIFFERENCE: Flutter entities often extend Equatable so Flutter can compare
 * two instances by value. TypeScript interfaces are erased at runtime; object
 * equality is always reference-based in JS unless you write your own comparator.
 */

// ── Core domain entity ──────────────────────────────────────────────────────

export interface CategoryEntity {
  id: string;
  name: string;
  slug: string;
  description?: string;
  /** URL to category hero/icon image */
  image?: string;
  /** Background tint colour used in the UI (Tailwind-safe hex) */
  color?: string;
  parentId?: string;
  children?: CategoryEntity[];
  productCount?: number;
}

// ── Single source of truth for Raphamel's 10 health categories ──────────────
//
// FLUTTER EQUIV: A const List<Category> defined in a constants file
//   (e.g. lib/core/constants/categories.dart)
//
// We export this so every component (CategorySection, Header, Footer, Filter
// panel, category pages) imports from ONE place — not hardcoded per file.
// This is the "Don't Repeat Yourself" principle in action.

export const HEALTH_CATEGORIES: readonly CategoryEntity[] = [
  {
    id: 'cat-01',
    name: 'Hospital Consumables',
    slug: 'hospital-consumables',
    color: '#dbeafe', // Tailwind blue-100
    description:
      'IV sets, syringes, catheters, nasogastric tubes, bandages and everyday single-use clinical consumables.',
    // IMAGE NEEDED: hospital-consumables.jpg | Size: 800x500
    // Content: Clean flatlay of IV bags, syringes, disposable gloves, gauze
    image:
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=500&fit=crop',
    productCount: 3240,
  },
  {
    id: 'cat-02',
    name: 'Surgical Equipment',
    slug: 'surgical-equipment',
    color: '#fee2e2', // Tailwind red-100
    description:
      'Scalpels, forceps, retractors, needle holders and complete surgical instrument sets — NAFDAC certified.',
    // IMAGE NEEDED: surgical-equipment.jpg | Size: 800x500
    // Content: Stainless steel surgical instruments laid on blue sterile drape
    image:
      'https://images.unsplash.com/photo-1551601651-2a8f10b8a0f8?w=800&h=500&fit=crop',
    productCount: 1180,
  },
  {
    id: 'cat-03',
    name: 'Diagnostic Devices',
    slug: 'diagnostic-devices',
    color: '#ede9fe', // Tailwind violet-100
    description:
      'Stethoscopes, otoscopes, sphygmomanometers, glucometers and point-of-care testing kits.',
    // IMAGE NEEDED: diagnostic-devices.jpg | Size: 800x500
    // Content: Doctor holding stethoscope, glucometer and otoscope on white bg
    image:
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=500&fit=crop',
    productCount: 2670,
  },
  {
    id: 'cat-04',
    name: 'Personal Protective Equipment',
    slug: 'personal-protective-equipment',
    color: '#fef9c3', // Tailwind yellow-100
    description:
      'N95/FFP2 masks, nitrile gloves, isolation gowns, face shields and complete PPE bundles.',
    // IMAGE NEEDED: personal-protective-equipment.jpg | Size: 800x500
    // Content: Healthcare worker in full PPE — gown, N95, face shield, gloves
    image:
      'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=800&h=500&fit=crop',
    productCount: 1950,
  },
  {
    id: 'cat-05',
    name: 'Rehabilitation Equipment',
    slug: 'rehabilitation-equipment',
    color: '#d1fae5', // Tailwind emerald-100
    description:
      'Physiotherapy tools, TENS units, parallel bars, balance boards and post-surgery recovery equipment.',
    // IMAGE NEEDED: rehabilitation-equipment.jpg | Size: 800x500
    // Content: Physiotherapist assisting patient with parallel bars / resistance bands
    image:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop',
    productCount: 870,
  },
  {
    id: 'cat-06',
    name: 'Laboratory Supplies',
    slug: 'laboratory-supplies',
    color: '#e0e7ff', // Tailwind indigo-100
    description:
      'Test tubes, pipettes, centrifuges, microscopes, reagents and rapid diagnostic test kits.',
    // IMAGE NEEDED: laboratory-supplies.jpg | Size: 800x500
    // Content: Lab technician with test tubes and microscope on clean bench
    image:
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=500&fit=crop',
    productCount: 2140,
  },
  {
    id: 'cat-07',
    name: 'Patient Care Products',
    slug: 'patient-care-products',
    color: '#fce7f3', // Tailwind pink-100
    description:
      'Hospital beds, bedpans, wound care kits, nursing supplies and patient hygiene products.',
    // IMAGE NEEDED: patient-care-products.jpg | Size: 800x500
    // Content: Clean hospital room with adjustable bed, patient monitor, IV stand
    image:
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=500&fit=crop',
    productCount: 1560,
  },
  {
    id: 'cat-08',
    name: 'First Aid & Emergency',
    slug: 'first-aid-emergency',
    color: '#ffedd5', // Tailwind orange-100
    description:
      'AEDs, defibrillators, trauma kits, emergency stretchers, oxygen masks and resuscitation equipment.',
    // IMAGE NEEDED: first-aid-emergency.jpg | Size: 800x500
    // Content: Open first aid kit with AED device and trauma supplies on red background
    image:
      'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&h=500&fit=crop',
    productCount: 730,
  },
  {
    id: 'cat-09',
    name: 'Mobility & Orthopaedic Aids',
    slug: 'mobility-orthopaedic-aids',
    color: '#ccfbf1', // Tailwind teal-100
    description:
      'Wheelchairs, crutches, walkers, orthotic braces, compression stockings and mobility aids.',
    // IMAGE NEEDED: mobility-orthopaedic-aids.jpg | Size: 800x500
    // Content: Lightweight wheelchair, forearm crutches and ankle brace on white background
    image:
      'https://images.unsplash.com/photo-1552862750-5267da0f1f57?w=800&h=500&fit=crop',
    productCount: 940,
  },
  {
    id: 'cat-10',
    name: 'Imaging & Monitoring Equipment',
    slug: 'imaging-monitoring-equipment',
    color: '#f1f5f9', // Tailwind slate-100
    description:
      'Ultrasound machines, patient monitors, ECG devices, pulse oximeters and portable X-ray units.',
    // IMAGE NEEDED: imaging-monitoring-equipment.jpg | Size: 800x500
    // Content: Patient vital signs monitor displaying ECG waveform, alongside ultrasound probe
    image:
      'https://images.unsplash.com/photo-1530026186672-2b527be13174?w=800&h=500&fit=crop',
    productCount: 1120,
  },
] as const;

/** Helper: look up a category by its URL slug — used in category detail pages */
export function findCategoryBySlug(slug: string): CategoryEntity | undefined {
  return HEALTH_CATEGORIES.find((c) => c.slug === slug);
}
