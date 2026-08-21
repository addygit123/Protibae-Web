import { getEnabledProviders, getProvider } from './registry';
import type { ShippingOption, ShipmentOrderInput, ShipmentResult, ShippingProviderId } from './types';

/**
 * Fetch all available shipping options from all enabled providers for a given route.
 */
export async function getShippingOptions(
  pickupPostcode: string,
  deliveryPostcode: string,
  weightKg: number,
  cod: boolean
): Promise<ShippingOption[]> {
  const providers = getEnabledProviders();
  const allOptions: ShippingOption[] = [];

  const results = await Promise.allSettled(
    providers.map((p) => p.getServiceability(pickupPostcode, deliveryPostcode, weightKg, cod))
  );

  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      allOptions.push(...result.value);
    } else {
      console.error('[Shipping Module] Provider serviceability check failed:', result.reason);
    }
  });

  // Sort options: Fast delivery first, then lowest price
  return allOptions.sort((a, b) => {
    if (a.isFast && !b.isFast) return -1;
    if (!a.isFast && b.isFast) return 1;
    return a.rate - b.rate;
  });
}

/**
 * Validates a shipping option by re-fetching rates and confirming it's still available.
 * Returns the fresh option if valid, throws if invalid.
 */
export async function validateShippingOption(
  optionId: string, // format: "providerId:internalId"
  pickupPostcode: string,
  deliveryPostcode: string,
  weightKg: number,
  cod: boolean
): Promise<ShippingOption> {
  const [providerId, ...rest] = optionId.split(':');
  if (!providerId || rest.length === 0) {
    throw new Error('Invalid shipping option format');
  }

  const provider = getProvider(providerId as ShippingProviderId);
  const freshOptions = await provider.getServiceability(pickupPostcode, deliveryPostcode, weightKg, cod);

  const matchedOption = freshOptions.find((opt) => opt.id === optionId);
  if (!matchedOption) {
    throw new Error(`Shipping option ${optionId} is no longer available`);
  }

  return matchedOption;
}

/**
 * Dispatches shipment creation to the appropriate provider.
 */
export async function createShipmentForOrder(
  order: ShipmentOrderInput,
  selectedOptionId: string
): Promise<ShipmentResult> {
  const [providerId] = selectedOptionId.split(':');
  const provider = getProvider(providerId as ShippingProviderId);
  
  // Re-fetch serviceability to get full option object
  const options = await provider.getServiceability(order.pickupPostcode, order.address.zip, order.weightKg, order.isCod);
  const matchedOption = options.find(o => o.id === selectedOptionId);

  if (!matchedOption) {
    throw new Error(`Cannot create shipment: option ${selectedOptionId} not available at creation time.`);
  }

  return provider.createShipment(order, matchedOption);
}

// Re-export registry methods
export { getEnabledProviders, getProvider };
