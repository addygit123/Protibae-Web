export type AnalyticsConsent = {
  essential: boolean; // Always true
  analytics: boolean; // GA4, GTM, Clarity
  marketing: boolean; // Meta Pixel, etc.
};

export interface ProductData {
  id: string;
  name: string;
  price: number;
  category?: string;
  brand?: string;
  variant?: string;
  quantity?: number;
}

export interface EcommerceEventData {
  currency?: string;
  value?: number;
  items: ProductData[];
  coupon?: string;
  transaction_id?: string;
  shipping?: number;
  tax?: number;
}

export type CustomEventParams = Record<string, unknown>;
