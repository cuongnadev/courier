import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { getMeApi } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/store/auth.store";

export function useAuthMe() {
    const setAuth = useAuthStore((state) => state.setAuth);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    const { data, isSuccess, isError, ...query } = useQuery({
        queryKey: ["auth", "me"],
        queryFn: getMeApi,
        retry: false,
    });

    useEffect(() => {
        if (isSuccess && data) {
            setAuth(data.user, data.accessToken);
        }
    }, [isSuccess, data, setAuth]);

    useEffect(() => {
        if (isError) {
            clearAuth();
        }
    }, [isError, clearAuth]);

    return {
        data,
        isSuccess,
        isError,
        ...query,
    };
}