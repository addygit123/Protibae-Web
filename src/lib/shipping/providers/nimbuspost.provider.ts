import type { 
  ShippingProvider, 
  ShippingProviderId, 
  ShippingOption, 
  ShipmentOrderInput, 
  ShipmentResult, 
  NormalizedShipmentStatus 
} from '../types';
import { normalizeNimbusPostStatus, etaLabel, isFastDelivery } from '../status';
import { env } from '@/lib/env';

export class NimbusPostProvider implements ShippingProvider {
  id: ShippingProviderId = 'nimbuspost';
  displayName = 'NimbusPost';

  isConfigured(): boolean {
    return !!(env.NIMBUSPOST_API_TOKEN && env.NIMBUSPOST_CLIENT_ID);
  }

  normalizeStatus(rawStatus: string): NormalizedShipmentStatus {
    return normalizeNimbusPostStatus(rawStatus);
  }

  private getHeaders() {
    return {
      'x-api-key': env.NIMBUSPOST_API_TOKEN || '',
      'x-api-secret': env.NIMBUSPOST_CLIENT_ID || '',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  async getServiceability(
    pickupPostcode: string,
    deliveryPostcode: string,
    weightKg: number,
    cod: boolean
  ): Promise<ShippingOption[]> {
    if (!this.isConfigured()) return [];

    try {
      const payload = {
        pickupPincode: pickupPostcode,
        deliveryPincode: deliveryPostcode,
        paymentMode: cod ? 'cod' : 'prepaid',
        packages: [{
          weight: Math.ceil(weightKg * 1000), // convert kg to grams
          length: 10,
          width: 10,
          height: 10
        }],
        orderValuePaise: 100000 // default dummy value, req for cod
      };

      const res = await fetch('https://api-v2.nimbuspost.com/v2/serviceability', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (!res.ok || !json.success || !json.data) {
        console.error('[NimbusPostProvider] Serviceability error:', json);
        return [];
      }

      const available = json.data.available || [];
      return available.map((opt: { courierId: string | number; courierName: string; result?: { totalPaise?: number }; tatDays?: number }) => ({
        id: `nimbuspost:${opt.courierId}`,
        providerId: this.id,
        providerName: this.displayName,
        courierName: opt.courierName,
        rate: Math.ceil((opt.result?.totalPaise || 0) / 100),
        estimatedDays: opt.tatDays || 3,
        etaLabel: etaLabel(opt.tatDays || 3),
        isFast: isFastDelivery(opt.tatDays || 3)
      }));

    } catch (error) {
      console.error('[NimbusPostProvider] Serviceability failed:', error);
      return [];
    }
  }

  async createShipment(
    order: ShipmentOrderInput,
    selectedOption: ShippingOption
  ): Promise<ShipmentResult> {
    if (!this.isConfigured()) {
      throw new Error('NimbusPost credentials missing');
    }

    const courierId = selectedOption.id.replace('nimbuspost:', '');

    const payload = {
      order_number: order.orderNumber,
      order_type: 'b2c',
      payment_mode: order.isCod ? 'cod' : 'prepaid',
      order_collectable_amount: order.isCod ? Math.ceil(order.total) : 0,
      ...(env.NIMBUSPOST_WAREHOUSE_ID ? { warehouse_id: env.NIMBUSPOST_WAREHOUSE_ID } : {}),
      shipping_address: {
        name: `${order.address.firstName} ${order.address.lastName}`.trim(),
        email: order.address.email || 'customer@example.com',
        address: order.address.street,
        pincode: parseInt(order.address.zip.replace(/[^0-9]/g, '')) || 0,
        city: order.address.city,
        state: order.address.state,
        country: order.address.country,
        phone: parseInt((order.address.phone || '').replace(/[^0-9]/g, '')) || 9999999999
      },
      items: order.items.map(item => ({
        name: item.name,
        qty: item.quantity,
        price: item.price,
        sku: item.sku
      })),
      package: {
        weight: order.weightKg,
        length: 10,
        width: 10,
        height: 10
      },
      courier_id: courierId
    };

    const res = await fetch('https://api-v2.nimbuspost.com/v2/shipments', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });

    const json = await res.json();
    if (!res.ok || !json.success || !json.data?.booking) {
      console.error('[NimbusPostProvider] Create shipment error:', json);
      throw new Error(json.error?.detail || 'Failed to create NimbusPost shipment');
    }

    const booking = json.data.booking;

    return {
      providerId: this.id,
      providerOrderId: booking.order_id?.toString() || order.orderId,
      providerShipmentId: booking.shipment_id?.toString() || booking.id?.toString(),
      awbNumber: booking.awb,
      courierName: booking.courier_name,
      trackingUrl: booking.tracking_url,
      status: 'AWB_ASSIGNED',
      shippingCharge: booking.price?.total || selectedOption.rate,
      estimatedDelivery: selectedOption.estimatedDelivery ? new Date(selectedOption.estimatedDelivery) : undefined,
    };
  }
}
