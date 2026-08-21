import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getProvider } from '@/lib/shipping';
import type { ShippingProviderId } from '@/lib/shipping/types';
import { env } from '@/lib/env';
import { isStoreLive, getStoreBlockedResponse } from '@/lib/store-config';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isStoreLive) {
    return NextResponse.json(getStoreBlockedResponse(), { status: 503 });
  }

  const { id: orderId } = await params;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const providerId = searchParams.get('provider') as ShippingProviderId;
    
    if (!providerId) {
      return NextResponse.json({ error: 'Missing provider query param' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        address: true,
        items: true,
        payment: true,
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const provider = getProvider(providerId);
    if (!provider) {
      return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
    }

    const weightKg = order.items.reduce((acc, i) => acc + (0.5 * i.quantity), 0);
    const isCod = order.payment?.provider === 'cod' || order.payment?.status === 'PENDING';

    const options = await provider.getServiceability(
      env.SHIPPING_PICKUP_PINCODE || '110030',
      order.address.zip,
      weightKg,
      isCod
    );

    return NextResponse.json({ options });
  } catch (error) {
    console.error('[GET /api/admin/orders/[id]/shipping-options] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
