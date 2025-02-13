import { config } from 'dotenv';
import { z } from 'zod';
import { STAGES } from './constants/env';

config();

export function isTest() {
  return process.env.NODE_ENV === 'test';
}

const envSchema = z.object({
  APP_PORT: z.coerce.number().default(3000),
  STAGE: z.nativeEnum(STAGES).default(STAGES.Dev),
  DB_URL: z.string(),
  TEST_DB_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRE: z.string(),
  BCRYPT_SALT: z.string(),
});

export const envConfig = envSchema.parse({
  APP_PORT: process.env.APP_PORT,
  STAGE: process.env.STAGE,
  DB_URL: process.env.DB_URL,
  TEST_DB_URL: process.env.TEST_DB_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE,
  BCRYPT_SALT: process.env.BCRYPT_SALT,
});

export type EnvConfig = z.infer<typeof envSchema>;