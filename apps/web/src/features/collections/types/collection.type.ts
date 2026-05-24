import type { COLLECTION_COLORS } from "@/constants/collection";
import type { ApiRequestListItem } from "@/features/requests/types/request.type";

export type CollectionColor =
  (typeof COLLECTION_COLORS)[number];

export type CollectionResponse = {
  id: string;
  workspaceId: string;

  name: string;
  description: string | null;

  color: CollectionColor;

  sortOrder: number;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  requestsCount: number;
};

export type CollectionDetailResponse =
  CollectionResponse & {
    requests: ApiRequestListItem[];
  };
