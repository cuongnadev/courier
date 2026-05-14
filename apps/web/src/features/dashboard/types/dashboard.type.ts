import type { RequestMethod } from "@/types/api";

import type { CollectionVariant } from "@/features/collections/types/collection.type";

export type RecentActivity = {
  id: string | number;
  method: RequestMethod;
  name: string;
  url: string;
  time: string;
  timestamp: string;
  status: string;
  success: boolean;
};

export type DashboardCollection = {
  id: string | number;
  name: string;
  requests: number;
  variant: CollectionVariant;
};

export type DashboardFlow = {
  id: string | number;
  name: string;
  nodes: number;
};