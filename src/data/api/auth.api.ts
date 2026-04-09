import { sdk } from '@/lib/medusa';
import type { HttpTypes } from '@medusajs/types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  facilityType?: string;
  cacDocUrl?: string;
  licenceDocUrl?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthResult {
  user: AuthUser;
}

function toAuthUser(customer: HttpTypes.StoreCustomer): AuthUser {
  return {
    id: customer.id,
    email: customer.email ?? '',
    firstName: customer.first_name ?? '',
    lastName: customer.last_name ?? '',
    phone: customer.phone ?? undefined,
  };
}

/** Sign in — SDK manages the token internally after a successful login. */
export async function login(payload: LoginPayload): Promise<AuthResult> {
  await sdk.auth.login('customer', 'emailpass', {
    email: payload.email,
    password: payload.password,
  });
  const { customer } = await sdk.store.customer.retrieve();
  return { user: toAuthUser(customer) };
}

/**
 * Register a new customer account.
 * Medusa creates the auth identity + customer record in one call.
 * We then update the profile with name and phone.
 */
export async function register(payload: RegisterPayload): Promise<AuthResult> {
  await sdk.auth.register('customer', 'emailpass', {
    email: payload.email,
    password: payload.password,
  });

  const { customer } = await sdk.store.customer.update({
    first_name: payload.firstName,
    last_name: payload.lastName,
    phone: payload.phone,
    metadata: {
      facility_type: payload.facilityType ?? null,
      cac_doc_url: payload.cacDocUrl ?? null,
      licence_doc_url: payload.licenceDocUrl ?? null,
      verification_status: 'pending',
    },
  });

  return { user: toAuthUser(customer) };
}

/** Sign out — clears the SDK's stored token. */
export async function logout(): Promise<void> {
  await sdk.auth.logout();
}

/**
 * Get the currently authenticated customer.
 * Returns null when the user is not logged in (401) instead of throwing,
 * so useMe() can treat it as "unauthenticated" rather than an error.
 */
export async function fetchMe(): Promise<AuthUser | null> {
  try {
    const { customer } = await sdk.store.customer.retrieve();
    return toAuthUser(customer);
  } catch {
    return null;
  }
}
