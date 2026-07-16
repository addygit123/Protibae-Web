import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { z } from 'zod';

function parseEnvFile(filePath: string) {
  if (!existsSync(filePath)) {
    return {};
  }

  const fileContents = readFileSync(filePath, 'utf8');

  return Object.fromEntries(
    fileContents
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith('#') && line.includes('='))
      .map((line) => {
        const separatorIndex = line.indexOf('=');
        const key = line.slice(0, separatorIndex).trim();
        const rawValue = line.slice(separatorIndex + 1).trim();
        const value = rawValue.replace(/^['"]|['"]$/g, '');

        return [key, value];
      }),
  );
}

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // Auth
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().min(1).optional(),
  GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),

  // Payment (Razorpay)
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),

  // Logistics (Shiprocket)
  SHIPROCKET_EMAIL: z.string().optional(),
  SHIPROCKET_PASSWORD: z.string().optional(),
  SHIPROCKET_PICKUP_POSTCODE: z.string().optional(),

  // Email (Resend)
  RESEND_API_KEY: z.string().optional(),

  // Storage (Cloudinary)
  CLOUDINARY_URL: z.string().optional(),


  // Environment
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

const rootEnvPath = resolve(process.cwd(), '../.env');
const rootEnv = parseEnvFile(rootEnvPath);
const localEnvPath = resolve(process.cwd(), '.env');
const localEnv = parseEnvFile(localEnvPath);

const envSource = {
  ...rootEnv,
  ...process.env,
};

if (localEnv.SHIPROCKET_PASSWORD) {
  envSource.SHIPROCKET_PASSWORD = localEnv.SHIPROCKET_PASSWORD;
}
if (localEnv.SHIPROCKET_EMAIL) {
  envSource.SHIPROCKET_EMAIL = localEnv.SHIPROCKET_EMAIL;
}
if (localEnv.SHIPROCKET_PICKUP_POSTCODE) {
  envSource.SHIPROCKET_PICKUP_POSTCODE = localEnv.SHIPROCKET_PICKUP_POSTCODE;
}


const _env = envSchema.safeParse(envSource);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  throw new Error('Invalid environment variables');
}

export const env = _env.data;
