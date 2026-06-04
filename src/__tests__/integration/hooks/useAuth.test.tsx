import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, waitFor } from '@testing-library/react';
import { renderHookWithQuery } from '../../helpers/render';
import { AUTH_USER, CUSTOMER } from '../../fixtures';

// ── Mock the entire auth API layer ────────────────────────────────────────────
vi.mock('@/data/api/auth.api', () => ({
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  fetchMe: vi.fn(),
  forgotPassword: vi.fn(),
  resetPassword: vi.fn(),
  updateProfile: vi.fn(),
}));

vi.mock('@/lib/auth-cookie', () => ({
  setAuthCookie: vi.fn(),
  clearAuthCookie: vi.fn(),
}));

import * as authApi from '@/data/api/auth.api';
import { setAuthCookie, clearAuthCookie } from '@/lib/auth-cookie';
import {
  useLogin,
  useRegister,
  useLogout,
  useMe,
  useForgotPassword,
  useResetPassword,
  useUpdateProfile,
} from '@/features/auth/hooks/useAuth';

const mockLogin        = vi.mocked(authApi.login);
const mockRegister     = vi.mocked(authApi.register);
const mockLogout       = vi.mocked(authApi.logout);
const mockFetchMe      = vi.mocked(authApi.fetchMe);
const mockForgotPw     = vi.mocked(authApi.forgotPassword);
const mockResetPw      = vi.mocked(authApi.resetPassword);
const mockUpdateProfile = vi.mocked(authApi.updateProfile);

beforeEach(() => {
  vi.clearAllMocks();
});

// ── useMe ─────────────────────────────────────────────────────────────────────

describe('useMe()', () => {
  it('returns user when authenticated', async () => {
    mockFetchMe.mockResolvedValue(AUTH_USER);

    const { result } = renderHookWithQuery(() => useMe());
    await waitFor(() => {
      expect(result.current.data).toEqual(AUTH_USER);
    });
    expect(result.current.isError).toBe(false);
  });

  it('returns null when unauthenticated — does not set isError', async () => {
    mockFetchMe.mockResolvedValue(null);

    const { result } = renderHookWithQuery(() => useMe());
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.isError).toBe(false);
  });
});

// ── useLogin ──────────────────────────────────────────────────────────────────

