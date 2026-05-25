import { createHmac, timingSafeEqual } from 'crypto';

import type { JwtPayload } from '../types/authenticated-request.type';
import { AppException } from '../exceptions/app.exceptions';
import { appConfig } from '../../config';

export function verifyJwtToken(token: string): JwtPayload {
  const [encodedHeader, encodedPayload, signature] = token.split('.');

  if (!encodedHeader || !encodedPayload || !signature) {
    throwInvalidToken();
  }

  const expectedSignature = createHmac('sha256', appConfig.jwt.secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  if (!isSafeEqual(signature, expectedSignature)) {
    throwInvalidToken();
  }

  const payload = parsePayload(encodedPayload);
  const now = Math.floor(Date.now() / 1000);

  if (!payload.sub || !payload.email || !payload.exp) {
    throwInvalidToken();
  }

  if (payload.exp <= now) {
    throw new AppException({
      code: 'TOKEN_EXPIRED',
      message: 'Access token has expired.',
      status: 401,
      hint: 'Use the refresh token endpoint to obtain a new access token.',
      docs: '',
    });
  }

  return payload;
}

function parsePayload(encodedPayload: string): JwtPayload {
  try {
    return JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString('utf8'),
    ) as JwtPayload;
  } catch {
    throwInvalidToken();
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

function throwInvalidToken(): never {
  throw new AppException({
    code: 'INVALID_TOKEN',
    message: 'Access token is invalid.',
    status: 401,
    hint: 'Provide a valid access token.',
    docs: '',
  });
}
