import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createAndRunRequestApi,
  runSavedRequestApi,
} from "@/features/requests/api";

export function useRunSavedRequest() {
  return useMutation({
    mutationFn: runSavedRequestApi,

    onError: () => {
      toast.error("Failed to send request.");
    },
  });
}

export function useCreateAndRunRequest() {
  return useMutation({
    mutationFn: createAndRunRequestApi,

    onError: () => {
      toast.error("Failed to create and send request.");
    },
  });
}