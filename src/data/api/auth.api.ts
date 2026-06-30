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
  creditTerm?: '30' | '60';
  cacDocUrl?: string;
  licenceDocUrl?: string;
}

export interface AuthUserAddress {
  firstName?: string;
  lastName?: string;
  address1?: string;
  city?: string;
  province?: string;
  phone?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  verificationStatus: 'not_submitted' | 'pending' | 'approved' | 'rejected';
  rejectionNotes?: string;
  facilityType?: string;
  creditTerm?: '30' | '60';
  cacDocUrl?: string;
  licenceDocUrl?: string;
  defaultAddress?: AuthUserAddress;
}

export interface AuthResult {
  user: AuthUser;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

function toAuthUser(customer: HttpTypes.StoreCustomer): AuthUser {
  const meta = (customer.metadata ?? {}) as Record<string, string | null>;
  const addresses = (customer as unknown as { addresses?: Array<{
    first_name?: string; last_name?: string; address_1?: string;
    city?: string; province?: string; phone?: string; is_default_shipping?: boolean;
  }> }).addresses ?? [];
  const addr = addresses.find((a) => a.is_default_shipping) ?? addresses[0];

  return {
    id: customer.id,
    email: customer.email ?? '',
    firstName: customer.first_name ?? '',
    lastName: customer.last_name ?? '',
    phone: customer.phone ?? undefined,
    verificationStatus: (meta.verification_status as AuthUser['verificationStatus']) ?? 'not_submitted',
    rejectionNotes: meta.rejection_notes ?? undefined,
    facilityType: meta.facility_type ?? undefined,
    creditTerm: (meta.credit_term as '30' | '60') ?? undefined,
    cacDocUrl: meta.cac_doc_url ?? undefined,
    licenceDocUrl: meta.licence_doc_url ?? undefined,
    defaultAddress: addr ? {
      firstName: addr.first_name ?? undefined,
      lastName:  addr.last_name  ?? undefined,
      address1:  addr.address_1  ?? undefined,
      city:      addr.city       ?? undefined,
      province:  addr.province   ?? undefined,
      phone:     addr.phone      ?? undefined,
    } : undefined,
  };
}

/** Sign in — SDK manages the token internally after a successful login. */
export async function login(payload: LoginPayload): Promise<AuthResult> {
  await sdk.auth.login('customer', 'emailpass', {
    email: payload.email,
    password: payload.password,
  });
  const { customer } = await sdk.store.customer.retrieve({ fields: '+metadata' });
  return { user: toAuthUser(customer) };
}

/**
 * Register a new customer account.
 * Step 1: sdk.auth.register creates the auth identity and returns a token.
 * Step 2: sdk.store.customer.create creates the customer profile (must use
 *         create, not update — no customer record exists yet at this point).
 */
export async function register(payload: RegisterPayload): Promise<AuthResult> {
  await sdk.auth.register('customer', 'emailpass', {
    email: payload.email,
    password: payload.password,
  });

  const { customer } = await sdk.store.customer.create({
    first_name: payload.firstName,
    last_name: payload.lastName,
    email: payload.email,
    phone: payload.phone,
    metadata: {
      facility_type: payload.facilityType ?? null,
      credit_term: payload.creditTerm ?? null,
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
    const { customer } = await sdk.store.customer.retrieve({ fields: '+metadata,+addresses' });
    return toAuthUser(customer);
  } catch {
    return null;
  }
}

/**
 * Request a password reset email. Always resolves (Medusa never reveals
 * whether the email exists — safe against enumeration attacks).
 */
export async function forgotPassword(email: string): Promise<void> {
  await sdk.auth.resetPassword('customer', 'emailpass', { identifier: email });
}

/**
 * Complete a password reset using the token delivered via email.
 * The reset URL must contain both ?token=xxx&email=xxx query params.
 */
export async function resetPassword({
  token,
  email,
  password,
}: {
  token: string;
  email: string;
  password: string;
}): Promise<void> {
  await sdk.auth.updateProvider('customer', 'emailpass', { email, password }, token);
}

/** Update editable profile fields (name, phone). Email changes are not supported here. */
export async function updateProfile(payload: UpdateProfilePayload): Promise<AuthUser> {
  const { customer } = await sdk.store.customer.update(
    {
      first_name: payload.firstName,
      last_name: payload.lastName,
      phone: payload.phone,
    },
    { fields: '+metadata' },
  );
  return toAuthUser(customer);
}
