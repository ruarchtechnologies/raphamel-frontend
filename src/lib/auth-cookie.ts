export const AUTH_COOKIE   = 'raphamel_auth';
export const STATUS_COOKIE = 'raphamel_status';

const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/** Set after a successful login / register. Middleware reads this to protect routes. */
export function setAuthCookie() {
  if (typeof document === 'undefined') return;
  document.cookie = `${AUTH_COOKIE}=1; path=/; max-age=${MAX_AGE}; SameSite=Lax`;
}

/** Persists verification status so middleware can gate non-approved users. */
export function setStatusCookie(status: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${STATUS_COOKIE}=${status}; path=/; max-age=${MAX_AGE}; SameSite=Lax`;
}

/** Clear both cookies on logout. */
export function clearAuthCookie() {
  if (typeof document === 'undefined') return;
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0`;
  document.cookie = `${STATUS_COOKIE}=; path=/; max-age=0`;
}
