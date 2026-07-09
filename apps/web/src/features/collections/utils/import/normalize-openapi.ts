import type {
  ImportCollectionPayload,
  ImportRequestPayload,
  OpenApiDocument,
  OpenApiMethod,
} from "@/features/collections/types";

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

  const document = data as Partial<OpenApiDocument>;

  if (!document.paths) {
    throw new Error("Invalid OpenAPI document.");
  }

  const baseUrl = document.servers?.[0]?.url ?? "";

  const requests: ImportRequestPayload[] = [];

  Object.entries(document.paths).forEach(([path, operations]) => {
    Object.entries(operations).forEach(([method, operation]) => {
      if (!operation) return;

      const requestMethod = METHOD_MAP[
        method as OpenApiMethod
      ];

      if (!requestMethod) {
        return;
      }

      // TODO: Support OpenAPI requestBody examples, schemas and multipart/form-data.
      const content = operation.requestBody?.content;

      const firstMedia = content
        ? Object.values(content)[0]
        : undefined;

      const example =
        firstMedia?.example ??
        Object.values(firstMedia?.examples ?? {})[0]?.value;

      const headers =
        operation.parameters
          ?.filter((p) => p.in === "header")
          .map((p, index) => ({
            key: p.name,
            value:
              p.example !== undefined
                ? String(p.example)
                : "",
            enabled: true,
            sortOrder: index,
          })) ?? [];

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

        headers,
      });
    });
  });

  return {
    name: document.info?.title ?? "Imported OpenAPI",
    description: document.info?.description,
    requests,
  };
}