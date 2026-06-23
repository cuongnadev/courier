import type { RequestMethod } from "@/types";

import type {
  ApiRequestDetailResponse,
  ApiRequestHeaderResponse,
  RawBodyLanguage,
  RequestBodyType,
  RequestRunResponse
} from "@/features/requests/types";

export type RunRequestHeaderPayload = Omit<ApiRequestHeaderResponse, "sortOrder" | "requestId">;

export type RunRequestPayload = {
  method: RequestMethod;
  uri: string;

  bodyType: RequestBodyType;
  rawBodyLanguage: RawBodyLanguage;
  rawBody: string | null;

  graphqlQuery?: string | null;
  graphqlVariables?: string | null;

  headers: RunRequestHeaderPayload[];
};

export type CreateAndRunRequestPayload = RunRequestPayload & {
  name: string;
  description?: string | null;
  sortOrder?: number;
};

export type CreateAndRunRequestResponse = {
  request: ApiRequestDetailResponse;
  run: RequestRunResponse;
};