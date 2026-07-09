import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { shiprocketService } from '@/lib/services/shiprocket.service';
import { emailService } from '@/lib/services/email.service';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

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
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.shipment) {
      return NextResponse.json({ error: 'Shipment already exists for this order' }, { status: 400 });
    }

    if (order.status === 'PENDING') {
      return NextResponse.json({ error: 'Order is not paid yet' }, { status: 400 });
    }

    // Prepare Shiprocket Order Payload
    const orderPayload = {
      order_id: order.orderNumber,
      order_date: order.createdAt.toISOString().slice(0, 16).replace('T', ' '),
      pickup_location: 'Primary', // Needs to be configured in Shiprocket
      billing_customer_name: order.address.firstName,
      billing_last_name: order.address.lastName,
      billing_address: order.address.street,
      billing_city: order.address.city,
      billing_pincode: order.address.zip,
      billing_state: order.address.state || 'Delhi',
      billing_country: order.address.country || 'India',
      billing_email: order.user.email,
      billing_phone: order.address.phone || '9999999999',
      shipping_is_billing: true,
      order_items: order.items.map(item => ({
        name: item.product.name,
        sku: item.product.slug || item.productId,
        units: item.quantity,
        selling_price: item.price,
      })),
      payment_method: 'Prepaid',
      shipping_charges: order.shipping,
      sub_total: order.total,
      // Hardcoded dimensions/weight as per standard box
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5,
    };

    // If Shiprocket is not configured, create a mock shipment
    if (!process.env.SHIPROCKET_EMAIL) {
      const shipment = await prisma.shipment.create({
        data: {
          orderId: order.id,
          shiprocketId: `mock_ship_${Date.now()}`,
          awbNumber: `AWB${Date.now()}`,
          courierName: 'Mock Courier',
          trackingUrl: `https://mock.tracker/AWB${Date.now()}`,
          status: 'SHIPPED'
        }
      });

      // Send Mock Shipment Email
      await emailService.sendShipmentEmail(
        order.user.email || '',
        `Your order has shipped! - #${order.orderNumber}`,
        {
          title: "Your Order is on the way!",
          message: `Great news, ${order.address.firstName}. We've packed your order and handed it over to our delivery partners.`,
          orderNumber: order.orderNumber,
          courier: shipment.courierName || 'Mock Courier',
          awbNumber: shipment.awbNumber || '',
          trackingUrl: shipment.trackingUrl || '',
          estimatedDelivery: "3-5 Business Days"
        }
      );

      return NextResponse.json({ success: true, shipment });
    }

    // Create Order & Generate AWB in Shiprocket
    const result = await shiprocketService.createOrderAndGenerateAWB(orderPayload);

    // Store in DB
    const shipment = await prisma.shipment.create({
      data: {
        orderId: order.id,
        shiprocketId: result.shipmentId.toString(),
        awbNumber: result.awbNumber,
        courierName: result.courierName,
        trackingUrl: result.trackingUrl,
        status: 'SHIPPED',
      }
    });

    // Update order status
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'SHIPPED' }
    });

    // Send Real Shipment Email
    await emailService.sendShipmentEmail(
      order.user.email || '',
      `Your order has shipped! - #${order.orderNumber}`,
      {
        title: "Your Order is on the way!",
        message: `Great news, ${order.address.firstName}. We've packed your order and handed it over to our delivery partners.`,
        orderNumber: order.orderNumber,
        courier: shipment.courierName || 'Standard Delivery',
        awbNumber: shipment.awbNumber || '',
        trackingUrl: shipment.trackingUrl || '',
        estimatedDelivery: "3-5 Business Days"
      }
    );

    return NextResponse.json({ success: true, shipment });

  } catch (error) {
    console.error('[POST /api/admin/orders/[id]/shipment]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
