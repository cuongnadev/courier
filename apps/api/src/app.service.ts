import { Injectable } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async testDatabase() {
    try {
      await this.prisma.$queryRaw`SELECT 1 as connected`;

      return {
        success: true,
        message: 'Database connected successfully',
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error('Database test error:', error);
      throw error;
    }
  }
}
