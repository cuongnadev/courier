import { api } from "@/lib/axios";

import type { ApiResponse } from "@/types/api.type";
import type { RequestRunResponse } from "@/features/requests/types/request-run.type";
import type { RunRequestPayload } from "@/features/requests/types/request-run-payload.type";

type RunRequestApiParams = {
  workspaceId: string;
  collectionId: string;
  requestId: string;
  data: RunRequestPayload;
};

export async function runRequestApi({
  workspaceId,
  collectionId,
  requestId,
  data,
}: RunRequestApiParams): Promise<RequestRunResponse> {
  const body = await api.post<unknown, ApiResponse<RequestRunResponse>>(
    `/workspaces/${workspaceId}/collections/${collectionId}/requests/${requestId}/run`,
    data,
  );

  return body.data;
}