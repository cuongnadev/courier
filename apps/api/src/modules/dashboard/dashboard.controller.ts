import {
  Controller,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Version,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('workspaces/:workspaceId/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Version('1')
  @Get('metrics')
  getMetrics(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Headers('x-user-id') userId?: string,
  ) {
    return this.dashboardService.getMetrics(workspaceId, userId);
  }
}
