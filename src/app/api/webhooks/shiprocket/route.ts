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

    // Update shipment status
    await prisma.shipment.update({
      where: { id: shipment.id },
      data: { status: current_status },
    });

    // If delivered, also update the main order status
    if (current_status === 'DELIVERED') {
      await prisma.order.update({
        where: { id: shipment.orderId },
        data: { status: 'DELIVERED' },
      });
    }

    // Send relevant emails based on status
    const notifyStatuses = ['SHIPPED', 'OUT FOR DELIVERY', 'DELIVERED'];
    if (notifyStatuses.includes(current_status)) {
      let title = '';
      let message = '';

      if (current_status === 'SHIPPED') {
        title = 'Your Order is on the way!';
        message = `Great news, ${shipment.order.address.firstName}. We've packed your order and handed it over to our delivery partners.`;
      } else if (current_status === 'OUT FOR DELIVERY') {
        title = 'Your Order is out for delivery!';
        message = `Your order is out for delivery today, ${shipment.order.address.firstName}! Keep an eye out for our delivery partner.`;
      } else if (current_status === 'DELIVERED') {
        title = 'Your Order has been delivered!';
        message = `Your order has been successfully delivered, ${shipment.order.address.firstName}. Enjoy!`;
      }

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
