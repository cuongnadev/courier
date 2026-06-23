import { useMemo } from "react";

import type { ShareTarget } from "@/features/sharing/types";

export function useShareLink(
  target: ShareTarget,
  workspaceId?: string | null,
) {
  return useMemo(() => {
    const origin = window.location.origin;

    switch (target.type) {
      case "workspace":
        return `${origin}/workspaces/${target.id}`;

      case "collection":
        return `${origin}/workspaces/${workspaceId}/collections/${target.id}`;

      case "request":
        return `${origin}/workspaces/${workspaceId}/requests/${target.id}`;

      case "environment":
        return `${origin}/workspaces/${workspaceId}/environments/${target.id}`;

      case "folder":
        return `${origin}/workspaces/${workspaceId}/folders/${target.id}`;

      case "test-suite":
        return `${origin}/workspaces/${workspaceId}/test-suites/${target.id}`;

      default:
        return origin;
    }
  }, [
    target.id,
    target.type,
    workspaceId,
  ]);
}