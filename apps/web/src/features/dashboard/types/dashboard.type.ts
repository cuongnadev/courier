import type { RecentActivityResponse } from "@/features/requests/types/request.type";
import type { CollectionVariant } from "@/features/collections/types/collection.type";


export type DashboardCollection = {
  id: string | number;
  name: string;
  requestsCount: number;
  variant: CollectionVariant;
};

export type DashboardFlow = {
  id: string | number;
  name: string;
  nodes: number;
};

export interface DashboardMetrics {
  success_requests_today: number;
  total_requests: number;
  collections_count: number;
  active_flows_count: number;
  team_members: number;

  recent_requests: RecentActivityResponse[];

  latest_collections: DashboardCollection[];

  active_flows: DashboardFlow[];
}