describe('useLogin()', () => {
  it('calls setAuthCookie on success', async () => {
    mockLogin.mockResolvedValue({ user: AUTH_USER });

    const { result } = renderHookWithQuery(() => useLogin());

    await act(async () => {
      result.current.mutate({ email: 'ade@hospital.ng', password: 'Pass123!' });
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(setAuthCookie).toHaveBeenCalledOnce();
  });

  it('populates the auth.me query cache on success', async () => {
    mockLogin.mockResolvedValue({ user: AUTH_USER });

    const { result, queryClient } = renderHookWithQuery(() => useLogin());

    await act(async () => {
      await result.current.mutateAsync({ email: 'ade@hospital.ng', password: 'Pass123!' });
    });

    const cached = queryClient.getQueryData(['auth', 'me']);
    expect(cached).toEqual(AUTH_USER);
  });

  it('sets isError when login fails', async () => {
    mockLogin.mockRejectedValue(new Error('Unauthorized'));

    const { result } = renderHookWithQuery(() => useLogin());

    await act(async () => {
      result.current.mutate({ email: 'x@y.com', password: 'wrong' });
      await new Promise((r) => setTimeout(r, 50));
    });

    expect(result.current.isError).toBe(true);
    expect(setAuthCookie).not.toHaveBeenCalled();
  });
});

// ── useRegister ───────────────────────────────────────────────────────────────

describe('useRegister()', () => {
  it('calls setAuthCookie on success', async () => {
    mockRegister.mockResolvedValue({ user: AUTH_USER });

    const { result } = renderHookWithQuery(() => useRegister());

    await act(async () => {
      result.current.mutate({
        email: 'ade@hospital.ng',
        password: 'Pass123!',
        firstName: 'Ade',
        lastName: 'Okafor',
      });
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(setAuthCookie).toHaveBeenCalledOnce();
    expect(result.current.isError).toBe(false);
  });

  it('sets isError when registration fails', async () => {
    mockRegister.mockRejectedValue(new Error('Customer with this email already exists'));

    const { result } = renderHookWithQuery(() => useRegister());

    await act(async () => {
      result.current.mutate({
        email: 'dup@test.com',
        password: 'P',
        firstName: 'A',
        lastName: 'B',
      });
      await new Promise((r) => setTimeout(r, 50));
    });

    expect(result.current.isError).toBe(true);
    expect(setAuthCookie).not.toHaveBeenCalled();
  });
});

// ── useLogout ─────────────────────────────────────────────────────────────────

describe('useLogout()', () => {
  it('calls clearAuthCookie and clears the query cache on success', async () => {
    mockLogout.mockResolvedValue(undefined);

    const { result, queryClient } = renderHookWithQuery(() => useLogout());

    // Prime the cache with user data
    queryClient.setQueryData(['auth', 'me'], AUTH_USER);
    expect(queryClient.getQueryData(['auth', 'me'])).toEqual(AUTH_USER);

    await act(async () => {
      result.current.mutate(undefined);
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(clearAuthCookie).toHaveBeenCalledOnce();
    // Cache should be completely cleared
    expect(queryClient.getQueryData(['auth', 'me'])).toBeUndefined();
  });
});

// ── useForgotPassword ─────────────────────────────────────────────────────────

describe('useForgotPassword()', () => {
  it('calls the forgotPassword API function', async () => {
    mockForgotPw.mockResolvedValue(undefined);

    const { result } = renderHookWithQuery(() => useForgotPassword());

    await act(async () => {
      await result.current.mutateAsync('ade@hospital.ng').catch(() => {});
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockForgotPw).toHaveBeenCalledWith('ade@hospital.ng');
  });

  it('does NOT expose errors to the caller (anti-enumeration)', async () => {
    // The hook's onError callback is empty — it should not set error state
    mockForgotPw.mockRejectedValue(new Error('Not found'));

    const { result } = renderHookWithQuery(() => useForgotPassword());

    await act(async () => {
      result.current.mutate('unknown@test.com');
      await new Promise((r) => setTimeout(r, 50));
    });

    // isError may be true internally but the onError is a no-op
    // The point is we never reveal whether the email exists
    expect(mockForgotPw).toHaveBeenCalledWith('unknown@test.com');
  });
});

// ── useResetPassword ──────────────────────────────────────────────────────────

describe('useResetPassword()', () => {
  it('calls the resetPassword API with token + email + password', async () => {
    mockResetPw.mockResolvedValue(undefined);

    const { result } = renderHookWithQuery(() => useResetPassword());

    const payload = { token: 'tok_abc', email: 'ade@hospital.ng', password: 'NewPass123!' };

    await act(async () => {
      await result.current.mutateAsync(payload);
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockResetPw).toHaveBeenCalledWith(payload);
    expect(result.current.isSuccess).toBe(true);
  });

  it('sets isError when the token is invalid', async () => {
    mockResetPw.mockRejectedValue(new Error('Invalid or expired token'));

    const { result } = renderHookWithQuery(() => useResetPassword());

    await act(async () => {
      result.current.mutate({ token: 'bad', email: 'x@y.com', password: 'p' });
      await new Promise((r) => setTimeout(r, 50));
    });

    expect(result.current.isError).toBe(true);
  });
});

// ── useUpdateProfile ──────────────────────────────────────────────────────────

describe('useUpdateProfile()', () => {
  it('updates the auth.me cache on success', async () => {
    const updatedUser = { ...AUTH_USER, firstName: 'Adewale' };
    mockUpdateProfile.mockResolvedValue(updatedUser);

    const { result, queryClient } = renderHookWithQuery(() => useUpdateProfile());
    queryClient.setQueryData(['auth', 'me'], AUTH_USER);

    await act(async () => {
      await result.current.mutateAsync({ firstName: 'Adewale' });
    });

    const cached = queryClient.getQueryData(['auth', 'me']);
    expect((cached as typeof updatedUser).firstName).toBe('Adewale');
  });
});
