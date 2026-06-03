import type { RequestRunResponse } from "@/features/requests/types/request-run.type";

import { JsonCodeBlock } from "./JsonCodeBlock";

type ResponseRawPanelProps = {
  response: RequestRunResponse;
  headers: readonly (readonly [string, string])[];
};

function getReasonPhrase(statusCode?: number | null) {
  if (!statusCode) return "";

  const phrases: Record<number, string> = {
    200: "OK",
    201: "Created",
    204: "No Content",
    301: "Moved Permanently",
    302: "Found",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    409: "Conflict",
    422: "Unprocessable Entity",
    429: "Too Many Requests",
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable",
  };

  return phrases[statusCode] ?? "";
}

function buildRawResponse(
  response: RequestRunResponse,
  headers: readonly (readonly [string, string])[]
) {
  const statusCode = response.statusCode ?? null;
  const reasonPhrase = getReasonPhrase(statusCode);
  const responseBody = response.responseBody ?? response.errorMessage ?? "";

  const statusLine = statusCode
    ? `HTTP/1.1 ${statusCode}${reasonPhrase ? ` ${reasonPhrase}` : ""}`
    : `HTTP/1.1 ${response.status}`;

  const headerLines = headers.map(([key, value]) => `${key}: ${value}`);

  const metaHeaders = [
    response.durationMs !== undefined
      ? `x-request-duration: ${response.durationMs}ms`
      : null,
    response.responseSize !== undefined
      ? `x-response-size: ${response.responseSize}B`
      : null,
  ].filter(Boolean);

  return [
    statusLine,
    ...headerLines,
    ...metaHeaders,
    "",
    responseBody,
  ].join("\n");
}

export function ResponseRawPanel({
  response,
  headers,
}: ResponseRawPanelProps) {
  return <JsonCodeBlock value={buildRawResponse(response, headers)} mode="raw" />;
}