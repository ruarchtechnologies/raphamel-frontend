/**
 * FLUTTER EQUIV: lib/data/datasources/auth_remote_datasource.dart
 *
 * Auth API functions. The JWT access token is managed by src/lib/api.ts
 * interceptors — these functions just call the right endpoints.
 */

import api, { setAccessToken } from '@/lib/api';
import type { AuthResponse, MessageResponse } from '@/types/index';

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
  /** 'customer' | 'vendor' */
  role?: string;
}

/** Sign in — returns tokens + user. Backend sets httpOnly refresh cookie. */
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', payload);
  setAccessToken(data.accessToken);
  return data;
}

/** Register a new account. */
export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', payload);
  setAccessToken(data.accessToken);
  return data;
}

/** Sign out — clears server-side refresh cookie. */
export async function logout(): Promise<void> {
  await api.post('/auth/logout');
  setAccessToken(null);
}

/** Request password reset email. */
export async function forgotPassword(email: string): Promise<MessageResponse> {
  const { data } = await api.post<MessageResponse>('/auth/forgot-password', { email });
  return data;
}

/** Get currently authenticated user profile. */
export async function fetchMe() {
  const { data } = await api.get('/auth/me');
  return data;
}
