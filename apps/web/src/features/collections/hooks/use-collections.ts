import { useQuery } from '@tanstack/react-query';

import { getCollections } from '@/features/collections/api/get-collections.api';
import { mapCollectionResponseToCollection } from '@/features/collections/utils/map-collection';

export function useCollections(workspaceId?: string) {
  return useQuery({
    queryKey: ['collections', workspaceId],
    queryFn: async () => {
      const collections = await getCollections(workspaceId!);

      return collections.map(mapCollectionResponseToCollection);
    },
    enabled: Boolean(workspaceId),
  });
}