import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { orderService } from '@/lib/services/order.service';
import { z } from 'zod';
import { razorpay } from '@/lib/payments/razorpay';
import { env } from '@/lib/env';
import { isStoreLive, getStoreBlockedResponse } from '@/lib/store-config';

const initOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
        packSize: z.enum(['1', '6']),
      })
    )
    .min(1, 'Order must contain at least one item'),
  shippingDetails: z.object({
    firstName: z.string(),
    lastName: z.string(),
    address: z.string(),
    city: z.string(),
    postalCode: z.string(),
    phone: z.string(),
    email: z.string().email(),
  }),
});

export async function POST(req: Request) {
  // ── Store mode guard ──────────────────────────────────────────────────────────
  if (!isStoreLive) {
    return NextResponse.json(getStoreBlockedResponse(), { status: 503 });
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = initOrderSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid order data', details: result.error.issues },
        { status: 422 }
      );
    }

    // Calculate exact total server-side
    const { total } = await orderService.calculateOrderTotals(result.data.items);

    // If Razorpay is not configured (mock mode fallback)
    if (!env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({
        orderId: `mock_${Date.now()}`,
        amount: total,
        currency: 'INR',
        mock: true
      }, { status: 201 });
    }

    // Create Razorpay Order
    const amountInPaise = Math.round(total * 100);
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    });

    if (!razorpayOrder || !razorpayOrder.id) {
      throw new Error('Failed to create Razorpay order');
    }

    return NextResponse.json({
      razorpayOrderId: razorpayOrder.id,
      amount: total,
      currency: 'INR'
    }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/orders/init] Error initializing order:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
