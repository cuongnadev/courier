import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { createHmac, timingSafeEqual } from 'crypto';
import { appConfig } from '../../config';
import type {
  AuthenticatedRequest,
  JwtPayload,
} from '../types/authenticated-request.type';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractBearerToken(request);

    request.user = this.verifyToken(token);

    return true;
  }

  private extractBearerToken(request: Request): string {
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('Authorization header is required');
    }

    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Bearer token is required');
    }

    return token;
  }

  private verifyToken(token: string): JwtPayload {
    const [encodedHeader, encodedPayload, signature] = token.split('.');

    if (!encodedHeader || !encodedPayload || !signature) {
      throw new UnauthorizedException('Invalid access token');
    }

    const expectedSignature = createHmac('sha256', appConfig.jwt.secret)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64url');

    if (!this.isSafeEqual(signature, expectedSignature)) {
      throw new UnauthorizedException('Invalid access token');
    }

    const payload = this.parsePayload(encodedPayload);
    const now = Math.floor(Date.now() / 1000);

    if (!payload.sub || !payload.email || !payload.exp || payload.exp <= now) {
      throw new UnauthorizedException('Access token has expired');
    }

    return payload;
  }

  private parsePayload(encodedPayload: string): JwtPayload {
    try {
      return JSON.parse(
        Buffer.from(encodedPayload, 'base64url').toString('utf8'),
      ) as JwtPayload;
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  private isSafeEqual(value: string, expectedValue: string): boolean {
    const valueBuffer = Buffer.from(value);
    const expectedValueBuffer = Buffer.from(expectedValue);

    return (
      valueBuffer.length === expectedValueBuffer.length &&
      timingSafeEqual(valueBuffer, expectedValueBuffer)
    );
  }
}
