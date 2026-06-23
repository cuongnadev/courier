import { api } from "@/lib/axios";

import type { ApiResponse } from "@/types";
import type { WorkspaceResponse } from "@/features/workspaces/types";

import type { CreateWorkspaceFormValues } from "@/features/workspaces/schemas";

export async function createWorkspaceApi(
  data: CreateWorkspaceFormValues,
): Promise<WorkspaceResponse> {
  const body = await api.post<unknown, ApiResponse<WorkspaceResponse>>(
    "/workspaces",
    data,
  );

  return body.data;
}
