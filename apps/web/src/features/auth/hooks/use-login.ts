import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { loginApi } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { ErrorResponse } from "@/features/auth/types/auth.type";

export function useLogin() {
  const setAuth = useAuthStore(
    (state) => state.setAuth
  );

  return useMutation({
    mutationFn: loginApi,

    onSuccess: (data) => {
      setAuth(
        data.user,
        data.accessToken
      );

      toast.success(
        "Login successful"
      );
    },

    onError: (
      error: AxiosError<ErrorResponse>
    ) => {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong"
      );
    },
  });
}