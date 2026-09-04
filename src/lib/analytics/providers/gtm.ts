import { CustomEventParams, EcommerceEventData } from '../types';

export const pushGtmEvent = (eventName: string, params?: CustomEventParams | { ecommerce: EcommerceEventData }) => {
  if (typeof window !== 'undefined') {
    const w = window as unknown as Window & { dataLayer: Record<string, unknown>[] };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({
      event: eventName,
      ...params,
    });
  }
};
