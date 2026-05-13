import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import type { AxiosError } from "axios";

import { loginApi } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { ErrorResponse } from "@/features/auth/types/auth.type";

export function useLogin() {
    const navigate = useNavigate();
    const setAuth = useAuthStore(
        (state) => state.setAuth
    );

    return useMutation({
        mutationFn: loginApi,

        onSuccess: async (data) => {
            setAuth(
                data.user,
                data.accessToken
            );

            toast.success(
                "Login successful"
            );

            await navigate({
                to: "/",
                replace: true,
            });
        },

        onError: (
            error: AxiosError<ErrorResponse>
        ) => {
            const message =
                error.response?.data?.message;

            switch (message) {
                case "INVALID_CREDENTIALS":
                    toast.error(
                        "Invalid email or password"
                    );
                    break;

                default:
                    toast.error(
                        "Something went wrong"
                    );
            }
        },
    });
}