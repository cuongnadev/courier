import YAML from "yaml";

import type {
  ApiRequestResponse,
} from "@/features/requests/types";
import type {
  ExportableCollection,
  OpenApiMethod,
  OpenApiOperation,
  OpenApiParameter,
  OpenApiPaths,
  OpenApiSchema,
} from "@/features/collections/types";

function hasRawBody(request: ApiRequestResponse): request is ApiRequestResponse & {
  rawBody: string | null;
  rawBodyLanguage: string;
  bodyType: string;
  graphqlQuery: string | null;
  graphqlVariables: string | null;
} {
  return "rawBody" in request;
}

export function slugify(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") || "collection"
  );
}

export function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}

function escapeShell(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n");
}

function requestHasBody(request: ApiRequestResponse) {
  if ("hasBody" in request) {
    return request.hasBody;
  }

  if (!hasRawBody(request)) {
    return false;
  }

  return Boolean(request.rawBody || request.graphqlQuery);
}

function getRequestBodyForCurl(request: ApiRequestResponse) {
  if (!hasRawBody(request)) {
    return "";
  }

  if (request.bodyType === "NONE") {
    return "";
  }

  if (request.bodyType === "RAW" && request.rawBody) {
    return `--data "${escapeShell(request.rawBody)}"`;
  }

  if (request.bodyType === "GRAPHQL" && request.graphqlQuery) {
    const graphqlBody = JSON.stringify({
      query: request.graphqlQuery,
      variables: request.graphqlVariables
        ? safeJsonParse(request.graphqlVariables)
        : undefined,
    });

    return `--data "${escapeShell(graphqlBody)}"`;
  }

  return "";
}

function safeJsonParse(value: string) {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return value;
  }
}

function getContentType(request: ApiRequestResponse) {
  if (!hasRawBody(request)) {
    return null;
  }

  if (request.bodyType === "GRAPHQL") {
    return "application/json";
  }

  if (request.bodyType !== "RAW") {
    return null;
  }

  switch (request.rawBodyLanguage) {
    case "JSON":
      return "application/json";
    case "XML":
      return "application/xml";
    case "HTML":
      return "text/html";
    case "JAVASCRIPT":
      return "application/javascript";
    case "TEXT":
    default:
      return "text/plain";
  }
}

function requestToCurl(request: ApiRequestResponse) {
  const lines = [`curl -X ${request.method} "${escapeShell(request.uri)}"`];

  const contentType = getContentType(request);

  if (contentType && requestHasBody(request)) {
    lines.push(`  -H "Content-Type: ${contentType}"`);
  }

  const body = getRequestBodyForCurl(request);

  if (body) {
    lines.push(`  ${body}`);
  }

  return lines.join(" \\\n");
}

export function exportCollectionAsCurl(collection: ExportableCollection) {
  const requests = collection.requests ?? [];

  if (requests.length === 0) {
    return "# No requests to export";
  }

  return requests
    .map((request) => {
      return [
        `# ${request.name}`,
        request.description ? `# ${request.description}` : "",
        requestToCurl(request),
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");
}

function normalizePathFromUri(uri: string) {
  try {
    const url = new URL(uri);

    return url.pathname || "/";
  } catch {
    const withoutQuery = uri.split("?")[0];

    if (withoutQuery.startsWith("/")) {
      return withoutQuery || "/";
    }

    return `/${withoutQuery}`;
  }
}

function getOpenApiRequestBody(
  request: ApiRequestResponse,
): OpenApiOperation["requestBody"] | null {
  if (!hasRawBody(request)) return null;
  if (request.bodyType === "NONE") return null;

  const contentType = getContentType(request);
  if (!contentType) return null;

  let example: unknown = request.rawBody ?? "";

  if (request.bodyType === "RAW" && request.rawBodyLanguage === "JSON") {
    example = request.rawBody ? safeJsonParse(request.rawBody) : {};
  }

  if (request.bodyType === "GRAPHQL") {
    example = {
      query: request.graphqlQuery,
      variables: request.graphqlVariables
        ? safeJsonParse(request.graphqlVariables)
        : {},
    };
  }

  return {
    required: true,
    content: {
      [contentType]: {
        schema: inferSchema(example),
        example,
      },
    },
  };
}

function inferSchema(value: unknown): OpenApiSchema {
  if (value === null || value === undefined) {
    return { type: "string" };
  }

  if (Array.isArray(value)) {
    return {
      type: "array",
      items:
        value.length > 0
          ? inferSchema(value[0])
          : { type: "string" },
    };
  }

  if (typeof value !== "object") {
    switch (typeof value) {
      case "string":
        return { type: "string" };
      case "number":
        return { type: "number" };
      case "boolean":
        return { type: "boolean" };
      default:
        return { type: "string" };
    }
  }

  const obj = value as Record<string, unknown>;

  const properties: Record<string, OpenApiSchema> = {};

  for (const [key, val] of Object.entries(obj)) {
    if (val === undefined) continue;
    properties[key] = inferSchema(val);
  }

  return {
    type: "object",
    properties,
  };
}

function requestToOpenApiOperation(
  request: ApiRequestResponse,
): OpenApiOperation {
  const requestBody = getOpenApiRequestBody(request);

  const parameters: OpenApiParameter[] =
    (request.headers ?? []).map((header) => ({
      in: "header",
      name: header.key,
      schema: {
        type: "string",
      },
      example: header.value,
    }));

  return {
    summary: request.name,
    description: request.description ?? "",
    ...(requestBody ? { requestBody } : {}),
    responses: {
      "200": {
        description: "Successful response",
      },
    },
    parameters,
  };
}

function buildOpenApiDocument(collection: ExportableCollection) {
  const paths: OpenApiPaths = {};

  for (const request of collection.requests ?? []) {
    const path = normalizePathFromUri(request.uri);

    const method = request.method.toLowerCase() as OpenApiMethod;

    if (!paths[path]) {
      paths[path] = {};
    }

    paths[path][method] = requestToOpenApiOperation(request);
  }

  return {
    openapi: "3.0.0",
    info: {
      title: collection.name,
      description: collection.description ?? "",
      version: "1.0.0",
    },
    paths,
  };
}

export function exportCollectionAsOpenApiYaml(collection: ExportableCollection) {
  const doc = buildOpenApiDocument(collection);
  return YAML.stringify(doc);
}

export function exportCollectionAsOpenApiJson(
  collection: ExportableCollection,
) {
  return buildOpenApiDocument(collection);
}