import { Module } from '@nestjs/common';

import { PrismaModule } from '@/database/prisma.module';

import { RequestTestcasesService } from '@/modules/request-testcases/request-testcases.service';
import { RequestTestcasesController } from '@/modules/request-testcases/request-testcases.controller';

import { RequestsModule } from '@/modules/requests/requests.module';

@Module({
  imports: [PrismaModule, RequestsModule],
  controllers: [RequestTestcasesController],
  providers: [RequestTestcasesService],
  exports: [RequestTestcasesService],
})
export class RequestTestcasesModule {}
