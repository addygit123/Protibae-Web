import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { orderService } from '@/lib/services/order.service';
import { verifyRazorpaySignature } from '@/lib/payments/razorpay';
import { z } from 'zod';

const verifySchema = z.object({
  orderId: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_order_id: z.string(),
  razorpay_signature: z.string(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = verifySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = result.data;

    console.log('[POST /api/payments/verify] Body:', { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature });

    // Verify signature
    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    console.log('[POST /api/payments/verify] Signature valid:', isValid);

    if (!isValid) {
      await orderService.handleFailedPayment(orderId, razorpay_payment_id);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Update order status, payment status, deduct inventory
    await orderService.finalizeOrderPayment(orderId, razorpay_payment_id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[POST /api/payments/verify] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
