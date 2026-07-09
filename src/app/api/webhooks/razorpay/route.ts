import { NextResponse } from 'next/server';
import { verifyRazorpayWebhookSignature } from '@/lib/payments/razorpay';
import { prisma } from '@/lib/prisma';
import { orderService } from '@/lib/services/order.service';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const isValid = verifyRazorpayWebhookSignature(body, signature);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);

    // Process event
    if (event.event === 'payment.captured' || event.event === 'payment.authorized') {
      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id;
      const razorpayPaymentId = payment.id;

      // Find the order with this razorpay order ID
      const dbPayment = await prisma.payment.findUnique({
        where: { razorpayOrderId },
        include: { order: true },
      });

      if (dbPayment && dbPayment.order) {
        await orderService.finalizeOrderPayment(dbPayment.order.id, razorpayPaymentId);
      }
    } else if (event.event === 'payment.failed') {
      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id;
      const razorpayPaymentId = payment.id;

      const dbPayment = await prisma.payment.findUnique({
        where: { razorpayOrderId },
        include: { order: true },
      });

      if (dbPayment && dbPayment.order) {
        await orderService.handleFailedPayment(dbPayment.order.id, razorpayPaymentId);
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('[POST /api/webhooks/razorpay] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
