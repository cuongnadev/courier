import { HttpException, HttpStatus } from '@nestjs/common';

export type AppErrorCode =
  | 'VALIDATION_FAILED'
  | 'UNAUTHORIZED'
  | 'INVALID_TOKEN'
  | 'TOKEN_EXPIRED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'INTERNAL_SERVER_ERROR';

type AppExceptionOptions = {
  code: AppErrorCode;
  message: string;
  status?: number;
  hint?: string;
  docs?: string;
  fields?: Record<string, string[]>;
};

export class AppException extends HttpException {
  constructor({
    code,
    message,
    status = HttpStatus.BAD_REQUEST,
    hint = '',
    docs = '',
    fields,
  }: AppExceptionOptions) {
    super(
      {
        error: {
          code,
          message,
          hint,
          docs,
          fields,
          status,
        },
      },
      status,
    );
  }
}
