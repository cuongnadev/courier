import { useQuery } from "@tanstack/react-query";

import { getRequestDetailApi } from "@/features/requests/api";

export function useRequestDetail(
  workspaceId?: string | null,
  collectionId?: string | null,
  requestId?: string | null,
) {
  return useQuery({
    queryKey: ["request-detail", workspaceId, collectionId, requestId],

    queryFn: async () => {
      if (!workspaceId || !collectionId || !requestId) {
        throw new Error("Request detail params are required.");
      }

      const request = await getRequestDetailApi({
        workspaceId,
        collectionId,
        requestId,
      });

      if (!request) {
        throw new Error("Request detail API returned empty data.");
      }

      return request;
    },

    enabled: Boolean(workspaceId && collectionId && requestId),

    staleTime: 1000 * 60 * 5,
  });
}