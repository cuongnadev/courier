import { useEffect } from "react";

import { useWorkspaces } from "@/features/workspaces/hooks/use-workspaces";
import { useWorkspaceStore } from "@/features/workspaces/store/workspace.store";

export function useCurrentWorkspace() {
  const { data: workspaces = [], isLoading } = useWorkspaces();

  const currentWorkspaceId = useWorkspaceStore(
    (state) => state.currentWorkspaceId,
  );
  const setCurrentWorkspaceId = useWorkspaceStore(
    (state) => state.setCurrentWorkspaceId,
  );

  const currentWorkspace =
    workspaces.find((workspace) => workspace.id === currentWorkspaceId) ??
    workspaces[0] ??
    null;

  useEffect(() => {
    if (!currentWorkspaceId && workspaces.length > 0) {
      setCurrentWorkspaceId(workspaces[0].id);
    }
  }, [currentWorkspaceId, workspaces, setCurrentWorkspaceId]);

  return {
    workspaces,
    currentWorkspace,
    currentWorkspaceId: currentWorkspace?.id ?? null,
    isLoading,
    setCurrentWorkspaceId,
  };
}