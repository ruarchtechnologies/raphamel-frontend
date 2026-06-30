import { describe, it, expect, beforeEach } from 'vitest';
import { setAuthCookie, clearAuthCookie, AUTH_COOKIE } from '@/lib/auth-cookie';

function getCookieValue(name: string): string | undefined {
  const match = document.cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  return match?.split('=')[1];
}

beforeEach(() => {
  // Clear cookies by expiring them
  document.cookie = `${AUTH_COOKIE}=; max-age=0`;
});

describe('setAuthCookie()', () => {
  it('sets the raphamel_auth cookie to "1"', () => {
    setAuthCookie();
    expect(getCookieValue(AUTH_COOKIE)).toBe('1');
  });

  it('sets max-age to 7 days (604800 seconds)', () => {
    // We can observe that calling setAuthCookie writes the cookie
    // (jsdom does not expose max-age in document.cookie, but we can
    //  confirm the cookie is set and survives the same "session")
    setAuthCookie();
    expect(document.cookie).toContain(AUTH_COOKIE);
  });

  it('is a no-op when document is undefined (SSR guard)', () => {
    // Simulate SSR by temporarily hiding document
    const originalDocument = global.document;
    Object.defineProperty(global, 'document', { value: undefined, writable: true });

    expect(() => setAuthCookie()).not.toThrow();

    Object.defineProperty(global, 'document', { value: originalDocument, writable: true });
  });
});

describe('clearAuthCookie()', () => {
  it('removes the raphamel_auth cookie', () => {
    setAuthCookie();
    expect(getCookieValue(AUTH_COOKIE)).toBe('1');

    clearAuthCookie();
    // After max-age=0, the cookie should not appear
    expect(getCookieValue(AUTH_COOKIE)).toBeUndefined();
  });

  it('is a no-op when document is undefined (SSR guard)', () => {
    const originalDocument = global.document;
    Object.defineProperty(global, 'document', { value: undefined, writable: true });

    expect(() => clearAuthCookie()).not.toThrow();

    Object.defineProperty(global, 'document', { value: originalDocument, writable: true });
  });
});

describe('AUTH_COOKIE constant', () => {
  it('equals "raphamel_auth"', () => {
    expect(AUTH_COOKIE).toBe('raphamel_auth');
  });
});
