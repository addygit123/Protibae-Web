import type { 
  ShippingProvider, 
  ShippingProviderId, 
  ShippingOption, 
  ShipmentOrderInput, 
  ShipmentResult, 
  NormalizedShipmentStatus 
} from '../types';
import { normalizeShiprocketStatus, etaLabel, isFastDelivery } from '../status';
import { shiprocketService } from '@/lib/services/shiprocket.service';
import { env } from '@/lib/env';

export class ShiprocketProvider implements ShippingProvider {
  id: ShippingProviderId = 'shiprocket';
  displayName = 'Shiprocket';

  isConfigured(): boolean {
    return !!(env.SHIPROCKET_EMAIL && env.SHIPROCKET_PASSWORD);
  }

  normalizeStatus(rawStatus: string): NormalizedShipmentStatus {
    return normalizeShiprocketStatus(rawStatus);
  }

  async getServiceability(
    pickupPostcode: string,
    deliveryPostcode: string,
    weightKg: number,
    cod: boolean
  ): Promise<ShippingOption[]> {
    if (!this.isConfigured()) return [];

    try {
      const couriers = await shiprocketService.checkServiceability(
        pickupPostcode,
        deliveryPostcode,
        weightKg,
        cod
      );

      if (!couriers || couriers.length === 0) return [];

      // We only return the best courier from Shiprocket to avoid overwhelming options,
      // since Shiprocket abstracts many couriers. 
      // The original code already sorted them by best cost/rating.
      const bestCourier = couriers[0];
      
      const rate = Number(bestCourier.freight_charge || bestCourier.rate || 0);
      let estDeliveryDate: Date | null = null;
      
      if (bestCourier.etd) {
        // Shiprocket etd is usually a string like "2023-11-20" or similar
        const parsedDate = new Date(String(bestCourier.etd));
        if (!isNaN(parsedDate.getTime())) {
          estDeliveryDate = parsedDate;
        }
      }

      return [{
        id: `shiprocket:${bestCourier.courier_company_id}`,
        providerId: this.id,
        providerName: 'Standard Delivery (Shiprocket)',
        rate,
        estimatedDelivery: estDeliveryDate ? estDeliveryDate.toISOString() : undefined,
        etaLabel: etaLabel(estDeliveryDate),
        isFast: isFastDelivery(estDeliveryDate),
        isCodAvailable: cod, // Shiprocket API returned it based on cod parameter
        courierName: String(bestCourier.courier_name || 'Shiprocket'),
        courierId: bestCourier.courier_company_id?.toString(),
      }];

    } catch (error) {
      console.error('[ShiprocketProvider] Serviceability failed:', error);
      return [];
    }
  }

  async createShipment(
    order: ShipmentOrderInput,
    selectedOption: ShippingOption
  ): Promise<ShipmentResult> {
    if (!this.isConfigured()) {
      throw new Error('Shiprocket credentials missing');
    }

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
      billing_email: order.address.email,
      billing_phone: order.address.phone || '9999999999',
      shipping_is_billing: true,
      order_items: order.items.map(item => ({
        name: item.name,
        sku: item.sku,
        units: item.quantity,
        selling_price: item.price,
      })),
      payment_method: order.isCod ? 'COD' : 'Prepaid',
      shipping_charges: selectedOption.rate, // use validated rate
      sub_total: order.total,
      length: 10,
      breadth: 10,
      height: 10,
      weight: order.weightKg,
    };

    const orderResult = await shiprocketService.createOrder(orderPayload);
    
    let awbResult;
    try {
      awbResult = await shiprocketService.assignAWB(
        orderResult.shipment_id,
        selectedOption.courierId ? parseInt(selectedOption.courierId) : undefined
      );
    } catch (e: unknown) {
      // If wallet is low, awb assigning might fail. Return ORDER_CREATED.
      console.error('[ShiprocketProvider] AWB assignment failed:', e);
      return {
        providerId: this.id,
        providerOrderId: orderResult.order_id.toString(),
        providerShipmentId: orderResult.shipment_id.toString(),
        courierName: selectedOption.courierName,
        status: 'ORDER_CREATED', 
        shippingCharge: selectedOption.rate,
        estimatedDelivery: selectedOption.estimatedDelivery ? new Date(selectedOption.estimatedDelivery) : undefined,
      };
    }

    // Attempt pickup generation
    try {
      await shiprocketService.generatePickup(orderResult.shipment_id);
    } catch (e) {
       console.error('[ShiprocketProvider] Pickup scheduling failed:', e);
    }

    return {
      providerId: this.id,
      providerOrderId: orderResult.order_id.toString(),
      providerShipmentId: orderResult.shipment_id.toString(),
      awbNumber: awbResult.awb_code,
      courierName: awbResult.courier_name,
      trackingUrl: awbResult.tracking_url,
      status: 'AWB_ASSIGNED',
      shippingCharge: selectedOption.rate,
      estimatedDelivery: selectedOption.estimatedDelivery ? new Date(selectedOption.estimatedDelivery) : undefined,
    };
  }
}
