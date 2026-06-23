import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  getUsers() {
    return [];
  }

  async deleteMe(userId: string) {
    await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return { deleted: true };
  }
}
