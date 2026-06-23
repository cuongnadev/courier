import { Navigate, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { useAuthStore } from "@/features/auth/store";
import { useWorkspaceStore } from "@/features/workspaces/store";

import { useWorkspaces } from "@/features/workspaces/hooks";

import { ROUTE_TO } from "@/constants";

export default function IndexRedirectPage() {
  const navigate = useNavigate();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const currentWorkspaceId = useWorkspaceStore(
    (state) => state.currentWorkspaceId,
  );

  const setCurrentWorkspaceId = useWorkspaceStore(
    (state) => state.setCurrentWorkspaceId,
  );

  const { data: workspaces = [], isLoading } = useWorkspaces();

  useEffect(() => {
    if (!isAuthenticated) return;
    if (isLoading) return;
    if (workspaces.length === 0) return;

    const isCurrentWorkspaceValid =
      currentWorkspaceId &&
      workspaces.some((workspace) => workspace.id === currentWorkspaceId);

    const nextWorkspaceId = isCurrentWorkspaceValid
      ? currentWorkspaceId
      : workspaces[0].id;

    setCurrentWorkspaceId(nextWorkspaceId);

    void navigate({
      to: ROUTE_TO.WORKSPACE_DASHBOARD,
      params: {
        workspaceId: nextWorkspaceId,
      },
      replace: true,
    });
  }, [
    currentWorkspaceId,
    isAuthenticated,
    isLoading,
    navigate,
    setCurrentWorkspaceId,
    workspaces,
  ]);

  if (!isAuthenticated) {
    return <Navigate to={ROUTE_TO.LOGIN} replace />;
  }

  return (
    <div className="flex h-screen items-center justify-center text-sm text-[#737373]">
      Loading workspace...
    </div>
  );
}