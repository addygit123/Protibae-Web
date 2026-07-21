import { CustomEventParams, EcommerceEventData } from '../types';

export const pushGa4Event = (eventName: string, params?: CustomEventParams | EcommerceEventData) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).gtag('event', eventName, params);
  }
};
