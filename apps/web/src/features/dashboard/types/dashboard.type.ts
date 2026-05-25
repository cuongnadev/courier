import type { CollectionResponse } from "@/features/collections/types/collection.type";
import type { RecentActivityResponse } from "@/features/requests/types/request-run.type";

export type DashboardFlow = {
  id: string | number;
  name: string;
  nodes: number;
};

export type DashboardCollection = Omit<
  CollectionResponse,
  "method" |
  "uri" |
  "requests" |
  "workspaceId" |
  "description" |
  "createdAt" |
  "updatedAt" |
  "deletedAt" |
  "sortOrder"
>;

export interface DashboardMetrics {
  success_requests_today: number;
  total_requests: number;
  collections_count: number;
  active_flows_count: number;
  team_members: number;

  recent_requests: RecentActivityResponse[];

  latest_collections: CollectionResponse[];

  active_flows: DashboardFlow[];
}