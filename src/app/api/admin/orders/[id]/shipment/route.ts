import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { shiprocketService } from '@/lib/services/shiprocket.service';
import { emailService } from '@/lib/services/email.service';
import { env } from '@/lib/env';

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

    const isCod = order.payment?.provider === 'cod';

    // If Shiprocket is not configured, run mock flow
    if (!env.SHIPROCKET_EMAIL || !env.SHIPROCKET_PASSWORD) {
      if (order.shipment) {
        return NextResponse.json({ success: true, shipment: order.shipment });
      }

      const shipment = await prisma.shipment.create({
        data: {
          orderId: order.id,
          shiprocketOrderId: `mock_order_${Date.now()}`,
          shiprocketId: `mock_ship_${Date.now()}`,
          awbNumber: `AWB${Date.now()}`,
          courierName: 'Mock Courier',
          courierCompanyId: '10',
          trackingUrl: `https://mock.tracker/AWB${Date.now()}`,
          labelUrl: `https://mock.tracker/label/AWB${Date.now()}.pdf`,
          pickupStatus: 'scheduled',
          status: 'PICKUP_SCHEDULED',
        },
      });

      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'PROCESSING' },
      });

      try {
        await emailService.sendShipmentEmail(
          order.user.email || '',
          `Your order has shipped! - #${order.orderNumber}`,
          {
            title: 'Your Order is on the way!',
            message: `Great news, ${order.address.firstName}. We've packed your order and handed it over to our delivery partners.`,
            orderNumber: order.orderNumber,
            courier: shipment.courierName || 'Mock Courier',
            awbNumber: shipment.awbNumber || '',
            trackingUrl: shipment.trackingUrl || '',
            estimatedDelivery: '3-5 Business Days',
          }
        );
      } catch (emailError) {
        console.error('Failed to send mock shipment email:', emailError);
      }

      return NextResponse.json({ success: true, shipment });
    }

    let shipment = order.shipment;
    let srOrderId: string | null = shipment?.shiprocketOrderId || null;
    let srShipmentId: string | null = shipment?.shiprocketId || null;
    let selectedCourierId: string | null = shipment?.courierCompanyId || null;
    let selectedCourierName: string | null = shipment?.courierName || null;

    // Retry Check
    if (shipment) {
      if (shipment.status !== 'ORDER_CREATED' && shipment.status !== 'AWB_ASSIGNED') {
        return NextResponse.json({
          success: false,
          stage: 'validation',
          error: `Shipment is already in status ${shipment.status} and cannot be processed further.`,
          message: `Shipment is already in status ${shipment.status} and cannot be processed further.`,
          shipmentCreated: true,
          canRetry: false
        }, { status: 400 });
      }
    } else {
      // 1. Check Courier Serviceability
      const pickupPostcode = env.SHIPROCKET_PICKUP_POSTCODE || '110030';
      const deliveryPostcode = order.address.zip;
      const weight = 0.5; // Standard box weight in kg

      let availableCouriers: any[] = [];
      try {
        availableCouriers = await shiprocketService.checkServiceability(
          pickupPostcode,
          deliveryPostcode,
          weight,
          isCod
        );
      } catch (serviceabilityError: any) {
        console.error('[Shiprocket Serviceability Error]', serviceabilityError);
        return NextResponse.json({
          success: false,
          stage: 'serviceability',
          error: `Courier serviceability check failed: ${serviceabilityError.message || serviceabilityError}`,
          message: `Courier serviceability check failed: ${serviceabilityError.message || serviceabilityError}`,
          shipmentCreated: false,
          canRetry: true
        }, { status: 400 });
      }

      if (availableCouriers.length === 0) {
        return NextResponse.json({
          success: false,
          stage: 'serviceability',
          error: `No serviceable couriers found for delivery postcode: ${deliveryPostcode}`,
          message: `No serviceable couriers found for delivery postcode: ${deliveryPostcode}`,
          shipmentCreated: false,
          canRetry: true
        }, { status: 400 });
      }

      const bestCourier = availableCouriers[0];
      selectedCourierId = bestCourier.courier_company_id?.toString();
      selectedCourierName = bestCourier.courier_name;

      // 2. Prepare Shiprocket Order Payload
      const orderPayload = {
        order_id: order.orderNumber,
        order_date: order.createdAt.toISOString().slice(0, 16).replace('T', ' '),
        pickup_location: 'home',
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
        payment_method: isCod ? 'COD' : 'Prepaid',
        shipping_charges: order.shipping,
        sub_total: order.total,
        length: 10,
        breadth: 10,
        height: 10,
        weight: weight,
      };

      // 3. Create Order in Shiprocket
      let orderResult;
      try {
        orderResult = await shiprocketService.createOrder(orderPayload);
      } catch (createError: any) {
        console.error('[Shiprocket Create Order Error]', createError);
        return NextResponse.json({
          success: false,
          stage: 'create_order',
          error: `Failed to create Shiprocket order: ${createError.message || createError}`,
          message: `Failed to create Shiprocket order: ${createError.message || createError}`,
          shipmentCreated: false,
          canRetry: true
        }, { status: 400 });
      }

      srOrderId = orderResult.order_id.toString();
      srShipmentId = orderResult.shipment_id.toString();

      // Save order creation in database immediately before AWB assignment
      shipment = await prisma.shipment.create({
        data: {
          orderId: order.id,
          shiprocketOrderId: srOrderId,
          shiprocketId: srShipmentId,
          courierName: selectedCourierName,
          courierCompanyId: selectedCourierId,
          status: 'ORDER_CREATED',
        },
      });

      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'PROCESSING' },
      });
    }

    if (!shipment) {
      return NextResponse.json({
        success: false,
        stage: 'validation',
        error: 'Shipment could not be loaded or created.',
        message: 'Shipment could not be loaded or created.',
        shipmentCreated: false,
        canRetry: true
      }, { status: 500 });
    }

    // 4. Assign AWB (Only run if status is ORDER_CREATED)
    if (shipment.status === 'ORDER_CREATED') {
      let awbResult;
      try {
        awbResult = await shiprocketService.assignAWB(
          parseInt(shipment.shiprocketId!),
          selectedCourierId ? parseInt(selectedCourierId) : undefined
        );

        // Update to AWB_ASSIGNED
        shipment = await prisma.shipment.update({
          where: { id: shipment.id },
          data: {
            awbNumber: awbResult.awb_code,
            courierName: awbResult.courier_name || selectedCourierName,
            courierCompanyId: awbResult.courier_company_id || selectedCourierId,
            trackingUrl: awbResult.tracking_url,
            status: 'AWB_ASSIGNED',
          },
        });
      } catch (awbError: any) {
        console.error('[Shiprocket AWB Assignment Error]', awbError);

        // Detect Wallet Balance insufficiency
        const errorMessage = awbError.message || '';
        const isWalletError =
          errorMessage.toLowerCase().includes('wallet') ||
          errorMessage.toLowerCase().includes('balance') ||
          errorMessage.toLowerCase().includes('recharge') ||
          errorMessage.toLowerCase().includes('insufficient');

        const friendlyErrorMsg = isWalletError
          ? 'Shiprocket order created successfully. AWB could not be assigned because the Shiprocket wallet balance is insufficient.'
          : `AWB assignment failed: ${errorMessage}`;

        return NextResponse.json({
          success: false,
          stage: 'assign_awb',
          error: friendlyErrorMsg,
          message: friendlyErrorMsg,
          shipmentCreated: true,
          canRetry: true,
          shipment
        }, { status: 400 });
      }
    }

    // 5. Generate Pickup (Only run if status is AWB_ASSIGNED)
    if (shipment.status === 'AWB_ASSIGNED') {
      let pickupResult;
      try {
        pickupResult = await shiprocketService.generatePickup(parseInt(shipment.shiprocketId!));

        // Update to PICKUP_SCHEDULED
        shipment = await prisma.shipment.update({
          where: { id: shipment.id },
          data: {
            pickupStatus: pickupResult.pickup_status,
            status: 'PICKUP_SCHEDULED',
          },
        });
      } catch (pickupError: any) {
        console.error('[Shiprocket Pickup Error]', pickupError);
        return NextResponse.json({
          success: false,
          stage: 'generate_pickup',
          error: `AWB assigned but pickup scheduling failed: ${pickupError.message || pickupError}`,
          message: `AWB assigned but pickup scheduling failed: ${pickupError.message || pickupError}`,
          shipmentCreated: true,
          canRetry: true,
          shipment
        }, { status: 400 });
      }
    }

    // 6. Generate Label & Manifest (Only run if status is PICKUP_SCHEDULED)
    if (shipment.status === 'PICKUP_SCHEDULED') {
      let labelUrl = shipment.labelUrl;
      let manifestUrl = shipment.manifestUrl;

      if (!labelUrl) {
        try {
          const labelResult = await shiprocketService.generateLabel(parseInt(shipment.shiprocketId!));
          labelUrl = labelResult.label_url;
          
          shipment = await prisma.shipment.update({
            where: { id: shipment.id },
            data: { labelUrl },
          });
        } catch (labelError: any) {
          console.error('[Shiprocket Label Generation Error]', labelError);
        }
      }

      if (!manifestUrl) {
        try {
          const manifestResult = await shiprocketService.generateManifest(parseInt(shipment.shiprocketId!));
          manifestUrl = manifestResult.manifest_url;
          
          shipment = await prisma.shipment.update({
            where: { id: shipment.id },
            data: { manifestUrl },
          });
        } catch (manifestError: any) {
          console.error('[Shiprocket Manifest Generation Error]', manifestError);
        }
      }
    }

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
