import { api } from "@/lib/axios";

import type { ApiResponse } from "@/types/api.type";
import type { ApiRequestDetailResponse } from "@/features/requests/types/request.type";
import type { CreateRequestPayload } from "@/features/requests/types/request-save-payload.type";

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