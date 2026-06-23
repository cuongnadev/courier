import { Module } from '@nestjs/common';

import { PrismaModule } from '@/database/prisma.module';

import { FlowsService } from '@/modules/flows/flows.service';
import { FlowsController } from '@/modules/flows/flows.controller';

import { WorkspacesModule } from '@/modules/workspaces/workspaces.module';

@Module({
  imports: [PrismaModule, WorkspacesModule],
  controllers: [FlowsController],
  providers: [FlowsService],
  exports: [FlowsService],
})
export class FlowsModule {}
