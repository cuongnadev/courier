import type { RequestMethod } from "@/types/api";
import type { COLLECTION_COLORS } from "@/constants/collection";

export type CollectionRequest = {
    id: string;
    name: string;
    color: typeof COLLECTION_COLORS[number];
    method: RequestMethod;
    uri: string;
    requests: CollectionRequest[];
};
