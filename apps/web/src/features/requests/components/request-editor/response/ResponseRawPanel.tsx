import type { RequestRunResponse } from "@/features/requests/types/request-run.type";

import { JsonCodeBlock } from "./JsonCodeBlock";

type ResponseRawPanelProps = {
  response: RequestRunResponse;
};

function buildRawResponse(response: RequestRunResponse) {
  const statusCode = response.statusCode ?? "";
  const durationMs = response.durationMs ?? "-";
  const responseSize = response.responseSize ?? 0;
  const responseBody = response.responseBody ?? "";
  const errorMessage = response.errorMessage;

  if (errorMessage) {
    return `HTTP/1.1 ERROR
x-request-duration: ${durationMs}ms
x-response-size: ${responseSize}B

${errorMessage}`;
  }

  return `HTTP/1.1 ${statusCode}
x-request-duration: ${durationMs}ms
x-response-size: ${responseSize}B

${responseBody}`;
}

export function ResponseRawPanel({ response }: ResponseRawPanelProps) {
  return <JsonCodeBlock value={buildRawResponse(response)} mode="raw" />;
}