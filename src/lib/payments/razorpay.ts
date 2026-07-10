import Razorpay from 'razorpay';
import { validatePaymentVerification, validateWebhookSignature } from 'razorpay/dist/utils/razorpay-utils';
import { env } from '@/lib/env';

export const razorpay = new Razorpay({
  key_id: env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'dummy_key',
  key_secret: env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const secret = env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;

  try {
    return validatePaymentVerification(
      { order_id: orderId, payment_id: paymentId },
      signature,
      secret
    );
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

export function verifyRazorpayWebhookSignature(
  body: string,
  signature: string
): boolean {
  const secret = env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;

  try {
    return validateWebhookSignature(body, signature, secret);
  } catch (error) {
    console.error('Webhook signature verification error:', error);
    return false;
  }
}
