import { HttpMethod } from '@/generated/prisma/enums';

export const DEFAULT_REQUEST_NAME = 'Untitled Request';

export const METHODS_WITHOUT_BODY = [
  HttpMethod.GET,
  HttpMethod.HEAD,
  HttpMethod.DELETE,
] as const;

export const DEFAULT_HEADER_VALUE = '';
export const SET_COOKIE_HEADER = 'set-cookie';
