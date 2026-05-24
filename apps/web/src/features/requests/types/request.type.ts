import type { RequestMethod } from "@/types/api";

export type RequestBodyType =
  | "NONE"
  | "RAW"
  | "FORM_DATA"
  | "X_WWW_FORM_URLENCODED"
  | "GRAPHQL";

export type RawBodyLanguage =
  | "JSON"
  | "TEXT"
  | "XML"
  | "HTML"
  | "JAVASCRIPT";

export type ApiRequestResponse = {
  id: string;
  collectionId: string;

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

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  headersCount?: number;
  queryParamsCount?: number;
  pathParamsCount?: number;
  bodyParamsCount?: number;
  cookiesCount?: number;
};

export type ApiRequestListItem = {
  id: string;
  collectionId: string;

  name: string;
  method: RequestMethod;
  uri: string;

  description: string | null;

  bodyType: RequestBodyType;

  headersCount: number;
  hasBody: boolean;

  updatedAt: string;
};