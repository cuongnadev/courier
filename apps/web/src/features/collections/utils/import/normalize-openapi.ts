import type {
  ImportCollectionPayload,
  ImportRequestPayload,
} from "@/features/collections/types";

type OpenApiDocument = {
  openapi?: string;
  info?: {
    title?: string;
    description?: string;
  };
  servers?: OpenApiServer[];
  paths?: OpenApiPaths;
};

type OpenApiServer = {
  url: string;
};

type OpenApiPaths = Record<
  string,
  Partial<Record<OpenApiMethod, OpenApiOperation>>
>;

type OpenApiMethod =
  | "get"
  | "post"
  | "put"
  | "patch"
  | "delete";

type OpenApiOperation = {
  summary?: string;
  description?: string;

  requestBody?: {
    content?: Record<
      string,
      {
        example?: unknown;
      }
    >;
  };
};

const METHOD_MAP = {
  get: "GET",
  post: "POST",
  put: "PUT",
  patch: "PATCH",
  delete: "DELETE",
} as const;

export function normalizeOpenApi(
  data: unknown,
): ImportCollectionPayload {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid OpenAPI document.");
  }

  const document = data as OpenApiDocument;

  if (!document.paths) {
    throw new Error("Invalid OpenAPI document.");
  }

  const baseUrl = document.servers?.[0]?.url ?? "";

  const requests: ImportRequestPayload[] = [];

  Object.entries(document.paths ?? {}).forEach(([path, operations]) => {
    Object.entries(operations ?? {}).forEach(([method, operation]) => {
      if (!operation) return;

      const requestMethod = METHOD_MAP[
        method as OpenApiMethod
      ];

      if (!requestMethod) {
        return;
      }

      const example = Object.values(
        operation.requestBody?.content ?? {},
      )[0]?.example;

      // TODO: Parse OpenAPI query parameters (parameters[].in === "query").
      requests.push({
        name:
          operation.summary ??
          `${method.toUpperCase()} ${path}`,

        method: requestMethod,

        uri: `${baseUrl}${path}`,

        description: operation.description,

        bodyType: operation.requestBody ? "RAW" : "NONE",

        rawBodyLanguage: operation.requestBody
          ? "JSON"
          : undefined,

        rawBody: example
          ? JSON.stringify(example, null, 2)
          : undefined,

        // TODO: Parse OpenAPI header parameters (parameters[].in === "header").
        headers: [],
      });
    });
  });

  return {
    name: document.info?.title ?? "Imported OpenAPI",
    description: document.info?.description,
    requests,
  };
}