import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { CollectionsController } from './collections.controller';
import { CollectionsService } from './collections.service';
import { WorkspacesModule } from '../workspaces';

@Module({
  imports: [PrismaModule, WorkspacesModule],
  controllers: [CollectionsController],
  providers: [CollectionsService],
  exports: [CollectionsService],
})
export class CollectionsModule {}
