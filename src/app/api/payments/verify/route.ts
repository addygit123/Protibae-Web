import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { orderService } from '@/lib/services/order.service';
import { verifyRazorpaySignature, razorpay } from '@/lib/payments/razorpay';
import { z } from 'zod';
import { PaymentStatus } from '@prisma/client';

const verifySchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
    packSize: z.enum(['1', '6']),
  })).min(1),
  shippingDetails: z.object({
    firstName: z.string(),
    lastName: z.string(),
    address: z.string(),
    city: z.string(),
    postalCode: z.string(),
    phone: z.string(),
    email: z.string().email(),
  }),
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

    const { items, shippingDetails, razorpay_payment_id, razorpay_order_id, razorpay_signature } = result.data;

    // Verify signature
    const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Verify Amount
    const { total } = await orderService.calculateOrderTotals(items);
    const amountInPaise = Math.round(total * 100);

    const rzpOrder = await razorpay.orders.fetch(razorpay_order_id);
    if (!rzpOrder || rzpOrder.amount !== amountInPaise) {
      return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 });
    }

    // Create the DB Order (defer status to SUCCESS)
    const order = await orderService.createOrder(session.user.id, items, shippingDetails, {
      provider: 'razorpay',
      razorpayOrderId: razorpay_order_id,
      status: PaymentStatus.SUCCESS
    });

    // Deduct inventory and finalize
    await orderService.finalizeOrderPayment(order.id, razorpay_payment_id);

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error('[POST /api/payments/verify] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
