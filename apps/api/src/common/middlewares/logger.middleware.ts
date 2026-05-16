import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import chalk from 'chalk';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;

      const method = chalk.cyan(req.method);
      const url = chalk.gray(req.originalUrl);
      const status = this.colorStatus(res.statusCode);
      const time = chalk.yellow(`${duration}ms`);

      console.log(`${method} ${url} ${status} - ${time}`);
    });

    next();
  }

  private colorStatus(statusCode: number): string {
    if (statusCode >= 500) {
      return chalk.red(statusCode);
    }

    if (statusCode >= 400) {
      return chalk.yellow(statusCode);
    }

    if (statusCode >= 300) {
      return chalk.cyan(statusCode);
    }

    if (statusCode >= 200) {
      return chalk.green(statusCode);
    }

    return chalk.white(statusCode);
  }
}