import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  updateCollectionApi,
  type UpdateCollectionPayload,
} from "@/features/collections/api";

type UseUpdateCollectionParams = {
  workspaceId?: string | null;
};

type UpdateCollectionMutationPayload = {
  collectionId: string;
  data: UpdateCollectionPayload;
};

export function useUpdateCollection({
  workspaceId,
}: UseUpdateCollectionParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      collectionId,
      data,
    }: UpdateCollectionMutationPayload) => {
      if (!workspaceId) {
        throw new Error("Workspace is required.");
      }

      return updateCollectionApi({
        workspaceId,
        collectionId,
        data,
      });
    },

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["collections", workspaceId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["collection", workspaceId, variables.collectionId],
        }),
      ]);

      toast.success("Collection updated.");
    },

    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update collection.";

      toast.error(message);
    },
  });
}