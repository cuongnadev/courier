import { Injectable } from '@nestjs/common';
import { CollectionsService } from '../collections';
import { FlowsService } from '../flows';
import { RequestsService } from '../requests';
import { WorkspacesService } from '../workspaces';
import type { DashboardMetrics } from './types/dashboard-metrics.type';

@Injectable()
export class DashboardService {
  constructor(
    private readonly collectionsService: CollectionsService,
    private readonly requestsService: RequestsService,
    private readonly workspacesService: WorkspacesService,
    private readonly flowsService: FlowsService,
  ) {}

  async getMetrics(
    workspaceId: string,
    userId?: string,
  ): Promise<DashboardMetrics> {
    await this.workspacesService.assertAccess(workspaceId, userId);

    const [
      successRequestsToday,
      totalRequests,
      collections_count,
      activeFlowsCount,
      teamMembers,
      recentRequests,
      collections,
      activeFlows,
    ] = await Promise.all([
      this.requestsService.countSuccessfulRunsToday(workspaceId),
      this.requestsService.countRunsByWorkspace(workspaceId),
      this.collectionsService.countByWorkspace(workspaceId),
      this.flowsService.countActiveByWorkspace(workspaceId),
      this.workspacesService.countTeamMembers(workspaceId),
      this.requestsService.findAllByWorkspace(workspaceId, userId, 5),
      this.collectionsService.findAll(workspaceId, userId, 5),
      this.flowsService.findAll(workspaceId, userId, true),
    ]);

    return {
      success_requests_today: successRequestsToday,
      total_requests: totalRequests,
      collections_count,
      active_flows_count: activeFlowsCount,
      team_members: teamMembers,
      recent_requests: recentRequests,
      latest_collections: collections,
      active_flows: activeFlows,
    };
  }
}
