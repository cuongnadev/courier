import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { FlowsController } from './flows.controller';
import { FlowsService } from './flows.service';
import { WorkspacesModule } from '../workspaces';

@Module({
  imports: [PrismaModule, WorkspacesModule],
  controllers: [FlowsController],
  providers: [FlowsService],
  exports: [FlowsService],
})
export class FlowsModule {}
