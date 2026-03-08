/**
 * FLUTTER EQUIV: lib/domain/entities/vendor.dart
 *
 * Vendor = a medical equipment supplier / distributor registered on Raphamel.
 * Actors who are vendors: pharmaceutical wholesalers, surgical instrument
 * importers, diagnostic device distributors.
 *
 * B2B additions over a generic vendor:
 *  - specialisations  → list of categories the vendor focuses on
 *  - yearsInBusiness  → trust signal for hospital procurement officers
 *  - certifications   → NAFDAC dealer licence, SON registration etc.
 *  - minOrderValue    → some vendors set a minimum cart value
 */

import type { VendorStatus } from '@/types/index';

export interface VendorCertification {
  name: string;         // e.g. 'NAFDAC Dealer Licence', 'SON Registration'
  referenceNumber?: string;
  validUntil?: string;
}

export interface VendorEntity {
  id: string;
  storeName: string;
  slug: string;
  description?: string;
  logo?: string;
  banner?: string;
  status: VendorStatus;

  /** Category slugs this vendor specialises in */
  specialisations: string[];

  yearsInBusiness?: number;
  certifications?: VendorCertification[];

  /** Minimum cart value (NGN) to place an order with this vendor */
  minOrderValue?: number;

  productCount: number;
  averageRating?: number;
  reviewCount?: number;

  /** Whether business documents (CAC + operating licence) are verified */
  isBusinessVerified: boolean;

  createdAt: string;
}
