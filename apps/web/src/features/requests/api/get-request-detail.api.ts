import { api } from "@/lib/axios";

import type { ApiResponse } from "@/types/api.type";
import type { ApiRequestDetailResponse } from "@/features/requests/types/request.type";

type GetRequestDetailParams = {
  workspaceId: string;
  collectionId: string;
  requestId: string;
};

export async function getRequestDetailApi({
  workspaceId,
  collectionId,
  requestId,
}: GetRequestDetailParams): Promise<ApiRequestDetailResponse> {
  const body = await api.get<unknown, ApiResponse<ApiRequestDetailResponse>>(
    `/workspaces/${workspaceId}/collections/${collectionId}/requests/${requestId}`,
  );

  return body.data;
}