import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { orderService } from '@/lib/services/order.service';
import { z } from 'zod';
import { isStoreLive, getStoreBlockedResponse } from '@/lib/store-config';

const createOrderSchema = z.object({
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
    const result = createOrderSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid order data', details: result.error.issues },
        { status: 422 }
      );
    }

    const order = await orderService.createOrder(
      session.user.id,
      result.data.items,
      result.data.shippingDetails
    );

    return NextResponse.json({ orderId: order.id }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/orders] Error creating order:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await orderService.getUserOrders(session.user.id);
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('[GET /api/orders] Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
