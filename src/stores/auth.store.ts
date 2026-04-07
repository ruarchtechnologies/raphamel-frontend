'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthUser {
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthStore {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isUnderReview: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      isUnderReview: false,

      login: (user) =>
        set({ user, isLoggedIn: true, isUnderReview: true }),

      logout: () =>
        set({ user: null, isLoggedIn: false, isUnderReview: false }),
    }),
    { name: 'raphamel-auth' },
  ),
);
