import { useQuery } from "@tanstack/react-query";

import { getRequestDetailApi } from "@/features/requests/api";

export function useRequestDetail(
  workspaceId?: string | null,
  collectionId?: string | null,
  requestId?: string | null,
) {
  return useQuery({
    queryKey: ["request-detail", workspaceId, collectionId, requestId],

    queryFn: () => {
      if (!workspaceId || !collectionId || !requestId) {
        throw new Error("Request detail params are required.");
      }

      return getRequestDetailApi({
        workspaceId,
        collectionId,
        requestId,
      });
    },

    enabled: Boolean(workspaceId && collectionId && requestId),
  });
}