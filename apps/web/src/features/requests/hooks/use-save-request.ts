import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createRequestApi,
  updateRequestApi,
} from "@/features/requests/api";

export function useCreateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRequestApi,

    onSuccess: async (_createdRequest, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["collections", variables.workspaceId],
      });

      toast.success("Request saved.");
    },

    onError: () => {
      toast.error("Failed to create request.");
    },
  });
}

export function useUpdateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRequestApi,

    onSuccess: async (updatedRequest, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["collections", variables.workspaceId],
        }),

        queryClient.invalidateQueries({
          queryKey: [
            "request-detail",
            variables.workspaceId,
            updatedRequest.collectionId,
            variables.requestId,
          ],
        }),
      ]);

      toast.success("Changes saved.");
    },

    onError: () => {
      toast.error("Failed to save request.");
    },
  });
}