/**
 * FLUTTER EQUIV: AuthCubit / AuthNotifier
 *
 * Handles login, register, logout mutations and the current user query.
 *
 * In Flutter with BLoC:
 *   class AuthCubit extends Cubit<AuthState> {
 *     Future<void> login(String email, String password) async {
 *       emit(AuthLoading());
 *       try {
 *         final user = await authRepo.login(email, password);
 *         emit(AuthAuthenticated(user));
 *       } catch (e) {
 *         emit(AuthError(e.toString()));
 *       }
 *     }
 *   }
 *
 * In React Query: mutations (create/update/delete) use `useMutation`.
 * Reads use `useQuery`. This mirrors BLoC events vs states.
 *
 * KEY DIFFERENCE:
 * - Flutter BLoC: you ADD AN EVENT and the BLoC EMITS A STATE
 * - React Query: you CALL mutate() and the hook gives you { isPending, isError, data }
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { login, register, logout, fetchMe, updateProfile, forgotPassword, resetPassword } from '@/data/api/auth.api';
import type { LoginPayload, RegisterPayload, UpdateProfilePayload } from '@/data/api/auth.api';
import { setAuthCookie, setStatusCookie, clearAuthCookie } from '@/lib/auth-cookie';
import { toast } from 'sonner';

export const authKeys = {
  me: ['auth', 'me'] as const,
};

/** Get the currently authenticated user. Returns null if not logged in. */
export function useMe() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: fetchMe,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}

/** Login mutation. */
export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.me, data.user);
      setAuthCookie();
      setStatusCookie(data.user.verificationStatus);
      toast.success(`Welcome back, ${data.user.firstName}!`);
    },
    onError: () => {
      toast.error('Invalid email or password.');
    },
  });
}

/** Register mutation. */
export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.me, data.user);
      setAuthCookie();
      setStatusCookie(data.user.verificationStatus);
      toast.success('Account created successfully!');
    },
    onError: (error: unknown) => {
      const message = (error as { message?: string })?.message ?? '';
      if (message.toLowerCase().includes('already exists')) {
        toast.error('An account with this email already exists. Try signing in instead.');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    },
  });
}

/** Logout mutation. Clears all cache + the auth cookie. Caller handles redirect. */
export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      clearAuthCookie();
      toast.success('Signed out successfully.');
    },
  });
}

/**
 * Send a password reset email. Always succeeds — Medusa never exposes
 * whether the email exists.
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
    onError: () => {
      // Don't reveal failure — show success regardless
    },
  });
}

/**
 * Complete a password reset with the token + email from the reset link.
 * On success, caller should redirect to /login.
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: { token: string; email: string; password: string }) =>
      resetPassword(payload),
    onSuccess: () => {
      toast.success('Password reset successfully. Please sign in.');
    },
    onError: () => {
      toast.error('Invalid or expired reset link. Please request a new one.');
    },
  });
}

/** Update the current customer profile. */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me, user);
      toast.success('Profile updated.');
    },
    onError: () => {
      toast.error('Failed to update profile. Please try again.');
    },
  });
}
