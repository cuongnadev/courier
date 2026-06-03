import type { RequestMethod } from "@/types/api.type";

import type {
  ApiRequestDetailResponse,
  RawBodyLanguage,
  RequestBodyType,
} from "@/features/requests/types/request.type";

import type { RequestRunResponse } from "@/features/requests/types/request-run.type";

export type RunRequestHeaderPayload = {
  key: string;
  value: string;
  enabled: boolean;
};

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