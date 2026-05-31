import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { importCollectionApi } from "@/features/collections/api/import-collection.api";
import type { ImportCollectionPayload } from "@/features/collections/types";

export function useImportCollection(workspaceId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ImportCollectionPayload) => {
      if (!workspaceId) {
        throw new Error("Workspace is required.");
      }

      return importCollectionApi({
        workspaceId,
        data: payload,
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["collections", workspaceId],
      });

      toast.success("Collection imported.");
    },

    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to import collection.";

      toast.error(message);
    },
  });
}