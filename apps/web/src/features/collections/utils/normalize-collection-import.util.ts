import type {
  CollectionColor,
  ExportedCollectionJson,
  ExportedRequestHeaderJson,
  ExportedRequestJson,
  ImportCollectionPayload,
} from "@/features/collections/types";

import type {
  RawBodyLanguage,
  RequestBodyType,
} from "@/features/requests/types";

import type { RequestMethod } from "@/types";

const COLLECTION_COLOR_VALUES = [
  "#F59E0B",
  "#3B82F6",
  "#10B981",
  "#8B5CF6",
  "#EF4444",
  "#EC4899",
] as const satisfies readonly CollectionColor[];

const REQUEST_METHOD_VALUES = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
] as const satisfies readonly RequestMethod[];

const REQUEST_BODY_TYPE_VALUES = [
  "NONE",
  "RAW",
  "FORM_DATA",
  "X_WWW_FORM_URLENCODED",
  "GRAPHQL",
] as const satisfies readonly RequestBodyType[];

const RAW_BODY_LANGUAGE_VALUES = [
  "JSON",
  "TEXT",
  "XML",
  "HTML",
  "JAVASCRIPT",
] as const satisfies readonly RawBodyLanguage[];

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function toOptionalString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function toOptionalNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : undefined;
}

function toOptionalBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function isCollectionColor(value: unknown): value is CollectionColor {
  return (
    typeof value === "string" &&
    COLLECTION_COLOR_VALUES.includes(value as CollectionColor)
  );
}

function isRequestMethod(value: unknown): value is RequestMethod {
  return (
    typeof value === "string" &&
    REQUEST_METHOD_VALUES.includes(value as RequestMethod)
  );
}

function isRequestBodyType(value: unknown): value is RequestBodyType {
  return (
    typeof value === "string" &&
    REQUEST_BODY_TYPE_VALUES.includes(value as RequestBodyType)
  );
}

function isRawBodyLanguage(value: unknown): value is RawBodyLanguage {
  return (
    typeof value === "string" &&
    RAW_BODY_LANGUAGE_VALUES.includes(value as RawBodyLanguage)
  );
}

function normalizeHeader(
  header: ExportedRequestHeaderJson,
  index: number,
): NonNullable<
  NonNullable<ImportCollectionPayload["requests"]>[number]["headers"]
>[number] {
  if (!isString(header.key) || !header.key.trim()) {
    throw new Error(`Header #${index + 1} is missing key.`);
  }

  return {
    key: header.key.trim(),
    value: toOptionalString(header.value),
    enabled: toOptionalBoolean(header.enabled),
    sortOrder: toOptionalNumber(header.sortOrder) ?? index,
  };
}

function normalizeRequest(
  request: ExportedRequestJson,
  index: number,
): NonNullable<ImportCollectionPayload["requests"]>[number] {
  if (!isString(request.name) || !request.name.trim()) {
    throw new Error(`Request #${index + 1} is missing name.`);
  }

  if (!isString(request.uri) || !request.uri.trim()) {
    throw new Error(`Request "${request.name}" is missing URI.`);
  }

  const headers = Array.isArray(request.headers)
    ? request.headers.map((header, headerIndex) =>
        normalizeHeader(header as ExportedRequestHeaderJson, headerIndex),
      )
    : [];

  return {
    name: request.name.trim(),

    method: isRequestMethod(request.method) ? request.method : "GET",

    uri: request.uri.trim(),

    bodyType: isRequestBodyType(request.bodyType)
      ? request.bodyType
      : "NONE",

    rawBodyLanguage: isRawBodyLanguage(request.rawBodyLanguage)
      ? request.rawBodyLanguage
      : "JSON",

    rawBody: toOptionalString(request.rawBody),

    graphqlQuery: toOptionalString(request.graphqlQuery),
    graphqlVariables: toOptionalString(request.graphqlVariables),

    description: toOptionalString(request.description),
    sortOrder: toOptionalNumber(request.sortOrder) ?? index,

    headers,
  };
}

export function normalizeImportCollectionJson(
  json: unknown,
): ImportCollectionPayload {
  if (!json || typeof json !== "object") {
    throw new Error("Invalid collection file.");
  }

  const collection = json as ExportedCollectionJson;

  if (!isString(collection.name) || !collection.name.trim()) {
    throw new Error("Collection name is required.");
  }

  const requests = Array.isArray(collection.requests)
    ? collection.requests.map((request, index) =>
        normalizeRequest(request as ExportedRequestJson, index),
      )
    : [];

  return {
    name: collection.name.trim(),

    description: toOptionalString(collection.description),

    color: isCollectionColor(collection.color)
      ? collection.color
      : undefined,

    sortOrder: toOptionalNumber(collection.sortOrder),

    requests,
  };
}