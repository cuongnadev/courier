import type { RequestMethod } from "@/types/api";

export type CollectionRequest = {
    id: string;
    name: string;
    method: RequestMethod;
    path: string;
};

export type Collection = {
    id: string;
    name: string;
    color: string;
    requests: CollectionRequest[];
};