import { useParams } from "@tanstack/react-router";

import { RequestEditor } from "@/features/requests/components/request-editor";

import { useRequestDetail } from "@/features/requests/hooks";

export default function RequestPage() {
  const { workspaceId, collectionId, requestId } = useParams({
    from: "/workspaces/$workspaceId/collections/$collectionId/requests/$requestId",
  });

  const {
    data: request,
    isLoading,
    isError,
  } = useRequestDetail(workspaceId, collectionId, requestId);

  if (isLoading) {
    return (
      <main className="flex min-h-0 flex-1 items-center justify-center bg-[#FAFAFA]">
        <p className="text-sm text-[#737373]">Loading request...</p>
      </main>
    );
  }

  if (isError || !request) {
    return (
      <main className="flex min-h-0 flex-1 items-center justify-center bg-[#FAFAFA]">
        <p className="text-sm text-red-600">Failed to load request.</p>
      </main>
    );
  }

  return (
    <RequestEditor
      workspaceId={workspaceId}
      collectionId={collectionId}
      requestId={requestId}
      request={request}
    />
  );
}