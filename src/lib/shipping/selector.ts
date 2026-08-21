import { env } from '@/lib/env';
import type { ShippingOption } from './types';

export function getBestShippingOption(
  options: ShippingOption[],
  deliveryPostcode: string
): ShippingOption | null {
  if (!options || options.length === 0) return null;

  // Filter only enabled providers (this might be handled in registry, but double check)
  const enabledProviders = options.filter(opt => {
    switch (opt.providerId) {
      case 'shiprocket': return env.SHIPPING_PROVIDER_SHIPROCKET_ENABLED;
      case 'indiapost': return env.SHIPPING_PROVIDER_INDIAPOST_ENABLED;
      case 'porter': return env.SHIPPING_PROVIDER_PORTER_ENABLED;
      case 'nimbuspost': return env.SHIPPING_PROVIDER_NIMBUSPOST_ENABLED;
      default: return false;
    }
  });

  if (enabledProviders.length === 0) return null;

  // Sort options: Fast delivery first, then lowest price
  const sortedOptions = enabledProviders.sort((a, b) => {
    if (a.isFast && !b.isFast) return -1;
    if (!a.isFast && b.isFast) return 1;
    return a.rate - b.rate;
  });

  const bestOption = { ...sortedOptions[0] };

  // Check Jabalpur fast delivery rule
  if (env.FAST_DELIVERY_ENABLED) {
    let fastDeliveryPincodes: string[] = [];
    try {
      if (env.FAST_DELIVERY_PINCODES) {
        fastDeliveryPincodes = JSON.parse(env.FAST_DELIVERY_PINCODES);
      }
    } catch (e) {
      console.error('Failed to parse FAST_DELIVERY_PINCODES');
    }

    if (fastDeliveryPincodes.includes(deliveryPostcode)) {
      bestOption.etaLabel = 'Same Day Delivery';
      bestOption.isFast = true;
    }
  }

  // Anonymize the option for the frontend
  // We keep the ID so the backend knows which option was selected, but we hide the providerName
  bestOption.providerName = 'Standard Delivery';
  bestOption.courierName = 'Standard Courier';
  bestOption.rate = 0; // Completely hide internal provider cost from frontend

  return bestOption;
}
