import { Module } from '@nestjs/common';

import { DashboardService } from '@/modules/dashboard/dashboard.service';
import { DashboardController } from '@/modules/dashboard/dashboard.controller';

import { FlowsModule } from '@/modules/flows/flows.module';
import { RequestsModule } from '@/modules/requests/requests.module';
import { WorkspacesModule } from '@/modules/workspaces/workspaces.module';
import { CollectionsModule } from '@/modules/collections/collections.module';

@Module({
  imports: [CollectionsModule, FlowsModule, RequestsModule, WorkspacesModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
