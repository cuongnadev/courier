import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import type { AxiosError } from "axios";

import { registerApi } from "@/features/auth/api/auth.api";
import type { ErrorResponse } from "@/features/auth/types/auth.type";

export function useRegister() {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: registerApi,

        onSuccess: async () => {
            toast.success(
                "Account created successfully",
            );

            await navigate({
                to: "/login",
            });
        },

        onError: (
            error: AxiosError<ErrorResponse>,
        ) => {
            const message =
                error.response?.data?.message;

            switch (message) {
                case "EMAIL_ALREADY_EXISTS":
                    toast.error("Email already exists");
                    break;

                default:
                    toast.error(
                        "Something went wrong"
                    );
            }
        },
    });
}