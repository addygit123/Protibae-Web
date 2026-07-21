import { pushGa4Event } from './providers/ga4';
import { pushGtmEvent } from './providers/gtm';
import { pushPixelEvent } from './providers/pixel';
import { pushClarityEvent } from './providers/clarity';
import { EcommerceEventData, CustomEventParams } from './types';
import { useConsentStore } from './store';
import { analyticsConfig } from './config';

/**
 * Shared helper to push events to all active providers that the user has consented to.
 */
const trackEvent = (
  eventName: string,
  params?: CustomEventParams,
  ecommerceParams?: EcommerceEventData
) => {
  const { consent } = useConsentStore.getState();

  // 1. Google Analytics 4
  if (consent.analytics && analyticsConfig.gaId) {
    if (ecommerceParams) {
      pushGa4Event(eventName, ecommerceParams);
    } else {
      pushGa4Event(eventName, params);
    }
  }

  // 2. Google Tag Manager
  if (consent.analytics && analyticsConfig.gtmId) {
    if (ecommerceParams) {
      pushGtmEvent(eventName, { ecommerce: ecommerceParams, ...params });
    } else {
      pushGtmEvent(eventName, params);
    }
  }

  // 3. Meta Pixel
  if (consent.marketing && analyticsConfig.pixelId) {
    // Basic mapping for Pixel ecommerce events
    const pixelParams = ecommerceParams
      ? {
          content_ids: ecommerceParams.items.map((i) => i.id),
          content_type: 'product',
          value: ecommerceParams.value,
          currency: ecommerceParams.currency || 'INR',
          ...params,
        }
      : params;
    
    // Pixel event names mapping (simplified)
    const pixelEventName =
      eventName === 'view_item' ? 'ViewContent' :
      eventName === 'add_to_cart' ? 'AddToCart' :
      eventName === 'begin_checkout' ? 'InitiateCheckout' :
      eventName === 'purchase' ? 'Purchase' :
      eventName === 'search' ? 'Search' : eventName;

    pushPixelEvent(pixelEventName, pixelParams);
  }

  // 4. Microsoft Clarity
  if (consent.analytics && analyticsConfig.clarityId) {
    pushClarityEvent(eventName, params);
  }
};

// ─── Reusable Event Helpers ──────────────────────────────────────────────────

export const trackPageView = (url: string) => {
  trackEvent('page_view', { page_path: url });
};

export const trackProductView = (data: EcommerceEventData) => {
  trackEvent('view_item', undefined, data);
};

export const trackProductList = (data: EcommerceEventData) => {
  trackEvent('view_item_list', undefined, data);
};

export const trackAddToCart = (data: EcommerceEventData) => {
  trackEvent('add_to_cart', undefined, data);
};

export const trackRemoveFromCart = (data: EcommerceEventData) => {
  trackEvent('remove_from_cart', undefined, data);
};

export const trackBeginCheckout = (data: EcommerceEventData) => {
  trackEvent('begin_checkout', undefined, data);
};

export const trackPurchase = (data: EcommerceEventData) => {
  trackEvent('purchase', undefined, data);
};

export const trackSearch = (searchTerm: string) => {
  trackEvent('search', { search_term: searchTerm });
};

export const trackNewsletterSignup = (method: string = 'footer_form') => {
  trackEvent('sign_up', { method, type: 'newsletter' });
};

export const trackContact = (reason: string = 'general') => {
  trackEvent('contact', { reason });
};

export const trackLogin = (method: string = 'credentials') => {
  trackEvent('login', { method });
};

export const trackSignup = (method: string = 'credentials') => {
  trackEvent('sign_up', { method, type: 'account' });
};
