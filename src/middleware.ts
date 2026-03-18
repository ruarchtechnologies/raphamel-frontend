import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * WAITLIST_MODE — when set to "true" in .env, all routes except /waitlist
 * are redirected to /waitlist. This lets you put the whole site in
 * pre-launch mode with a single env flag.
 *
 * Usage in .env:
 *   WAITLIST_MODE=true
 */
const WAITLIST_MODE = process.env.WAITLIST_MODE === 'true';

// Paths that are always allowed through — even in waitlist mode
const ALWAYS_ALLOWED = ['/waitlist', '/favicon.ico', '/logo.png'];
const ALWAYS_ALLOWED_PREFIXES = ['/_next', '/api'];

export function middleware(request: NextRequest) {
  if (!WAITLIST_MODE) return NextResponse.next();

  const { pathname } = request.nextUrl;

  // Allow static assets and waitlist itself
  const isAllowed =
    ALWAYS_ALLOWED.some((p) => pathname === p) ||
    ALWAYS_ALLOWED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isAllowed) return NextResponse.next();

  return NextResponse.redirect(new URL('/waitlist', request.url));
}

export const config = {
  /*
   * Match all paths EXCEPT Next.js internals and static file extensions.
   * This keeps middleware lightweight — it only runs on meaningful routes.
   */
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
