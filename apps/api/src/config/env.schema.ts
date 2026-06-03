import * as z from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),

  PORT: z.coerce.number().default(4425),

  DATABASE_URL: z.string().min(1),

  DIRECT_URL: z.string().min(1),

  JWT_SECRET: z.string().min(1),

  JWT_EXPIRES_IN: z.string().default('1d'),

  WEB_URL: z.string().min(1),

  TEST_CASE_GENERATOR_URL: z.string().url(),
});

export type Env = z.infer<typeof envSchema>;
