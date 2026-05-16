import { Request } from 'express';

export type JwtPayload = {
  sub: string;
  email: string;
  type: 'access' | 'refresh';
  iat: number;
  exp: number;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
