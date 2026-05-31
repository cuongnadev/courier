import type {
  RawBodyLanguage,
  RequestBodyType,
} from "@/features/requests/types/request.type";

import type { RequestMethod } from "@/types/api.type";

import type {
  CollectionColor,
  ExportedCollectionJson,
  ExportedRequestJson,
  ImportCollectionPayload,
} from "@/features/collections/types";

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

const DEFAULT_COLLECTION_COLOR: CollectionColor = "#10B981" as CollectionColor;

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function toNullableString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
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

function isCollectionColor(value: unknown): value is CollectionColor {
  return typeof value === "string" && /^#[0-9A-Fa-f]{6}$/.test(value);
}

function normalizeRequest(
  request: ExportedRequestJson,
  index: number,
): ImportCollectionPayload["requests"][number] {
  if (!isString(request.name) || !request.name.trim()) {
    throw new Error(`Request #${index + 1} is missing name.`);
  }

  if (!isRequestMethod(request.method)) {
    throw new Error(`Request "${request.name}" has invalid method.`);
  }

  if (!isString(request.uri) || !request.uri.trim()) {
    throw new Error(`Request "${request.name}" is missing URI.`);
  }

  return {
    name: request.name.trim(),
    method: request.method,
    uri: request.uri.trim(),

    bodyType: isRequestBodyType(request.bodyType)
      ? request.bodyType
      : "NONE",

    rawBodyLanguage: isRawBodyLanguage(request.rawBodyLanguage)
      ? request.rawBodyLanguage
      : "JSON",

    rawBody: toNullableString(request.rawBody),

    graphqlQuery: toNullableString(request.graphqlQuery),
    graphqlVariables: toNullableString(request.graphqlVariables),

    description: toNullableString(request.description),

    sortOrder:
      typeof request.sortOrder === "number" ? request.sortOrder : index,
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
    description: toNullableString(collection.description),

    color: isCollectionColor(collection.color)
      ? collection.color
      : DEFAULT_COLLECTION_COLOR,

    requests,
  };
}