import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { PrismaModule } from './database/prisma.module';
import { envSchema } from './config/env.schema';
import { AuthModule } from './modules/auth/auth.module';
import { CollectionsModule } from './modules/collections';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { FlowsModule } from './modules/flows';
import { RequestsModule } from './modules/requests';
import { UserModule } from './modules/user/user.module';

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
    RequestsModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
