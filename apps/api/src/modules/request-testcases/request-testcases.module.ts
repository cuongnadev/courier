import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { RequestsModule } from '../requests';
import { RequestTestcasesController } from './request-testcases.controller';
import { RequestTestcasesService } from './request-testcases.service';

@Module({
  imports: [PrismaModule, RequestsModule],
  controllers: [RequestTestcasesController],
  providers: [RequestTestcasesService],
  exports: [RequestTestcasesService],
})
export class RequestTestcasesModule {}
