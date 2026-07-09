import type { CollectionColor, OpenApiSchema } from "@/features/collections/types";
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

export type OpenApiDocument = {
  openapi?: string;
  info?: {
    title?: string;
    description?: string;
    version?: string;
  };
  servers?: OpenApiServer[];
  paths?: OpenApiPaths;
};

export type OpenApiServer = {
  url: string;
};

export type OpenApiPaths = Record<
  string,
  Partial<Record<OpenApiMethod, OpenApiOperation>>
>;

export type OpenApiMethod =
  | "get"
  | "post"
  | "put"
  | "patch"
  | "delete";

export type OpenApiMediaType = {
  schema?: OpenApiSchema;

  example?: unknown;

  examples?: Record<
    string,
    {
      value: unknown;
    }
  >;
};

export type OpenApiOperation = {
 summary?: string;
  description?: string;

  parameters?: OpenApiParameter[];

  requestBody?: {
    required?: boolean;
    content: Record<string, OpenApiMediaType>;
  };

  responses?: Record<
    string,
    {
      description?: string;
    }
  >;
};

export type OpenApiParameter = {
  name: string;

  in: "query" | "header" | "path" | "cookie";

  required?: boolean;

  schema?: OpenApiSchema;

  example?: unknown;
};