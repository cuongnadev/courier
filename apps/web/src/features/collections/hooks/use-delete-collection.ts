import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteCollectionApi } from "@/features/collections/api";

type UseDeleteCollectionParams = {
  workspaceId?: string | null;
};

type DeleteCollectionMutationPayload = {
  collectionId: string;
};

export function useDeleteCollection({
  workspaceId,
}: UseDeleteCollectionParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ collectionId }: DeleteCollectionMutationPayload) => {
      if (!workspaceId) {
        throw new Error("Workspace is required.");
      }

      await deleteCollectionApi({
        workspaceId,
        collectionId,
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["collections", workspaceId],
      });

      toast.success("Collection deleted.");
    },

    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete collection.";

      toast.error(message);
    },
  });
}