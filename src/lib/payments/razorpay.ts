import Razorpay from 'razorpay';
import crypto from 'crypto';
import { env } from '@/lib/env';

export const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID || 'dummy_key',
  key_secret: env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const secret = env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;

  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return generatedSignature === signature;
}

export function verifyRazorpayWebhookSignature(
  body: string,
  signature: string
): boolean {
  const secret = env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;

  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  return generatedSignature === signature;
}
