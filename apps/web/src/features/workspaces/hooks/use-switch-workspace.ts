import { useNavigate } from "@tanstack/react-router";

import { useCurrentWorkspace } from "@/features/workspaces/hooks";

import { ROUTE_TO } from "@/constants";

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
      to: ROUTE_TO.WORKSPACE_DASHBOARD,
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