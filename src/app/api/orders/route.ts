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
  selectedShippingOptionId: z.string().optional(),
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

    let shippingOptionInfo: { providerId: string; optionId: string; charge: number } | undefined;
    
    if (result.data.selectedShippingOptionId) {
      try {
        const option = await import('@/lib/shipping').then((m) =>
          m.validateShippingOption(
            result.data.selectedShippingOptionId!,
            process.env.SHIPPING_PICKUP_PINCODE || '110030',
            result.data.shippingDetails.postalCode,
            0.5,
            false // not cod here by default, or depends on payment options
          )
        );
        shippingOptionInfo = {
          providerId: option.providerId,
          optionId: option.id,
          charge: option.rate,
        };
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Unknown error';
        return NextResponse.json(
          { error: `Shipping validation failed: ${msg}` },
          { status: 400 }
        );
      }
    }

    const order = await orderService.createOrder(
      session.user.id,
      result.data.items,
      result.data.shippingDetails,
      undefined,
      shippingOptionInfo
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
