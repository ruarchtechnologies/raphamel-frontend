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
import { login, register, logout, fetchMe } from '@/data/api/auth.api';
import type { LoginPayload, RegisterPayload, AuthUser } from '@/data/api/auth.api';
import { toast } from 'sonner';

export const authKeys = {
  me: ['auth', 'me'] as const,
};

/** Get the currently authenticated user. Returns null if not logged in. */
export function useMe() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: fetchMe,
    // Don't throw on 401 — just return null (user is not logged in)
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}

/** Login mutation.
 *
 * FLUTTER EQUIV: authCubit.login(email, password)
 *
 * USAGE:
 *   const { mutate: signIn, isPending } = useLogin();
 *   signIn({ email, password }, { onSuccess: () => router.push('/') });
 */
export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (data) => {
      // Populate the "me" cache so useMe() returns immediately without refetch
      // FLUTTER EQUIV: emit(AuthAuthenticated(user)) updates all BlocListeners
      queryClient.setQueryData(authKeys.me, data.user);
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
      toast.success('Account created successfully!');
    },
    onError: () => {
      toast.error('Registration failed. Please try again.');
    },
  });
}

/** Logout mutation. */
export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Clear ALL cached queries on logout — forces fresh fetch on next login
      // FLUTTER EQUIV: emit(AuthUnauthenticated()) + clearing all repository caches
      queryClient.clear();
      toast.success('Signed out successfully.');
    },
  });
}
