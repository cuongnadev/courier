import { env } from './env';

export const appConfig = {
  env: env.NODE_ENV,

  port: env.PORT,

  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
  },

  database: {
    url: env.DATABASE_URL,
  },
};
