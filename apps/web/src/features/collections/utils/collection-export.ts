import type {
  ExportableCollection,
  ExportableRequest,
} from "@/features/collections/types/collection-export.type";

function hasRawBody(request: ExportableRequest): request is ExportableRequest & {
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
  return value.replace(/"/g, '\\"');
}

function escapeYaml(value: string) {
  return value.replace(/"/g, '\\"');
}

function requestHasBody(request: ExportableRequest) {
  if ("hasBody" in request) {
    return request.hasBody;
  }

  if (!hasRawBody(request)) {
    return false;
  }

  return Boolean(request.rawBody || request.graphqlQuery);
}

function getRequestBodyForCurl(request: ExportableRequest) {
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

function getContentType(request: ExportableRequest) {
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

function requestToCurl(request: ExportableRequest) {
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

function getOpenApiRequestBody(request: ExportableRequest) {
  if (!hasRawBody(request)) {
    return null;
  }

  if (request.bodyType === "NONE") {
    return null;
  }

  const contentType = getContentType(request);

  if (!contentType) {
    return null;
  }

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
        schema: {
          type: "object",
          example,
        },
      },
    },
  };
}

function requestToOpenApiOperation(request: ExportableRequest) {
  const requestBody = getOpenApiRequestBody(request);

  return {
    summary: request.name,
    description: request.description ?? "",
    ...(requestBody ? { requestBody } : {}),
    responses: {
      "200": {
        description: "Successful response",
      },
    },
  };
}

export function exportCollectionAsOpenApi(collection: ExportableCollection) {
  const paths: Record<string, Record<string, unknown>> = {};

  for (const request of collection.requests ?? []) {
    const path = normalizePathFromUri(request.uri);
    const method = request.method.toLowerCase();

    if (!paths[path]) {
      paths[path] = {};
    }

    paths[path][method] = requestToOpenApiOperation(request);
  }

  const openApiDocument = {
    openapi: "3.0.0",
    info: {
      title: collection.name,
      description: collection.description ?? "",
      version: "1.0.0",
    },
    paths,
  };

  return objectToYaml(openApiDocument);
}

function objectToYaml(value: unknown, indent = 0): string {
  const space = " ".repeat(indent);

  if (value === null) {
    return "null";
  }

  if (typeof value === "string") {
    if (value === "") return '""';

    return `"${escapeYaml(value)}"`;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";

    return value
      .map((item) => {
        if (typeof item === "object" && item !== null) {
          return `${space}-\n${objectToYaml(item, indent + 2)}`;
        }

        return `${space}- ${objectToYaml(item, 0)}`;
      })
      .join("\n");
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);

    if (entries.length === 0) return "{}";

    return entries
      .map(([key, item]) => {
        if (item !== null && typeof item === "object" && !Array.isArray(item)) {
          return `${space}${key}:\n${objectToYaml(item, indent + 2)}`;
        }

        if (Array.isArray(item)) {
          if (item.length === 0) {
            return `${space}${key}: []`;
          }

          return `${space}${key}:\n${objectToYaml(item, indent + 2)}`;
        }

        return `${space}${key}: ${objectToYaml(item, 0)}`;
      })
      .join("\n");
  }

  return '""';
}