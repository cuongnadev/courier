import type { RequestMethod } from "@/types";

import type {
    ApiRequestHeaderResponse,
  RawBodyLanguage,
  RequestBodyType,
} from "@/features/requests/types";

export type SaveRequestHeaderPayload = Omit<ApiRequestHeaderResponse, "id" | "requestId" | "sortOrder">;

export type CreateRequestPayload = {
  name: string;

  method?: RequestMethod;
  uri: string;

  bodyType?: RequestBodyType;
  rawBodyLanguage?: RawBodyLanguage;
  rawBody?: string | null;

  graphqlQuery?: string | null;
  graphqlVariables?: string | null;

  description?: string | null;
  sortOrder?: number;

  headers: SaveRequestHeaderPayload[];
};

export type UpdateRequestPayload = {
  name?: string;

  method?: RequestMethod;
  uri?: string;

  bodyType?: RequestBodyType;
  rawBodyLanguage?: RawBodyLanguage;
  rawBody?: string | null;

  graphqlQuery?: string | null;
  graphqlVariables?: string | null;

  description?: string | null;
  sortOrder?: number;

  headers: SaveRequestHeaderPayload[];
};