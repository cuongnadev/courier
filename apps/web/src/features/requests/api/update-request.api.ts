import { api } from "@/lib/axios";

import type { ApiResponse } from "@/types/api.type";
import type { ApiRequestDetailResponse } from "@/features/requests/types/request.type";
import type { UpdateRequestPayload } from "@/features/requests/types/request-save-payload.type";

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