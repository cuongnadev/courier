import { useState } from "react";

import { RequestEditorTabs } from "@/features/requests/components/request-editor/";
import { RequestTabs } from "@/features/requests/components/request-editor/request-tabs/";
import { ResponsePanel } from "@/features/requests/components/request-editor/response";
import { RequestTopBar } from "@/features/requests/components/request-editor/RequestTopBar";

import type { ApiRequestDetailResponse } from "@/features/requests/types/request.type";
import type { RunRequestPayload } from "@/features/requests/types/request-run-payload.type";
import type { RequestRunResponse } from "@/features/requests/types/request-run.type";

import { useRunRequest } from "@/features/requests/hooks";

type RequestEditorProps = {
  workspaceId: string;
  collectionId: string;
  requestId: string;
  request: ApiRequestDetailResponse;
};

export function RequestEditor({
  workspaceId,
  collectionId,
  requestId,
  request,
}: RequestEditorProps) {
  const [requestPayload, setRequestPayload] = useState<RunRequestPayload>({
    method: request.method,
    uri: request.uri,

    bodyType: request.bodyType,
    rawBodyLanguage: request.rawBodyLanguage,
    rawBody: request.rawBody,

    headers:
      request.headers?.map((header) => ({
        key: header.key,
        value: header.value,
        enabled: header.enabled,
      })) ?? [],
  });

  const [response, setResponse] = useState<RequestRunResponse | null>(null);

  const runRequestMutation = useRunRequest({
    workspaceId,
    collectionId,
    requestId,
  });

  const handleSend = async () => {
    const result = await runRequestMutation.mutateAsync(requestPayload);
    setResponse(result);
  };

  return (
    <main className="flex min-h-0 h-full w-full overflow-y-auto flex-col bg-white overflow-auto dashboard-scrollbar">
      <RequestTabs
        activeRequestId={request.id}
        tabs={[
          {
            id: request.id,
            name: request.name,
          },
        ]}
      />

      <div className="flex min-h-0 flex-1">
        <section className="flex min-w-0 flex-1 flex-col border-r-[1.25px] border-[#E5E5E5]">
          <RequestTopBar
            method={requestPayload.method}
            uri={requestPayload.uri}
            isSending={runRequestMutation.isPending}
            onMethodChange={(method) =>
              setRequestPayload((prev) => ({
                ...prev,
                method,
              }))
            }
            onUriChange={(uri) =>
              setRequestPayload((prev) => ({
                ...prev,
                uri,
              }))
            }
            onSend={handleSend}
          />

          <RequestEditorTabs
            request={request}
            payload={requestPayload}
            onPayloadChange={setRequestPayload}
          />
        </section>

        <ResponsePanel
          response={response}
          isSending={runRequestMutation.isPending}
        />
      </div>
    </main>
  );
}