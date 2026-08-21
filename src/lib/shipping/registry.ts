import type { ShippingProvider, ShippingProviderId } from './types';
import { ShiprocketProvider } from './providers/shiprocket.provider';
import { NimbusPostProvider } from './providers/nimbuspost.provider';
import { PorterProvider } from './providers/porter.provider';
import { IndiaPostProvider } from './providers/indiapost.provider';

let providersCache: ShippingProvider[] | null = null;

export function getEnabledProviders(): ShippingProvider[] {
  if (providersCache) return providersCache;

  const allProviders = [
    new PorterProvider(), // Fast local delivery prioritized
    new ShiprocketProvider(),
    new NimbusPostProvider(),
    new IndiaPostProvider(), // Always available as fallback
  ];

  // Only return providers that have required configuration
  providersCache = allProviders.filter((provider) => provider.isConfigured());
  
  return providersCache;
}

export function getProvider(id: ShippingProviderId): ShippingProvider {
  const provider = getEnabledProviders().find((p) => p.id === id);
  if (!provider) {
    // If not found in enabled, try instantiating directly (e.g. for fallback/manual cases)
    switch (id) {
      case 'shiprocket': return new ShiprocketProvider();
      case 'nimbuspost': return new NimbusPostProvider();
      case 'porter': return new PorterProvider();
      case 'indiapost': return new IndiaPostProvider();
      default: throw new Error(`Unknown shipping provider: ${id}`);
    }
  }
  return provider;
}
