export type NormalizedShipmentStatus =
  | 'PENDING'
  | 'ORDER_CREATED'
  | 'AWB_ASSIGNED'
  | 'PICKUP_SCHEDULED'
  | 'OUT_FOR_PICKUP'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'FAILED'
  | 'CANCELLED'
  | 'RTO';

export type ShippingProviderId = 'shiprocket' | 'nimbuspost' | 'porter' | 'indiapost';

export interface ShippingOption {
  id: string; // providerId:internalId (e.g. shiprocket:10)
  providerId: ShippingProviderId;
  providerName: string;
  courierId?: string;
  courierName: string;
  rate: number;
  estimatedDelivery?: string; // ISO Date String
  etaLabel: string; // E.g., "Arrives Tomorrow", "3-5 Business Days"
  isFast: boolean; // Indicates same-day or next-day
  isCodAvailable: boolean;
}

export interface ShipmentOrderInput {
  orderId: string;
  orderNumber: string;
  createdAt: Date;
  isCod: boolean;
  pickupPostcode: string;
  address: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country?: string;
    phone?: string;
    email?: string;
  };
  items: Array<{
    name: string;
    sku: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
  weightKg: number;
}

export interface ShipmentResult {
  providerId: ShippingProviderId;
  providerOrderId: string;
  providerShipmentId?: string;
  awbNumber?: string;
  courierName?: string;
  trackingUrl?: string;
  status: NormalizedShipmentStatus;
  shippingCharge: number;
  estimatedDelivery?: Date;
}

export interface ShippingProvider {
  /** Uniquely identifies the provider */
  id: ShippingProviderId;

  /** Human-readable name */
  displayName: string;

  /** Check if the provider is fully configured with credentials */
  isConfigured(): boolean;

  /** Fetch available shipping options for a given route and weight */
  getServiceability(
    pickupPostcode: string,
    deliveryPostcode: string,
    weightKg: number,
    cod: boolean
  ): Promise<ShippingOption[]>;

  /**
   * Finalize shipment creation with the selected option.
   * This might generate an order, assign an AWB, or both, depending on the provider.
   */
  createShipment(
    order: ShipmentOrderInput,
    selectedOption: ShippingOption
  ): Promise<ShipmentResult>;
}
