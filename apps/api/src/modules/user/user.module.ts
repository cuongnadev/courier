import { Module } from '@nestjs/common';

import { PrismaModule } from '@/database/prisma.module';

import { UserService } from '@/modules/user/user.service';
import { UserController } from '@/modules/user/user.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
