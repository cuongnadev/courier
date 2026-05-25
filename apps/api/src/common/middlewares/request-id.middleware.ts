import { randomUUID } from 'crypto';
import type { Request, Response, NextFunction } from 'express';

export function requestIdMiddleware(
  req: Request & { id?: string },
  res: Response,
  next: NextFunction,
) {
  const requestId = `req_${randomUUID().slice(0, 8)}`;

  req.id = requestId;
  res.setHeader('x-request-id', requestId);

  next();
}
