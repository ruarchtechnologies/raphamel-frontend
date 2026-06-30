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
    color: '#dbeafe',
    description:
      'IV sets, syringes, catheters, nasogastric tubes, bandages and everyday single-use clinical consumables.',
    image: '/images/category-hospital-consumables.png',
    productCount: 3240,
  },
  {
    id: 'cat-02',
    name: 'Surgical Equipment',
    slug: 'surgical-equipment',
    color: '#fee2e2',
    description:
      'Scalpels, forceps, retractors, needle holders and complete surgical instrument sets — NAFDAC certified.',
    image: '/images/category-surgical-equipment.png',
    productCount: 1180,
  },
  {
    id: 'cat-03',
    name: 'Diagnostic Devices',
    slug: 'diagnostic-devices',
    color: '#ede9fe',
    description:
      'Stethoscopes, otoscopes, sphygmomanometers, glucometers and point-of-care testing kits.',
    image: '/images/category-diagnostic-devices.png',
    productCount: 2670,
  },
  {
    id: 'cat-04',
    name: 'Personal Protective Equipment',
    slug: 'personal-protective-equipment',
    color: '#fef9c3',
    description:
      'N95/FFP2 masks, nitrile gloves, isolation gowns, face shields and complete PPE bundles.',
    image: '/images/category-personal-protective-equipment.png',
    productCount: 1950,
  },
  {
    id: 'cat-05',
    name: 'Rehabilitation Equipment',
    slug: 'rehabilitation-equipment',
    color: '#d1fae5',
    description:
      'Physiotherapy tools, TENS units, parallel bars, balance boards and post-surgery recovery equipment.',
    image: '/images/category-rehabilitation-equipment.png',
    productCount: 870,
  },
  {
    id: 'cat-06',
    name: 'Laboratory Supplies',
    slug: 'laboratory-supplies',
    color: '#e0e7ff',
    description:
      'Test tubes, pipettes, centrifuges, microscopes, reagents and rapid diagnostic test kits.',
    image: '/images/category-laboratory-supplies.png',
    productCount: 2140,
  },
  {
    id: 'cat-07',
    name: 'Patient Care Products',
    slug: 'patient-care-products',
    color: '#fce7f3',
    description:
      'Hospital beds, bedpans, wound care kits, nursing supplies and patient hygiene products.',
    image: '/images/category-patient-care-products.png',
    productCount: 1560,
  },
  {
    id: 'cat-09',
    name: 'Mobility & Orthopaedic Aids',
    slug: 'mobility-orthopaedic-aids',
    color: '#ccfbf1',
    description:
      'Wheelchairs, crutches, walkers, orthotic braces, compression stockings and mobility aids.',
    image: '/images/category-mobility-orthopaedic-aids.png',
    productCount: 940,
  },
  {
    id: 'cat-11',
    name: 'Imaging & Monitoring Equipment',
    slug: 'imaging-monitoring-equipment',
    color: '#f1f5f9',
    description:
      'Ultrasound machines, patient monitors, ECG devices, pulse oximeters and portable X-ray units.',
    image: '/images/category-imaging-monitoring-equipment.png',
    productCount: 1120,
  },
] as const;

/** Helper: look up a category by its URL slug — used in category detail pages */
export function findCategoryBySlug(slug: string): CategoryEntity | undefined {
  return HEALTH_CATEGORIES.find((c) => c.slug === slug);
}
