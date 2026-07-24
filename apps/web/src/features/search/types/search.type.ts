import type { RequestMethod } from "@/types";

export type SearchItemType = "collection" | "request";

export type SearchItem = {
  id: string;

  type: SearchItemType;

  title: string;

  subtitle?: string;

  keywords?: string[];

  collectionId?: string;

  collectionName?: string;

  method?: RequestMethod;
};