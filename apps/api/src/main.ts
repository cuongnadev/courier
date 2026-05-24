/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import { AppException } from './common/exceptions/app.exceptions';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

import { AppModule } from './app.module';
import { appConfig } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: appConfig.webUrl,
    credentials: true,
  });

  app.setGlobalPrefix('api.courier.dev');

  app.use(helmet());

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const fields = errors.reduce<Record<string, string[]>>((acc, error) => {
          acc[error.property] = Object.values(error.constraints ?? {});
          return acc;
        }, {});

        return new AppException({
          code: 'VALIDATION_FAILED',
          message: 'Validation failed.',
          status: 400,
          fields,
        });
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalInterceptors(new ResponseInterceptor());

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  if (appConfig.env === 'development') {
    const config = new DocumentBuilder()
      .setTitle('Courier API')
      .setVersion('1.0')
      .build();

    const document: OpenAPIObject = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('docs', app, document);
  }

  app.useLogger(new Logger());

  console.log(
    `🚀 Starting server in ${appConfig.env} mode on port ${appConfig.port}...`,
  );

  await app.listen(appConfig.port);
}

bootstrap();
