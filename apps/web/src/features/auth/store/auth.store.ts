import { create } from "zustand";

import type { AuthStore } from "@/features/auth/types/auth.type";

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  setAuth: (user, accessToken) => {
    set({
      user,
      accessToken,
      isAuthenticated: true,
    });
  },

  setAccessToken: (accessToken) => {
    set({
      accessToken,
    });
  },

  clearAuth: () => {
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    });
  },
}));