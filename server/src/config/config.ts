import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ quiet: true });

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  DATABASE_URL: z.url({ message: 'DATABASE_URL must be a valid URL' }),
  JWT_SECRET: z
    .string()
    .min(10, { message: 'JWT_SECRET must be at least 10 characters long' }),
  FRONTEND_URL: z.url({ message: 'FRONTEND_URL must be a valid URL' }),
});

const envServer = envSchema.safeParse(process.env);

if (!envServer.success) {
  console.error('❌ Invalid environment variables:');
  console.error(JSON.stringify(envServer.error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

export const env = envServer.data;
