import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { CommonModule } from '../common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [CommonModule, PrismaModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
