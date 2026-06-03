import type { RequestMethod } from "@/types/api.type";

import type {
  RawBodyLanguage,
  RequestBodyType,
} from "@/features/requests/types/request.type";

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
};