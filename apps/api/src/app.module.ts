import { ConfigModule } from '@nestjs/config';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { PrismaModule } from '@/database/prisma.module';

import { AppService } from '@/app.service';
import { AppController } from '@/app.controller';

import { AuthModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/user/user.module';
import { FlowsModule } from '@/modules/flows/flows.module';
import { RequestsModule } from '@/modules/requests/requests.module';
import { DashboardModule } from '@/modules/dashboard/dashboard.module';
import { WorkspacesModule } from '@/modules/workspaces/workspaces.module';
import { CollectionsModule } from '@/modules/collections/collections.module';
import { RequestTestcasesModule } from '@/modules/request-testcases/request-testcases.module';

import { LoggerMiddleware } from '@/common/middlewares';

import { envSchema } from '@/config/env.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => envSchema.parse(config),
    }),
    PrismaModule,
    AuthModule,
    CollectionsModule,
    DashboardModule,
    FlowsModule,
    RequestTestcasesModule,
    RequestsModule,
    UserModule,
    WorkspacesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
