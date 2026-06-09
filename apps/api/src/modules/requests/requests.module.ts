import { Module } from '@nestjs/common';

import { PrismaModule } from '@/database/prisma.module';

import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';

import { WorkspacesModule } from '@/modules/workspaces/workspaces.module';
import { CollectionsModule } from '@/modules/collections/collections.module';

@Module({
  imports: [CollectionsModule, PrismaModule, WorkspacesModule],
  controllers: [RequestsController],
  providers: [RequestsService],
  exports: [RequestsService],
})
export class RequestsModule {}
