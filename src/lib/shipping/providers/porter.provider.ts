import type { 
  ShippingProvider, 
  ShippingProviderId, 
  ShippingOption, 
  ShipmentOrderInput, 
  ShipmentResult, 
  NormalizedShipmentStatus 
} from '../types';
import { normalizePorterStatus } from '../status';

export class PorterProvider implements ShippingProvider {
  id: ShippingProviderId = 'porter';
  displayName = 'Porter';

  isConfigured(): boolean {
    return true; // Keep enabled for local serviceability checks
  }

  normalizeStatus(rawStatus: string): NormalizedShipmentStatus {
    return normalizePorterStatus(rawStatus);
  }

  async getServiceability(
    _pickupPostcode: string,
    deliveryPostcode: string,
    _weightKg: number,
    _cod: boolean
  ): Promise<ShippingOption[]> {
    // If the delivery address is in Jabalpur (pincode starts with 482)
    if (deliveryPostcode.startsWith('482')) {
      return [{
        id: 'porter:same-day',
        providerId: 'porter',
        providerName: 'Porter Same Day',
        courierName: 'Porter Same Day',
        rate: 60, // Same-day shipping rate
        etaLabel: 'Same Day Delivery (within 3-6 hours)',
        isFast: true,
        isCodAvailable: true,
      }];
    }
    return [];
  }

  async createShipment(
    order: ShipmentOrderInput,
    selectedOption: ShippingOption
  ): Promise<ShipmentResult> {
    return {
      providerId: this.id,
      providerOrderId: `PORTER-${order.orderId}`,
      courierName: 'Porter Bike (Manual)',
      status: 'ORDER_CREATED',
      shippingCharge: selectedOption.rate,
    };
  }
}
