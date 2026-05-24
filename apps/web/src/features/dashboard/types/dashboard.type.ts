import type { CollectionRequest } from "@/features/collections/types/collection.type";
import type { RecentActivityResponse } from "@/features/requests/types/request.type";

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

  latest_collections: CollectionRequest[];

  active_flows: DashboardFlow[];
}