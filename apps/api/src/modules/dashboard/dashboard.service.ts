import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { getTodayRange, WorkspaceAccessService } from '../common';
import type { DashboardMetrics } from './types/dashboard-metrics.type';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workspaceAccess: WorkspaceAccessService,
  ) {}

  async getMetrics(
    workspaceId: string,
    userId?: string,
  ): Promise<DashboardMetrics> {
    await this.workspaceAccess.assertAccess(workspaceId, userId);

    const today = getTodayRange();

    const [
      successRequestsToday,
      totalRequests,
      collections,
      activeFlows,
      teamMembers,
    ] = await this.prisma.$transaction([
      this.prisma.requestRun.count({
        where: {
          workspaceId,
          status: 'SUCCESS',
          createdAt: {
            gte: today.start,
            lt: today.end,
          },
        },
      }),
      this.prisma.requestRun.count({
        where: {
          workspaceId,
        },
      }),
      this.prisma.collection.count({
        where: {
          workspaceId,
          deletedAt: null,
        },
      }),
      this.prisma.flow.count({
        where: {
          workspaceId,
          status: {
            not: 'ARCHIVED',
          },
          deletedAt: null,
        },
      }),
      this.prisma.workspaceMember.count({
        where: {
          workspaceId,
        },
      }),
    ]);

    return {
      success_requests_today: successRequestsToday,
      total_requests: totalRequests,
      collections,
      active_flows: activeFlows,
      team_members: teamMembers,
    };
  }
}
