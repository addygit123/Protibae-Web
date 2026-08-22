import { env } from '@/lib/env';
import type { ShippingOption } from './types';

export function getAvailableShippingOptions(
  options: ShippingOption[],
  deliveryPostcode: string
): ShippingOption[] {
  if (!options || options.length === 0) return [];

  // Filter only enabled providers
  const enabledProviders = options.filter(opt => {
    switch (opt.providerId) {
      case 'shiprocket': return env.SHIPPING_PROVIDER_SHIPROCKET_ENABLED;
      case 'indiapost': return env.SHIPPING_PROVIDER_INDIAPOST_ENABLED;
      case 'porter': return true; // Always enable Porter local checks
      case 'nimbuspost': return env.SHIPPING_PROVIDER_NIMBUSPOST_ENABLED;
      default: return false;
    }
  });

  if (enabledProviders.length === 0) return [];

  // Separate standard options and Porter same-day options
  const porterOption = enabledProviders.find(opt => opt.providerId === 'porter');
  
  // Standard option is the cheapest of non-porter options
  const standardOptions = enabledProviders.filter(opt => opt.providerId !== 'porter');
  const sortedStandard = standardOptions.sort((a, b) => a.rate - b.rate);
  const bestStandard = sortedStandard[0] ? { ...sortedStandard[0] } : null;

  const result: ShippingOption[] = [];

  if (bestStandard) {
    bestStandard.providerName = 'Standard Delivery';
    bestStandard.courierName = 'Standard Courier';
    result.push(bestStandard);
  }

  if (porterOption) {
    const matchedPorter = { ...porterOption };
    matchedPorter.providerName = 'Same Day Delivery';
    matchedPorter.courierName = 'Porter Bike';
    result.push(matchedPorter);
  }

  // Fallback if result is empty
  if (result.length === 0 && enabledProviders.length > 0) {
    const fallback = { ...enabledProviders[0] };
    fallback.providerName = 'Standard Delivery';
    result.push(fallback);
  }

  return result;
}

export function getBestShippingOption(
  options: ShippingOption[],
  deliveryPostcode: string
): ShippingOption | null {
  const available = getAvailableShippingOptions(options, deliveryPostcode);
  return available.length > 0 ? available[0] : null;
}
