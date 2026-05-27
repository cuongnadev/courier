import { useQuery } from "@tanstack/react-query";
import { getCollections } from "@/features/collections/api/get-collections.api";

export function useCollections(
  workspaceId: string | null,
) {
  return useQuery({
    queryKey: ['collections', workspaceId],

    queryFn: () =>
      getCollections(workspaceId!),

    enabled: Boolean(workspaceId),
  });
}