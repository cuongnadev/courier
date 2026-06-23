import { api } from "@/lib/axios";

import type { ApiResponse } from "@/types";

import type { ApiRequestDetailResponse } from "@/features/requests/types";

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

  if (!body.data) {
    throw new Error("Request detail API returned empty data.");
  }

  return body.data;
}