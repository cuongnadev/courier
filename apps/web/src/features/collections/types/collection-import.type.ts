import type { CollectionColor } from "@/features/collections/types";
import type { ApiRequestResponse, RawBodyLanguage, RequestBodyType } from "@/features/requests/types";
import type { RequestMethod } from "@/types";

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

export type ExportedRequestHeaderJson = {
  id?: unknown;
  requestId?: unknown;
  key?: unknown;
  value?: unknown;
  enabled?: unknown;
  sortOrder?: unknown;
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

  headers?: unknown;
};

export type ImportCollectionPayload = {
  name: string;
  description?: string;
  color?: CollectionColor;
  sortOrder?: number;
  requests?: ImportRequestPayload[];
};

export type ImportRequestHeaderPayload = {
  key: string;
  value?: string;
  enabled?: boolean;
  sortOrder?: number;
};

export type ImportRequestPayload = {
  name: string;
  method?: RequestMethod;
  uri: string;

  bodyType?: RequestBodyType;
  rawBodyLanguage?: RawBodyLanguage;
  rawBody?: string;

  graphqlQuery?: string;
  graphqlVariables?: string;

  description?: string;

  sortOrder?: number;

  headers?: ImportRequestHeaderPayload[];
};

/**
 * Optional: This type is used when you want to export in full format:
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