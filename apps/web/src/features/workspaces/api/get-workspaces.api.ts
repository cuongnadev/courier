import { api } from "@/lib/axios";

import type { WorkspaceResponse } from "@/features/workspaces/types/workspace.type";
import type { ApiResponse } from "@/types/api.type";

export async function getWorkspacesApi(): Promise<WorkspaceResponse[]> {
  const body = await api.get<unknown, ApiResponse<WorkspaceResponse[]>>(
    "/workspaces",
  );

  return body.data;
}