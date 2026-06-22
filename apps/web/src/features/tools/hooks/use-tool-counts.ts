// Fake data for now, replace with backend query later
// import { mockToolCounts } from "../data/mock-tool-counts";

import { useFlows } from "@/features/flows/hooks";

import type { ToolCounts } from "@/features/tools/types";

export function useToolCounts(workspaceId?: string) {
    const {
        data: flows = [],
        isLoading,
        error,
    } = useFlows(workspaceId);

    const toolCounts: ToolCounts = {
    flows: flows.length,
    mockServers: 0,
    testSuites: 0,
  };

  return {
    toolCounts,
    isLoading,
    error,
  };
}