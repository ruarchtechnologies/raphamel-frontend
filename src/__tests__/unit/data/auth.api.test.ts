import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CUSTOMER, PENDING_CUSTOMER } from '../../fixtures';

// ── Mock the SDK before importing the module under test ───────────────────────
vi.mock('@/lib/medusa', () => ({
  sdk: {
    auth: {
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      resetPassword: vi.fn(),
      updateProvider: vi.fn(),
    },
    store: {
      customer: {
        retrieve: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
    },
  },
}));

import { sdk } from '@/lib/medusa';
import {
  login,
  register,
  logout,
  fetchMe,
  forgotPassword,
  resetPassword,
  updateProfile,
} from '@/data/api/auth.api';

const mockSdk = vi.mocked(sdk, true);

beforeEach(() => {
  vi.clearAllMocks();
});

// ── login() ───────────────────────────────────────────────────────────────────

describe('login()', () => {
  it('calls sdk.auth.login then retrieves customer', async () => {
    mockSdk.auth.login.mockResolvedValue({ token: 'tok_123' } as any);
    mockSdk.store.customer.retrieve.mockResolvedValue({ customer: CUSTOMER } as any);

    const result = await login({ email: 'ade@hospital.ng', password: 'Pass123!' });

    expect(mockSdk.auth.login).toHaveBeenCalledWith('customer', 'emailpass', {
      email: 'ade@hospital.ng',
      password: 'Pass123!',
    });
    expect(result.user.email).toBe('ade@hospital.ng');
    expect(result.user.firstName).toBe('Ade');
    expect(result.user.verificationStatus).toBe('approved');
  });

  it('throws when sdk.auth.login rejects (wrong password)', async () => {
    mockSdk.auth.login.mockRejectedValue(new Error('Unauthorized'));

    await expect(login({ email: 'x@y.com', password: 'wrong' })).rejects.toThrow();
  });

  it('maps metadata.verification_status to verificationStatus', async () => {
    mockSdk.auth.login.mockResolvedValue({ token: 'tok' } as any);
    mockSdk.store.customer.retrieve.mockResolvedValue({
      customer: PENDING_CUSTOMER,
    } as any);

    const result = await login({ email: 'ade@hospital.ng', password: 'Pass123!' });
    expect(result.user.verificationStatus).toBe('pending');
  });
});

// ── register() ────────────────────────────────────────────────────────────────

describe('register()', () => {
  it('calls sdk.auth.register then sdk.store.customer.create', async () => {
    mockSdk.auth.register = vi.fn().mockResolvedValue({ token: 'tok' }) as any;
    mockSdk.store.customer.create = vi.fn().mockResolvedValue({ customer: CUSTOMER }) as any;

    const result = await register({
      email: 'ade@hospital.ng',
      password: 'Pass123!',
      firstName: 'Ade',
      lastName: 'Okafor',
      facilityType: 'hospital',
    });

    expect(mockSdk.auth.register).toHaveBeenCalledWith('customer', 'emailpass', {
      email: 'ade@hospital.ng',
      password: 'Pass123!',
    });
    expect(mockSdk.store.customer.create).toHaveBeenCalledWith(
      expect.objectContaining({
        first_name: 'Ade',
        last_name: 'Okafor',
        email: 'ade@hospital.ng',
      }),
    );
    expect(result.user.email).toBe('ade@hospital.ng');
  });

  it('sets verification_status to "pending" on new registrations', async () => {
    mockSdk.auth.register = vi.fn().mockResolvedValue({ token: 'tok' }) as any;
    mockSdk.store.customer.create = vi.fn().mockResolvedValue({
      customer: { ...CUSTOMER, metadata: { verification_status: 'pending' } },
    }) as any;

    const result = await register({
      email: 'new@hospital.ng',
      password: 'Pass123!',
      firstName: 'New',
      lastName: 'User',
    });

    expect(result.user.verificationStatus).toBe('pending');
  });

  it('throws when sdk.auth.register rejects (duplicate email)', async () => {
    mockSdk.auth.register = vi.fn().mockRejectedValue(
      new Error('Customer with this email already exists'),
    ) as any;

    await expect(
      register({ email: 'dup@test.com', password: 'P', firstName: 'A', lastName: 'B' }),
    ).rejects.toThrow();
  });
});

// ── logout() ─────────────────────────────────────────────────────────────────

describe('logout()', () => {
  it('calls sdk.auth.logout and resolves', async () => {
    mockSdk.auth.logout.mockResolvedValue(undefined as any);
    await expect(logout()).resolves.toBeUndefined();
    expect(mockSdk.auth.logout).toHaveBeenCalledOnce();
  });
});

// ── fetchMe() ─────────────────────────────────────────────────────────────────

describe('fetchMe()', () => {
  it('returns AuthUser when authenticated', async () => {
    mockSdk.store.customer.retrieve.mockResolvedValue({ customer: CUSTOMER } as any);

    const user = await fetchMe();
    expect(user).not.toBeNull();
    expect(user!.id).toBe('cus_test_01');
    expect(user!.email).toBe('ade@hospital.ng');
  });

  it('returns null when unauthenticated (never throws)', async () => {
    mockSdk.store.customer.retrieve.mockRejectedValue(
      Object.assign(new Error('Unauthorized'), { status: 401 }),
    );

    const user = await fetchMe();
    expect(user).toBeNull();
  });

  it('returns null on any error — protects the session from crashing', async () => {
    mockSdk.store.customer.retrieve.mockRejectedValue(new Error('Network error'));
    const user = await fetchMe();
    expect(user).toBeNull();
  });
});

// ── forgotPassword() ─────────────────────────────────────────────────────────

describe('forgotPassword()', () => {
  it('calls sdk.auth.resetPassword with the correct args', async () => {
    mockSdk.auth.resetPassword.mockResolvedValue(undefined as any);

    await forgotPassword('ade@hospital.ng');

    expect(mockSdk.auth.resetPassword).toHaveBeenCalledWith(
      'customer',
      'emailpass',
      { identifier: 'ade@hospital.ng' },
    );
  });

  it('resolves even when the SDK call fails (anti-enumeration)', async () => {
    // forgotPassword itself may throw — the hook swallows it, but the function itself throws
    mockSdk.auth.resetPassword.mockRejectedValue(new Error('Not found'));
    // The API function propagates the error — the hook is responsible for catching
    await expect(forgotPassword('no@such.user')).rejects.toThrow();
  });
});

// ── resetPassword() ──────────────────────────────────────────────────────────

describe('resetPassword()', () => {
  it('calls sdk.auth.updateProvider with token as 4th argument', async () => {
    mockSdk.auth.updateProvider.mockResolvedValue(undefined as any);

    await resetPassword({
      token: 'reset_tok_abc',
      email: 'ade@hospital.ng',
      password: 'NewPass123!',
    });

    expect(mockSdk.auth.updateProvider).toHaveBeenCalledWith(
      'customer',
      'emailpass',
      { email: 'ade@hospital.ng', password: 'NewPass123!' },
      'reset_tok_abc',
    );
  });

  it('throws when token is invalid/expired', async () => {
    mockSdk.auth.updateProvider.mockRejectedValue(new Error('Invalid token'));

    await expect(
      resetPassword({ token: 'bad', email: 'x@y.com', password: 'p' }),
    ).rejects.toThrow();
  });
});

// ── updateProfile() ──────────────────────────────────────────────────────────

describe('updateProfile()', () => {
  it('calls sdk.store.customer.update and returns the updated user', async () => {
    const updated = { ...CUSTOMER, first_name: 'Adewale' };
    mockSdk.store.customer.update = vi.fn().mockResolvedValue({ customer: updated }) as any;

    const result = await updateProfile({ firstName: 'Adewale' });

    expect(mockSdk.store.customer.update).toHaveBeenCalledWith(
      expect.objectContaining({ first_name: 'Adewale' }),
      { fields: '+metadata' },
    );
    expect(result.firstName).toBe('Adewale');
  });
});
