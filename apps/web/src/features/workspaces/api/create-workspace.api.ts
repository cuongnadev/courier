import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api.type";

import type { CreateWorkspaceFormValues } from "@/features/workspaces/schemas/create-workspace.schema";
import type { WorkspaceResponse } from "@/features/workspaces/types/workspace.type";

export async function createWorkspaceApi(
  data: CreateWorkspaceFormValues,
): Promise<WorkspaceResponse> {
  const body = await api.post<unknown, ApiResponse<WorkspaceResponse>>(
    "/workspaces",
    data,
  );

  return body.data;
}
