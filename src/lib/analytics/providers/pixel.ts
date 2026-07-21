import { CustomEventParams } from '../types';

export const pushPixelEvent = (eventName: string, params?: CustomEventParams) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
    // Standard events use 'track', custom use 'trackCustom'
    const standardEvents = ['PageView', 'ViewContent', 'AddToCart', 'InitiateCheckout', 'Purchase', 'Search', 'Contact'];
    const trackType = standardEvents.includes(eventName) ? 'track' : 'trackCustom';
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).fbq(trackType, eventName, params);
  }
};
