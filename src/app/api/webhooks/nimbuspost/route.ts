import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { emailService } from '@/lib/services/email.service';
import { normalizeNimbusPostStatus } from '@/lib/shipping/status';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const awb = body.awb;
    const status = body.status;

    if (!awb || !status) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const shipment = await prisma.shipment.findFirst({
      where: { 
        awbNumber: awb,
        provider: 'nimbuspost'
      },
      include: {
        order: {
          include: {
            user: true,
            address: true,
          }
        }
      }
    });

    if (!shipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
    }

    const normalizedStatus = normalizeNimbusPostStatus(status);

    await prisma.shipment.update({
      where: { id: shipment.id },
      data: { status: normalizedStatus },
    });

    if (normalizedStatus === 'DELIVERED') {
      await prisma.order.update({
        where: { id: shipment.orderId },
        data: { status: 'DELIVERED' },
      });
    } else if (normalizedStatus === 'IN_TRANSIT' || normalizedStatus === 'OUT_FOR_DELIVERY') {
      await prisma.order.update({
        where: { id: shipment.orderId },
        data: { status: 'SHIPPED' },
      });
    }

    const notifyStatuses = ['IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    if (notifyStatuses.includes(normalizedStatus)) {
      let title = '';
      let message = '';

      if (normalizedStatus === 'IN_TRANSIT') {
        title = 'Your Order is on the way!';
        message = `Great news, ${shipment.order.address.firstName}. We've packed your order and handed it over to our delivery partners.`;
      } else if (normalizedStatus === 'OUT_FOR_DELIVERY') {
        title = 'Your Order is out for delivery!';
        message = `Your order is out for delivery today, ${shipment.order.address.firstName}! Keep an eye out for our delivery partner.`;
      } else if (normalizedStatus === 'DELIVERED') {
        title = 'Your Order has been delivered!';
        message = `Your order has been successfully delivered, ${shipment.order.address.firstName}. Enjoy!`;
      }

      try {
        await emailService.sendShipmentEmail(
          shipment.order.user.email || '',
          `${title} - #${shipment.order.orderNumber}`,
          {
            title: title,
            message: message,
            orderNumber: shipment.order.orderNumber,
            courier: shipment.courierName || 'NimbusPost',
            awbNumber: shipment.awbNumber || '',
            trackingUrl: shipment.trackingUrl || ''
          }
        );
      } catch (emailError) {
        console.error('[Webhook] Failed to send shipment notification email:', emailError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[POST /api/webhooks/nimbuspost]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
