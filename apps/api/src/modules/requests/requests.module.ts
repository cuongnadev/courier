import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { CollectionsModule } from '../collections';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { WorkspacesModule } from '../workspaces';

@Module({
  imports: [CollectionsModule, PrismaModule, WorkspacesModule],
  controllers: [RequestsController],
  providers: [RequestsService],
  exports: [RequestsService],
})
export class RequestsModule {}
