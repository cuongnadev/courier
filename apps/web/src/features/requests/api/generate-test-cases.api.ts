import { api } from "@/lib/axios";

import type { ApiResponse } from "@/types";

import type {
  DeleteTestCaseResponse,
  GenerateTestCasesPayload,
  GenerateTestCasesResponse,
  ListTestCasesResponse,
} from "@/features/requests/types";

type BaseTestCasesParams = {
  workspaceId: string;
  collectionId: string;
  requestId: string;
};

type GenerateTestCasesParams = BaseTestCasesParams & {
  data: GenerateTestCasesPayload;
};

type DeleteTestCaseParams = BaseTestCasesParams & {
  testCaseId: string;
};

export async function listRequestTestCasesApi({
  workspaceId,
  collectionId,
  requestId,
}: BaseTestCasesParams): Promise<ListTestCasesResponse> {
  const body = await api.get<unknown, ApiResponse<ListTestCasesResponse>>(
    `/workspaces/${workspaceId}/collections/${collectionId}/requests/${requestId}/testcases`,
  );

  if (!body.data) {
    throw new Error("List test cases API returned empty data.");
  }

  return body.data;
}

export async function generateTestCasesApi({
  workspaceId,
  collectionId,
  requestId,
  data,
}: GenerateTestCasesParams): Promise<GenerateTestCasesResponse> {
  const body = await api.post<unknown, ApiResponse<GenerateTestCasesResponse>>(
    `/workspaces/${workspaceId}/collections/${collectionId}/requests/${requestId}/generate-tests`,
    data,
    {
      timeout: 60_000,
    },
  );

  if (!body.data) {
    throw new Error("Generate test cases API returned empty data.");
  }

  return body.data;
}

export async function deleteRequestTestCaseApi({
  workspaceId,
  collectionId,
  requestId,
  testCaseId,
}: DeleteTestCaseParams): Promise<DeleteTestCaseResponse> {
  const body = await api.delete<unknown, ApiResponse<DeleteTestCaseResponse>>(
    `/workspaces/${workspaceId}/collections/${collectionId}/requests/${requestId}/testcases/${testCaseId}`,
  );

  if (!body.data) {
    throw new Error("Delete test case API returned empty data.");
  }

  return body.data;
}