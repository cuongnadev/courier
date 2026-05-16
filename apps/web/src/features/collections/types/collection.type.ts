import type { RequestMethod } from "@/types/api";

export type CollectionRequest = {
    id: string;
    name: string;
    method: RequestMethod;
    uri: string;
};

export type CollectionResponse = {
    id: string;
    name: string;
    variant: CollectionVariant;
    requests: CollectionRequest[];
};

export type CollectionVariant =
    | "blue"
    | "green"
    | "orange"
    | "purple"
    | "red"
    | "pink";