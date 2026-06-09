import { Module } from '@nestjs/common';

import { PrismaModule } from '@/database/prisma.module';

import { CollectionsService } from '@/modules/collections/collections.service';
import { CollectionsController } from '@/modules/collections/collections.controller';

import { WorkspacesModule } from '@/modules/workspaces/workspaces.module';

@Module({
  imports: [PrismaModule, WorkspacesModule],
  controllers: [CollectionsController],
  providers: [CollectionsService],
  exports: [CollectionsService],
})
export class CollectionsModule {}
