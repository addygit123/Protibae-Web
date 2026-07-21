import { CustomEventParams, EcommerceEventData } from '../types';

export const pushGtmEvent = (eventName: string, params?: CustomEventParams | { ecommerce: EcommerceEventData }) => {
  if (typeof window !== 'undefined') {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: eventName,
      ...params,
    });
  }
};
