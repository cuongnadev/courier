export const JWT_ACCESS_TOKEN_TYPE = 'access';
export const JWT_REFRESH_TOKEN_TYPE = 'refresh';

export const JWT_ALGORITHM = 'HS256';
export const JWT_HEADER_TYPE = 'JWT';

export const DEFAULT_REFRESH_TOKEN_EXPIRES_IN = '7d';

export const PASSWORD_HASH_STRATEGY = 'pbkdf2';
export const PASSWORD_HASH_SEPARATOR = '$';
export const PASSWORD_SALT_LENGTH = 16;
export const BASE64_URL_ENCODING = 'base64url';

export const DEFAULT_EXPIRES_IN_SECONDS = 86_400;

export const HASH_ALGORITHM = 'sha256';
export const HASH_ITERATIONS = 210_000;
export const HASH_KEY_LENGTH = 64;

export const EXPIRES_IN_SECONDS_BY_UNIT = {
  s: 1,
  m: 60,
  h: 3_600,
  d: 86_400,
} as const;
