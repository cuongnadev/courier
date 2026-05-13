import { create } from "zustand";

import { persist } from "zustand/middleware";

import type { User } from "@/features/auth/types/auth.type";

type AuthStore = {
    user: User | null;

    accessToken: string | null;

    isAuthenticated: boolean;

    setAuth: (
        user: User,
        accessToken: string
    ) => void;

    clearAuth: () => void;
};

export const useAuthStore =
    create<AuthStore>()(
        persist(
            (set) => ({
                user: null,

                accessToken: null,

                isAuthenticated: false,

                setAuth: (user, accessToken) =>
                    set({
                        user,
                        accessToken,
                        isAuthenticated: true,
                    }),

                clearAuth: () =>
                    set({
                        user: null,
                        accessToken: null,
                        isAuthenticated: false,
                    }),
            }),
            {
                name: 'auth-storage',
            }
        )
    );