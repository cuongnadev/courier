import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import type { AuthenticatedRequest } from '../types/authenticated-request.type';
import { verifyJwtToken } from '../utils/jwt.util';
import { AppException } from '../exceptions/app.exceptions';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractBearerToken(request);

    request.user = verifyJwtToken(token);

    return true;
  }

  private extractBearerToken(request: Request): string {
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new AppException({
        code: 'UNAUTHORIZED',
        message: 'Authorization header is required.',
        status: 401,
        hint: 'Provide a valid Bearer access token.',
      });
    }

    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new AppException({
        code: 'UNAUTHORIZED',
        message: 'Bearer token is required.',
        status: 401,
        hint: 'Authorization header must use the format: Bearer <token>.',
      });
    }

    return token;
  }
}
