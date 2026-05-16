import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import {
    getMeApi,
    refreshTokenApi,
} from "@/features/auth/api/auth.api";

import { useAuthStore } from "@/features/auth/store/auth.store";

export function useAuthSession() {
    const accessToken = useAuthStore(
        (state) => state.accessToken
    );

    const isAuthenticated = useAuthStore(
        (state) => state.isAuthenticated
    );

    const setAuth = useAuthStore(
        (state) => state.setAuth
    );

    const clearAuth = useAuthStore(
        (state) => state.clearAuth
    );

    const query = useQuery({
        queryKey: [
            "auth",
            accessToken ? "me" : "refresh",
        ],

        queryFn: accessToken
            ? getMeApi
            : refreshTokenApi,

        retry: false,

        enabled: !isAuthenticated,
    });

    const {
        isSuccess,
        isError,
        data: authData,
    } = query;

    useEffect(() => {
        if (!isSuccess || !authData) {
            return;
        }

        if (authData.accessToken) {
            setAuth(
                authData.user,
                authData.accessToken
            );

            return;
        }

        if (accessToken) {
            setAuth(
                authData.user,
                accessToken
            );
        }
    }, [
        isSuccess,
        authData,
        accessToken,
        setAuth,
    ]);

    useEffect(() => {
        if (isError) {
            clearAuth();
        }
    }, [isError, clearAuth]);

    return query;
}