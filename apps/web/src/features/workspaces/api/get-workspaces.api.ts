import { api } from "@/lib/axios";

import type { ApiResponse } from "@/types";
import type { WorkspaceResponse } from "@/features/workspaces/types";

export async function getWorkspacesApi(): Promise<WorkspaceResponse[]> {
  const body = await api.get<unknown, ApiResponse<WorkspaceResponse[]>>(
    "/workspaces",
  );

  return body.data;
}