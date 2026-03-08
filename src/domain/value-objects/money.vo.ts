/**
 * FLUTTER EQUIV: A value object (immutable data class) in Flutter:
 *   class Money extends Equatable {
 *     final int amountInKobo;
 *     final String currency;
 *     String format() => NumberFormat.currency(symbol: '₦').format(amountInKobo / 100);
 *   }
 *
 * VALUE OBJECT = an object whose identity is its VALUE, not a database ID.
 * Two Money objects with the same amount are identical — just like two "₦500"
 * banknotes are interchangeable.
 *
 * In TypeScript we implement this as a class with a private constructor
 * (factory pattern) to guarantee the invariant: amount must be non-negative.
 *
 * USAGE:
 *   const price = Money.fromNaira(45000);
 *   price.format()  // "₦45,000"
 *   price.toKobo()  // 4500000
 */

export class Money {
  /** Amount stored in the smallest NGN unit (kobo) — prevents float errors */
  private readonly kobo: number;
  private readonly currency: string;

  private constructor(kobo: number, currency = 'NGN') {
    if (kobo < 0) throw new Error('Money amount cannot be negative');
    this.kobo = Math.round(kobo); // guard against float-point drift
    this.currency = currency;
  }

  /** Create from a naira amount (e.g., 45000 for ₦45,000) */
  static fromNaira(naira: number, currency = 'NGN'): Money {
    return new Money(naira * 100, currency);
  }

  /** Create from a kobo amount (what the API stores) */
  static fromKobo(kobo: number, currency = 'NGN'): Money {
    return new Money(kobo, currency);
  }

  toKobo(): number {
    return this.kobo;
  }

  toNaira(): number {
    return this.kobo / 100;
  }

  /**
   * Format for display. In Flutter you'd use intl's NumberFormat.
   * In JS we use the built-in Intl.NumberFormat (same concept).
   */
  format(): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: this.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(this.toNaira());
  }

  /** Calculate discount percentage between two Money values */
  static discountPercent(original: Money, sale: Money): number {
    if (original.kobo === 0) return 0;
    return Math.round(((original.kobo - sale.kobo) / original.kobo) * 100);
  }

  equals(other: Money): boolean {
    return this.kobo === other.kobo && this.currency === other.currency;
  }
}
