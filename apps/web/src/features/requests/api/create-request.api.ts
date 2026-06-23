import { api } from "@/lib/axios";

import type { ApiResponse } from "@/types";

import type { ApiRequestDetailResponse, CreateRequestPayload } from "@/features/requests/types";

type CreateRequestApiParams = {
  workspaceId: string;
  collectionId: string;
  data: CreateRequestPayload;
};

export async function createRequestApi({
  workspaceId,
  collectionId,
  data,
}: CreateRequestApiParams): Promise<ApiRequestDetailResponse> {
  const body = await api.post<unknown, ApiResponse<ApiRequestDetailResponse>>(
    `/workspaces/${workspaceId}/collections/${collectionId}/requests`,
    data,
  );

  if (!body.data) {
    throw new Error("Create request API returned empty data.");
  }

  return body.data;
}