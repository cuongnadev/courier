import type { RequestMethod } from "@/types/api.type";
import type { RequestBodyType } from "@/features/requests/types";

import type { COLLECTION_COLORS } from "@/constants/collection";

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

export type CollectionRequest  = {
  id: string;
  collectionId: string;

  name: string;
  method: RequestMethod;
  uri: string;

  description: string | null;

  bodyType: RequestBodyType;

  headersCount: number;
  hasBody: boolean;

  updatedAt: string;
};

export type CollectionDetailResponse =
  CollectionResponse & {
    requests: CollectionRequest[];
  };
