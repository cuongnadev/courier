import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@/common/constants';

type AppExceptionOptions = {
  code: ErrorCode;
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
