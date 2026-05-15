import { Module } from '@nestjs/common';
import { CollectionsModule } from '../collections';
import { FlowsModule } from '../flows';
import { RequestsModule } from '../requests';
import { WorkspacesModule } from '../workspaces';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    CollectionsModule,
    FlowsModule,
    RequestsModule,
    WorkspacesModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
