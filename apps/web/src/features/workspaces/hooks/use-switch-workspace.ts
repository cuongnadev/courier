import { useNavigate } from "@tanstack/react-router";

import { useCurrentWorkspace } from "@/features/workspaces/hooks/use-current-workspace";

export function useSwitchWorkspace() {
  const navigate = useNavigate();

  const {
    workspaces,
    currentWorkspace,
    currentWorkspaceId,
    isLoading,
    setCurrentWorkspaceId,
  } = useCurrentWorkspace();

  const switchWorkspace = (workspaceId: string) => {
    if (workspaceId === currentWorkspaceId) return;

    setCurrentWorkspaceId(workspaceId);

    navigate({
      to: "/workspaces/$workspaceId",
      params: {
        workspaceId,
      },
    });
  };

  return {
    workspaces,
    currentWorkspace,
    currentWorkspaceId,
    isLoading,
    switchWorkspace,
  };
}