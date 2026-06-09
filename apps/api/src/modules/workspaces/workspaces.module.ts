import { Module } from '@nestjs/common';

import { PrismaModule } from '@/database/prisma.module';

import { WorkspacesService } from '@/modules/workspaces/workspaces.service';
import { WorkspacesController } from '@/modules/workspaces/workspaces.controller';

@Module({
  imports: [PrismaModule],
  controllers: [WorkspacesController],
  providers: [WorkspacesService],
  exports: [WorkspacesService],
})
export class WorkspacesModule {}
