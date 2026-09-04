import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { env } from '@/lib/env';
import { createShipmentForOrder, getProvider } from '@/lib/shipping';
import type { ShippingProviderId } from '@/lib/shipping/types';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({
        success: false,
        stage: 'validation',
        error: 'Unauthorized',
        message: 'Unauthorized',
        shipmentCreated: false,
        canRetry: false
      }, { status: 401 });
    }

    const { id } = await params;
    let body: { provider?: ShippingProviderId; selectedOptionId?: string } = {};
    try {
      body = await req.json();
    } catch (_e) {
      // Body is optional
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        address: true,
        items: {
          include: { product: true },
        },
        payment: true,
        shipment: true,
      },
    });

    if (!order) {
      return NextResponse.json({
        success: false,
        stage: 'validation',
        error: 'Order not found',
        message: 'Order not found',
        shipmentCreated: false,
        canRetry: false
      }, { status: 404 });
    }

    if (order.status === 'PENDING' && order.payment?.provider !== 'cod') {
      return NextResponse.json({
        success: false,
        stage: 'validation',
        error: 'Order is not paid yet',
        message: 'Order is not paid yet',
        shipmentCreated: false,
        canRetry: false
      }, { status: 400 });
    }

    if (order.shipment) {
       return NextResponse.json({
          success: false,
          stage: 'validation',
          error: `Shipment is already created with status ${order.shipment.status}.`,
          message: `Shipment is already created with status ${order.shipment.status}.`,
          shipmentCreated: true,
          canRetry: false
        }, { status: 400 });
    }

    const isCod = order.payment?.provider === 'cod';

    const providerId = body.provider || order.selectedShippingProvider || 'shiprocket';
    const provider = getProvider(providerId as ShippingProviderId);

    if (!provider.isConfigured()) {
       return NextResponse.json({
          success: false,
          stage: 'validation',
          error: `Provider ${provider.displayName} is not configured.`,
          message: `Provider ${provider.displayName} is not configured.`,
          shipmentCreated: false,
          canRetry: false
       }, { status: 400 });
    }

    const selectedOptionId = body.selectedOptionId;

    if (!selectedOptionId) {
      return NextResponse.json({ error: 'Missing selected courier option ID. Please fetch options and select a courier first.' }, { status: 400 });
    }

    const shipmentInput = {
      orderId: order.id,
      orderNumber: order.orderNumber,
      createdAt: order.createdAt,
      isCod,
      pickupPostcode: env.SHIPPING_PICKUP_PINCODE || '110030',
      address: {
        firstName: order.address.firstName,
        lastName: order.address.lastName,
        street: order.address.street,
        city: order.address.city,
        state: order.address.state,
        zip: order.address.zip,
        country: order.address.country,
        phone: order.address.phone || '9999999999',
        email: order.user.email || 'customer@protibae.com',
      },
      items: order.items.map((i: { product: { name: string, slug: string | null }, productId: string, quantity: number, price: number }) => ({
        name: i.product.name,
        sku: i.product.slug || i.productId,
        quantity: i.quantity,
        price: i.price,
      })),
      subtotal: order.subtotal,
      shipping: order.shipping,
      total: order.total,
      weightKg: order.items.reduce((acc: number, i: { quantity: number }) => acc + (0.5 * i.quantity), 0),
    };

    if (!env.SHIPPING_BOOKING_ENABLED) {
        return NextResponse.json({
          success: false,
          stage: 'create',
          error: 'Shipment booking is disabled in development.',
          message: 'Shipment booking is disabled in development.',
          shipmentCreated: false,
          canRetry: true
        }, { status: 400 });
    }

    let shipmentResult;
    try {
        shipmentResult = await createShipmentForOrder(shipmentInput, selectedOptionId);
    } catch (e: unknown) {
        return NextResponse.json({
          success: false,
          stage: 'create',
          error: e instanceof Error ? e.message : 'Failed to create shipment',
          message: e instanceof Error ? e.message : 'Failed to create shipment',
          shipmentCreated: false,
          canRetry: true
        }, { status: 400 });
    }

    const shipment = await prisma.shipment.create({
      data: {
        orderId: order.id,
        provider: shipmentResult.providerId,
        providerOrderId: shipmentResult.providerOrderId,
        shiprocketId: shipmentResult.providerShipmentId, 
        awbNumber: shipmentResult.awbNumber,
        courierName: shipmentResult.courierName,
        trackingUrl: shipmentResult.trackingUrl,
        status: shipmentResult.status,
        shippingCharge: shipmentResult.shippingCharge,
        estimatedDelivery: shipmentResult.estimatedDelivery,
      }
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'PROCESSING' },
    });

    return NextResponse.json({ success: true, shipment });

  } catch (error) {
    console.error('[POST /api/admin/orders/[id]/shipment]', error);
    return NextResponse.json({
      success: false,
      stage: 'unexpected',
      error: error instanceof Error ? error.message : 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Internal Server Error',
      shipmentCreated: false,
      canRetry: true
    }, { status: 500 });
  }
}
