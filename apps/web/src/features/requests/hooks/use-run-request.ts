import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { runRequestApi } from "@/features/requests/api";
import type { RunRequestPayload } from "@/features/requests/types/request-run-payload.type";

type UseRunRequestParams = {
  workspaceId: string;
  collectionId: string;
  requestId: string;
};

export function useRunRequest({
  workspaceId,
  collectionId,
  requestId,
}: UseRunRequestParams) {
  return useMutation({
    mutationFn: (data: RunRequestPayload) =>
      runRequestApi({
        workspaceId,
        collectionId,
        requestId,
        data,
      }),

    onError: () => {
      toast.error("Failed to send request.");
    },
  });
}