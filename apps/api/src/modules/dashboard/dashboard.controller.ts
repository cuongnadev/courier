import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Req,
  UseGuards,
  Version,
} from '@nestjs/common';

import { DashboardService } from '@/modules/dashboard/dashboard.service';

import { AuthGuard } from '@/common/guards';
import type { AuthenticatedRequest } from '@/common/types';

@Controller('workspaces/:workspaceId/dashboard')
@UseGuards(AuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Version('1')
  @Get('metrics')
  getMetrics(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.dashboardService.getMetrics(workspaceId, request.user.sub);
  }

  @Version('1')
  @Get('profile-activity')
  getProfileActivity(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.dashboardService.getProfileActivity(
      workspaceId,
      request.user.sub,
    );
  }
}
