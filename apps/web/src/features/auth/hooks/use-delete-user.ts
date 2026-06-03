import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { deleteUserApi, logoutApi } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/store/auth.store";

export function useDeleteUser() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: async () => {
      await deleteUserApi();

      try {
        await logoutApi();
      } catch {
        // The account is already deleted; clearing the client state is enough.
      }
    },

    onSuccess: async () => {
      clearAuth();
      queryClient.clear();
      toast.success("Account deleted.");

      await navigate({
        to: "/login",
        replace: true,
      });
    },

    onError: () => {
      toast.error("Could not delete account.");
    },
  });
}
