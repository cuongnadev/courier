import type { RequestMethod } from "@/types/api.type";

import type {
  RawBodyLanguage,
  RequestBodyType,
} from "@/features/requests/types/request.type";

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

  headers: RunRequestHeaderPayload[];
};