import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & { id?: string }>();

    const requestId = request.id ?? '';

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'error' in exceptionResponse
      ) {
        const body = exceptionResponse as {
          error: {
            code?: string;
            message?: string;
            hint?: string;
            docs?: string;
            fields?: Record<string, string[]>;
            status?: number;
          };
        };

        return response.status(status).json({
          error: {
            code: body.error.code ?? 'ERROR',
            message: body.error.message ?? exception.message,
            hint: body.error.hint ?? '',
            docs: body.error.docs ?? '',
            fields: body.error.fields,
            requestId,
            status,
          },
        });
      }

      return response.status(status).json({
        error: {
          code: this.getDefaultCode(status),
          message: exception.message,
          hint: '',
          docs: '',
          requestId,
          status,
        },
      });
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error.',
        hint: '',
        docs: '',
        requestId,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      },
    });
  }

  private getDefaultCode(status: number) {
    switch (status) {
      case 401:
        return 'UNAUTHORIZED';
      case 403:
        return 'FORBIDDEN';
      case 404:
        return 'NOT_FOUND';
      case 409:
        return 'CONFLICT';
      default:
        return 'ERROR';
    }
  }
}
