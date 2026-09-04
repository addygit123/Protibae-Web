import type { 
  ShippingProvider, 
  ShippingProviderId, 
  ShippingOption, 
  ShipmentOrderInput, 
  ShipmentResult, 
  NormalizedShipmentStatus 
} from '../types';
import { normalizeIndiaPostStatus, etaLabel } from '../status';
import { env } from '@/lib/env';

export class IndiaPostProvider implements ShippingProvider {
  id: ShippingProviderId = 'indiapost';
  displayName = 'India Post';

  isConfigured(): boolean {
    return true; // Always configured as a manual fallback
  }

  normalizeStatus(rawStatus: string): NormalizedShipmentStatus {
    return normalizeIndiaPostStatus(rawStatus);
  }

  async getServiceability(
    _pickupPostcode: string,
    deliveryPostcode: string,
    _weightKg: number,
    _cod: boolean
  ): Promise<ShippingOption[]> {
    // India Post doesn't have a live serviceability API.
    // We provide a fallback option with a static estimate.
    
    const isMetro = ['1', '2', '3', '4', '5', '6', '7', '8'].includes(deliveryPostcode[0]); // Simple heuristic
    const transitDays = isMetro 
      ? (env.INDIAPOST_TRANSIT_DAYS_METRO || 3) 
      : (env.INDIAPOST_TRANSIT_DAYS_NON_METRO || 6);

    const estDeliveryDate = new Date();
    estDeliveryDate.setDate(estDeliveryDate.getDate() + transitDays);

    return [{
      id: `indiapost:standard`,
      providerId: this.id,
      providerName: 'India Post (Standard)',
      rate: 100, // Static rate for fallback
      estimatedDelivery: estDeliveryDate.toISOString(),
      etaLabel: etaLabel(estDeliveryDate),
      isFast: false,
      isCodAvailable: true,
      courierName: 'India Post',
    }];
  }

  async createShipment(
    order: ShipmentOrderInput,
    selectedOption: ShippingOption
  ): Promise<ShipmentResult> {
    // Since there's no live API, we just return a stubbed successful result.
    // The admin will manually enter the AWB later.
    const providerOrderId = `IP_${order.orderNumber}`;
    
    return {
      providerId: this.id,
      providerOrderId: providerOrderId,
      providerShipmentId: providerOrderId, // same for manual
      courierName: 'India Post',
      status: 'ORDER_CREATED',
      shippingCharge: selectedOption.rate,
      estimatedDelivery: selectedOption.estimatedDelivery ? new Date(selectedOption.estimatedDelivery) : undefined,
    };
  }
}
