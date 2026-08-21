import type { 
  ShippingProvider, 
  ShippingProviderId, 
  ShippingOption, 
  ShipmentOrderInput, 
  ShipmentResult, 
  NormalizedShipmentStatus 
} from '../types';
import { normalizePorterStatus, etaLabel, isFastDelivery } from '../status';
import { env } from '@/lib/env';

export class PorterProvider implements ShippingProvider {
  id: ShippingProviderId = 'porter';
  displayName = 'Porter';

  isConfigured(): boolean {
    return !!env.PORTER_API_KEY;
  }

  normalizeStatus(rawStatus: string): NormalizedShipmentStatus {
    return normalizePorterStatus(rawStatus);
  }

  async getServiceability(
    pickupPostcode: string,
    deliveryPostcode: string,
    weightKg: number,
    cod: boolean
  ): Promise<ShippingOption[]> {
    if (!this.isConfigured()) return [];

    try {
      // Stub for actual API call
      // Normally: POST /v1/get_quote
      return [];
    } catch (error) {
      console.error('[PorterProvider] Serviceability failed:', error);
      return [];
    }
  }

  async createShipment(
    order: ShipmentOrderInput,
    selectedOption: ShippingOption
  ): Promise<ShipmentResult> {
    if (!this.isConfigured()) {
      throw new Error('Porter credentials missing');
    }

    // Stub for actual API call
    throw new Error('Porter API not fully implemented');
  }
}
