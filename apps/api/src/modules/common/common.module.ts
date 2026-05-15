import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { WorkspaceAccessService } from './services/workspace-access.service';

@Module({
  imports: [PrismaModule],
  providers: [WorkspaceAccessService],
  exports: [WorkspaceAccessService],
})
export class CommonModule {}
