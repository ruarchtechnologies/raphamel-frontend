import { describe, it, expect } from 'vitest';
import {
  cn,
  formatPrice,
  formatDate,
  slugify,
  truncate,
  getDiscountPercent,
  range,
} from '@/lib/utils';

describe('cn()', () => {
  it('merges class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('drops falsy values', () => {
    expect(cn('a', false && 'b', null, undefined, 'c')).toBe('a c');
  });

  it('resolves Tailwind conflicts — last wins', () => {
    // tailwind-merge: p-2 + p-4 → p-4
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('handles conditional objects', () => {
    expect(cn({ 'text-red-500': true, 'text-blue-500': false })).toBe(
      'text-red-500',
    );
  });

  it('returns empty string when called with no args', () => {
    expect(cn()).toBe('');
  });
});

describe('formatPrice()', () => {
  it('formats a whole number in NGN', () => {
    const result = formatPrice(4500);
    expect(result).toContain('4,500');
    expect(result).toMatch(/[₦N]/); // either ₦ symbol or NGN code
  });

  it('formats zero', () => {
    const result = formatPrice(0);
    expect(result).toContain('0');
  });

  it('formats large amounts with thousand separators', () => {
    const result = formatPrice(1_000_000);
    expect(result).toContain('1,000,000');
  });

  it('NEVER divides by 100 — Medusa prices are already in the display unit', () => {
    // 4500 from Medusa → ₦4,500 displayed, NOT ₦45
    const result = formatPrice(4500);
    expect(result).toContain('4,500');
    expect(result).not.toContain('45.00');
    expect(result).not.toContain('45 ');
  });

  it('always prefixes the ₦ symbol', () => {
    const result = formatPrice(100);
    expect(result).toContain('₦');
    expect(result).toContain('100');
  });
});

describe('formatDate()', () => {
  it('formats a date string', () => {
    const result = formatDate('2024-01-15T10:00:00Z');
    expect(result).toContain('2024');
    expect(result).toMatch(/Jan/i);
  });

  it('formats a Date object', () => {
    const result = formatDate(new Date('2024-06-01'));
    expect(result).toContain('2024');
  });
});

describe('slugify()', () => {
  it('lowercases and replaces spaces with hyphens', () => {
    expect(slugify('Surgical Gloves')).toBe('surgical-gloves');
  });

  it('strips leading and trailing hyphens', () => {
    expect(slugify(' hello world ')).toBe('hello-world');
  });

  it('collapses multiple separators', () => {
    expect(slugify('hello  world!!!')).toBe('hello-world');
  });

  it('handles already-slugified strings', () => {
    expect(slugify('already-slugified')).toBe('already-slugified');
  });
});

describe('truncate()', () => {
  it('truncates text longer than limit with ellipsis', () => {
    expect(truncate('hello world', 5)).toBe('hello…');
  });

  it('returns original text if at or below limit', () => {
    expect(truncate('hello', 10)).toBe('hello');
    expect(truncate('hello', 5)).toBe('hello');
  });
});

describe('getDiscountPercent()', () => {
  it('calculates percentage correctly', () => {
    expect(getDiscountPercent(5000, 4000)).toBe(20);
  });

  it('rounds to nearest whole number', () => {
    expect(getDiscountPercent(3000, 2000)).toBe(33);
  });

  it('returns 0 when prices are equal', () => {
    expect(getDiscountPercent(5000, 5000)).toBe(0);
  });
});

describe('range()', () => {
  it('returns an inclusive range', () => {
    expect(range(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it('returns single-element array when start === end', () => {
    expect(range(3, 3)).toEqual([3]);
  });
});
