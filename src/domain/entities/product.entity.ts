/**
 * FLUTTER EQUIV: lib/domain/entities/product.dart
 *
 * In Flutter:
 *   class ProductEntity extends Equatable {
 *     final String id;
 *     final String name;
 *     final Money price;
 *     final int minimumOrderQuantity;
 *     ...
 *   }
 *
 * In TypeScript we define the same concept with an interface.
 * The DOMAIN entity is what your APP cares about — not what the API returns.
 * API response shapes live in src/types/index.ts (DTOs).
 * This file defines the authoritative business object.
 *
 * B2B HEALTHCARE additions vs a regular product:
 *  - minimumOrderQuantity  → hospitals buy in bulk (MOQ)
 *  - stockUnit             → 'box', 'carton', 'unit' etc.
 *  - certifications        → NAFDAC, ISO, CE marks
 *  - condition             → new | refurbished (surgical equipment is sometimes refurb)
 */

// ── Supporting types ─────────────────────────────────────────────────────────

/** Unit in which stock is tracked — important for B2B bulk ordering */
export type StockUnit = 'unit' | 'box' | 'pack' | 'carton' | 'set' | 'pair' | 'roll';

/** Product physical condition — relevant for refurbished medical equipment */
export type ProductCondition = 'new' | 'refurbished' | 'used';

/**
 * A regulatory certification attached to a product.
 * FLUTTER EQUIV: value object (a small immutable data class)
 *   class ProductCertification {
 *     final String name;
 *     final String issuingBody;
 *     final DateTime? validUntil;
 *   }
 */
export interface ProductCertification {
  /** e.g. 'NAFDAC', 'ISO 13485', 'CE Mark', 'FDA 510(k)' */
  name: string;
  issuingBody: string;
  validUntil?: string; // ISO date string
}

// ── Core domain entity ────────────────────────────────────────────────────────

export interface ProductEntity {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  sku?: string;

  /** Price in kobo (smallest NGN unit) — always store money as integers */
  price: number;
  compareAtPrice?: number;

  stock: number;
  stockUnit: StockUnit;

  /**
   * B2B field: minimum units a buyer must order.
   * FLUTTER: final int minimumOrderQuantity;
   * Displayed as "Min. order: 10 boxes" on the product card.
   */
  minimumOrderQuantity: number;

  images: string[];
  isActive: boolean;
  isFeatured: boolean;

  vendorId: string;
  vendorName: string;

  categoryId?: string;
  categoryName?: string;
  categorySlug?: string;

  averageRating?: number;
  reviewCount?: number;

  tags?: string[];

  options?: Array<{
    id: string;
    title: string;
    values: string[];
  }>;

  variants?: Array<{
    id: string;
    name: string;
    stock: number;
    price?: number;
    optionValues?: Record<string, string>;
  }>;

  certifications?: ProductCertification[];
  condition: ProductCondition;

  createdAt: string;
  updatedAt: string;
}
