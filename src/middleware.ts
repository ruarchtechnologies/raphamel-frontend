import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Inlined here — middleware edge runtime can't reliably import local modules
const AUTH_COOKIE   = 'raphamel_auth';
const STATUS_COOKIE = 'raphamel_status';

/**
 * WAITLIST_MODE — when set to "true" in .env, all routes except /waitlist
 * are redirected to /waitlist.
 *
 * Usage in .env:
 *   WAITLIST_MODE=true
 */
const WAITLIST_MODE = process.env.WAITLIST_MODE === 'true';

const ALWAYS_ALLOWED = ['/waitlist', '/favicon.ico', '/logo.png'];
const ALWAYS_ALLOWED_PREFIXES = ['/_next', '/api'];

/** Routes that require the user to be logged in. */
const PROTECTED_PREFIXES = ['/account', '/checkout'];

/** Auth pages — already-logged-in users should not land here. */
const AUTH_PAGES = ['/login', '/register', '/forgot-password', '/reset-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Waitlist mode ──────────────────────────────────────────────────────────
  if (WAITLIST_MODE) {
    const isAllowed =
      ALWAYS_ALLOWED.some((p) => pathname === p) ||
      ALWAYS_ALLOWED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
    if (!isAllowed) return NextResponse.redirect(new URL('/waitlist', request.url));
    return NextResponse.next();
  }

  const isAuthenticated = request.cookies.has(AUTH_COOKIE);
  const verificationStatus = request.cookies.get(STATUS_COOKIE)?.value;

  // ── Protect /account/* and /checkout — redirect unauthenticated users ─────
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Redirect logged-in users away from auth pages ─────────────────────────
  const isAuthPage = AUTH_PAGES.some((p) => pathname === p);
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/account', request.url));
  }

  // ── Gate non-approved users — only /account is accessible ────────────────
  // Only applies when the status cookie is explicitly set to a non-approved value.
  // Users without the cookie (old sessions) are let through until they visit /account,
  // which syncs the cookie.
  if (
    isAuthenticated &&
    verificationStatus &&
    verificationStatus !== 'approved' &&
    !pathname.startsWith('/account')
  ) {
    return NextResponse.redirect(new URL('/account', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
