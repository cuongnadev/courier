import { api } from "@/lib/axios";

import type { ApiResponse } from "@/types";
import type { ApiRequestDetailResponse, UpdateRequestPayload } from "@/features/requests/types";

type UpdateRequestApiParams = {
  workspaceId: string;
  requestId: string;
  data: UpdateRequestPayload;
};

export async function updateRequestApi({
  workspaceId,
  requestId,
  data,
}: UpdateRequestApiParams): Promise<ApiRequestDetailResponse> {
  const body = await api.patch<unknown, ApiResponse<ApiRequestDetailResponse>>(
    `/workspaces/${workspaceId}/requests/${requestId}`,
    data,
  );

  if (!body.data) {
    throw new Error("Update request API returned empty data.");
  }

  return body.data;
}