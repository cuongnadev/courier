import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createWorkspaceApi } from "@/features/workspaces/api";
import { useWorkspaceStore } from "@/features/workspaces/store/workspace.store";
import type { CreateWorkspaceFormValues } from "@/features/workspaces/schemas/create-workspace.schema";

export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  const setCurrentWorkspaceId = useWorkspaceStore(
    (state) => state.setCurrentWorkspaceId,
  );

  return useMutation({
    mutationFn: (data: CreateWorkspaceFormValues) =>
      createWorkspaceApi({
        ...data,
        description: data.description?.trim() || undefined,
      }),

    onSuccess: async (workspace) => {
      setCurrentWorkspaceId(workspace.id);

      await queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      });

      toast.success("Workspace created.");
    },

    onError: () => {
      toast.error("Could not create workspace.");
    },
  });
}
