import { api } from "@/lib/axios";

import type { ApiResponse } from "@/types";
import type { 
  RequestRunResponse,
  RunRequestPayload,
  CreateAndRunRequestPayload,
  CreateAndRunRequestResponse,
} from "@/features/requests/types";

type RunSavedRequestParams = {
  workspaceId: string;
  collectionId: string;
  requestId: string;
  data: RunRequestPayload;
};

export async function runSavedRequestApi({
  workspaceId,
  collectionId,
  requestId,
  data,
}: RunSavedRequestParams): Promise<RequestRunResponse> {
  const body = await api.post<unknown, ApiResponse<RequestRunResponse>>(
    `/workspaces/${workspaceId}/collections/${collectionId}/requests/${requestId}/run`,
    data,
  );

  if (!body.data) {
    throw new Error("Run request API returned empty data.");
  }

  return body.data;
}

type CreateAndRunRequestParams = {
  workspaceId: string;
  collectionId: string;
  data: CreateAndRunRequestPayload;
};

export async function createAndRunRequestApi({
  workspaceId,
  collectionId,
  data,
}: CreateAndRunRequestParams): Promise<CreateAndRunRequestResponse> {
  const body = await api.post<
    unknown,
    ApiResponse<CreateAndRunRequestResponse>
  >(
    `/workspaces/${workspaceId}/collections/${collectionId}/requests/run`,
    data,
  );

  if (!body.data) {
    throw new Error("Create and run request API returned empty data.");
  }

  return body.data;
}