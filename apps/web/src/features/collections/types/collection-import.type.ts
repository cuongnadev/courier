import type { CollectionColor } from "@/features/collections/types";
import type { ApiRequestResponse, RawBodyLanguage, RequestBodyType } from "@/features/requests/types/request.type";


import type { RequestMethod } from "@/types/api.type";

export type ExportedCollectionJson = {
  id?: unknown;
  workspaceId?: unknown;

  name?: unknown;
  description?: unknown;

  color?: unknown;

  sortOrder?: unknown;

  createdAt?: unknown;
  updatedAt?: unknown;
  deletedAt?: unknown;

  requestsCount?: unknown;

  requests?: unknown;
};

export type ExportedRequestJson = {
  id?: unknown;
  collectionId?: unknown;

  name?: unknown;
  method?: unknown;
  uri?: unknown;

  bodyType?: unknown;
  rawBodyLanguage?: unknown;
  rawBody?: unknown;

  graphqlQuery?: unknown;
  graphqlVariables?: unknown;

  description?: unknown;

  sortOrder?: unknown;

  createdAt?: unknown;
  updatedAt?: unknown;
  deletedAt?: unknown;

  headersCount?: unknown;
  queryParamsCount?: unknown;
  pathParamsCount?: unknown;
  bodyParamsCount?: unknown;
  cookiesCount?: unknown;
};

export type ImportCollectionPayload = {
  name: string;
  description: string | null;
  color: CollectionColor;
  requests: ImportRequestPayload[];
};

export type ImportRequestPayload = {
  name: string;
  method: RequestMethod;
  uri: string;

  bodyType: RequestBodyType;
  rawBodyLanguage: RawBodyLanguage;
  rawBody: string | null;

  graphqlQuery: string | null;
  graphqlVariables: string | null;

  description: string | null;

  sortOrder: number;
};

/**
 * Optional: type này dùng khi bạn muốn export đúng full format:
 * CollectionResponse + requests array.
 */
export type ExportedCollectionFile = {
  id: string;
  workspaceId: string;

  name: string;
  description: string | null;

  color: CollectionColor;

  sortOrder: number;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  requestsCount: number;

  requests: ApiRequestResponse[];
};