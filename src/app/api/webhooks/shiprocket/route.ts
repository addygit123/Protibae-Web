import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { emailService } from '@/lib/services/email.service';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Shiprocket sends 'awb', 'current_status', 'shipment_status', etc.
    const { awb, current_status } = body;

    if (!awb || !current_status) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const shipment = await prisma.shipment.findUnique({
      where: { awbNumber: awb },
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

    const normalizedStatus = current_status.trim().toUpperCase();

    // Update shipment status in database
    await prisma.shipment.update({
      where: { id: shipment.id },
      data: { status: normalizedStatus },
    });

    // Update the main order status according to the shipment status
    if (normalizedStatus === 'DELIVERED') {
      await prisma.order.update({
        where: { id: shipment.orderId },
        data: { status: 'DELIVERED' },
      });
    } else if (normalizedStatus === 'SHIPPED') {
      await prisma.order.update({
        where: { id: shipment.orderId },
        data: { status: 'SHIPPED' },
      });
    }

    // Send relevant emails based on status, handled safely without throwing
    const notifyStatuses = ['SHIPPED', 'OUT FOR DELIVERY', 'DELIVERED'];
    if (notifyStatuses.includes(normalizedStatus)) {
      let title = '';
      let message = '';

      if (normalizedStatus === 'SHIPPED') {
        title = 'Your Order is on the way!';
        message = `Great news, ${shipment.order.address.firstName}. We've packed your order and handed it over to our delivery partners.`;
      } else if (normalizedStatus === 'OUT FOR DELIVERY') {
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
            courier: shipment.courierName || 'Standard Delivery',
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
    console.error('[POST /api/webhooks/shiprocket]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
