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

  // Logistics (NimbusPost)
  NIMBUSPOST_API_TOKEN: z.string().optional(),
  NIMBUSPOST_CLIENT_ID: z.string().optional(),
  NIMBUSPOST_WAREHOUSE_ID: z.string().optional(),

  // Logistics (Porter)
  PORTER_API_KEY: z.string().optional(),
  PORTER_PICKUP_PINCODE: z.string().optional(),

  // Logistics (India Post)
  INDIAPOST_ACCOUNT_NUMBER: z.string().optional(),
  INDIAPOST_TRANSIT_DAYS_METRO: z.coerce.number().optional().default(3),
  INDIAPOST_TRANSIT_DAYS_NON_METRO: z.coerce.number().optional().default(6),

  // Shared Logistics
  SHIPPING_PICKUP_PINCODE: z.string().optional(),
  FAST_DELIVERY_ENABLED: z.coerce.boolean().default(false),
  FAST_DELIVERY_CITY: z.string().optional().default('Jabalpur'),
  FAST_DELIVERY_PINCODES: z.string().optional(), // JSON string array
  SHIPPING_BOOKING_ENABLED: z.coerce.boolean().default(false),

  // Provider Toggles
  SHIPPING_PROVIDER_SHIPROCKET_ENABLED: z.coerce.boolean().default(true),
  SHIPPING_PROVIDER_INDIAPOST_ENABLED: z.coerce.boolean().default(true),
  SHIPPING_PROVIDER_PORTER_ENABLED: z.coerce.boolean().default(false),
  SHIPPING_PROVIDER_NIMBUSPOST_ENABLED: z.coerce.boolean().default(false),

  // Email (Resend)
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().optional(),
  ADMIN_EMAIL: z.string().optional(),

  // Storage (Cloudinary)
  CLOUDINARY_URL: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

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
if (localEnv.NIMBUSPOST_API_TOKEN) {
  envSource.NIMBUSPOST_API_TOKEN = localEnv.NIMBUSPOST_API_TOKEN;
}
if (localEnv.NIMBUSPOST_CLIENT_ID) {
  envSource.NIMBUSPOST_CLIENT_ID = localEnv.NIMBUSPOST_CLIENT_ID;
}
if (localEnv.NIMBUSPOST_WAREHOUSE_ID) {
  envSource.NIMBUSPOST_WAREHOUSE_ID = localEnv.NIMBUSPOST_WAREHOUSE_ID;
}
if (localEnv.PORTER_API_KEY) {
  envSource.PORTER_API_KEY = localEnv.PORTER_API_KEY;
}
if (localEnv.PORTER_PICKUP_PINCODE) {
  envSource.PORTER_PICKUP_PINCODE = localEnv.PORTER_PICKUP_PINCODE;
}
if (localEnv.SHIPPING_PICKUP_PINCODE) {
  envSource.SHIPPING_PICKUP_PINCODE = localEnv.SHIPPING_PICKUP_PINCODE;
}
if (localEnv.FAST_DELIVERY_ENABLED) {
  envSource.FAST_DELIVERY_ENABLED = localEnv.FAST_DELIVERY_ENABLED;
}
if (localEnv.FAST_DELIVERY_CITY) {
  envSource.FAST_DELIVERY_CITY = localEnv.FAST_DELIVERY_CITY;
}
if (localEnv.FAST_DELIVERY_PINCODES) {
  envSource.FAST_DELIVERY_PINCODES = localEnv.FAST_DELIVERY_PINCODES;
}
if (localEnv.SHIPPING_BOOKING_ENABLED) {
  envSource.SHIPPING_BOOKING_ENABLED = localEnv.SHIPPING_BOOKING_ENABLED;
}
if (localEnv.SHIPPING_PROVIDER_SHIPROCKET_ENABLED) {
  envSource.SHIPPING_PROVIDER_SHIPROCKET_ENABLED = localEnv.SHIPPING_PROVIDER_SHIPROCKET_ENABLED;
}
if (localEnv.SHIPPING_PROVIDER_INDIAPOST_ENABLED) {
  envSource.SHIPPING_PROVIDER_INDIAPOST_ENABLED = localEnv.SHIPPING_PROVIDER_INDIAPOST_ENABLED;
}
if (localEnv.SHIPPING_PROVIDER_PORTER_ENABLED) {
  envSource.SHIPPING_PROVIDER_PORTER_ENABLED = localEnv.SHIPPING_PROVIDER_PORTER_ENABLED;
}
if (localEnv.SHIPPING_PROVIDER_NIMBUSPOST_ENABLED) {
  envSource.SHIPPING_PROVIDER_NIMBUSPOST_ENABLED = localEnv.SHIPPING_PROVIDER_NIMBUSPOST_ENABLED;
}

const _env = envSchema.safeParse(envSource);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  throw new Error('Invalid environment variables');
}

export const env = _env.data;
