import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createCollectionApi } from "@/features/collections/api/create-collection.api";
import type { CreateCollectionFormValues } from "@/features/collections/schemas/create-collection.schema";

export function useCreateCollection(workspaceId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCollectionFormValues) => {
      if (!workspaceId) {
        throw new Error("Workspace is required.");
      }

      return createCollectionApi(workspaceId, data);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["collections", workspaceId],
      });

      toast.success("Collection created.");
    },

    onError: () => {
      toast.error("Could not create collection.");
    },
  });
}