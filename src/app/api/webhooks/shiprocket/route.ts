import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[POST /api/webhooks/shiprocket]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
