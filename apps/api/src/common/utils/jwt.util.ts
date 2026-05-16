import { UnauthorizedException } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';

import { appConfig } from '../../config';
import type { JwtPayload } from '../types/authenticated-request.type';

export function verifyJwtToken(token: string): JwtPayload {
  const [encodedHeader, encodedPayload, signature] = token.split('.');

  if (!encodedHeader || !encodedPayload || !signature) {
    throw new UnauthorizedException('Invalid token');
  }

  const expectedSignature = createHmac('sha256', appConfig.jwt.secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  if (!isSafeEqual(signature, expectedSignature)) {
    throw new UnauthorizedException('Invalid token');
  }

  const payload = parsePayload(encodedPayload);
  const now = Math.floor(Date.now() / 1000);

  if (!payload.sub || !payload.email || !payload.exp || payload.exp <= now) {
    throw new UnauthorizedException('Token has expired');
  }

  return payload;
}

function parsePayload(encodedPayload: string): JwtPayload {
  try {
    return JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString('utf8'),
    ) as JwtPayload;
  } catch {
    throw new UnauthorizedException('Invalid token');
  }
}

function isSafeEqual(value: string, expectedValue: string): boolean {
  const valueBuffer = Buffer.from(value);
  const expectedValueBuffer = Buffer.from(expectedValue);

  return (
    valueBuffer.length === expectedValueBuffer.length &&
    timingSafeEqual(valueBuffer, expectedValueBuffer)
  );
}
