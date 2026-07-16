import { env } from '@/lib/env';

const SHIPROCKET_API_URL = 'https://apiv2.shiprocket.in/v1/external';

let tokenCache: string | null = null;
let tokenExpiry: number | null = null;

export const shiprocketService = {
  /**
   * Authenticates with Shiprocket and caches the token for 24 hours.
   */
  async authenticate(): Promise<string> {
    if (tokenCache && tokenExpiry && Date.now() < tokenExpiry) {
      return tokenCache;
    }

    if (!env.SHIPROCKET_EMAIL || !env.SHIPROCKET_PASSWORD) {
      throw new Error('Shiprocket credentials missing');
    }

    const res = await fetch(`${SHIPROCKET_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: env.SHIPROCKET_EMAIL,
        password: env.SHIPROCKET_PASSWORD,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`Shiprocket auth failed: ${err.message || 'Unknown error'}`);
    }

    const data = await res.json();
    if (env.NODE_ENV === 'development') {
      // console.log('========== SHIPROCKET AUTH RESPONSE ==========');
      // console.dir(data, { depth: null });
    }

    tokenCache = data.token;
    // Cache for 24 hours (Shiprocket tokens typically last 10 days)
    tokenExpiry = Date.now() + 24 * 60 * 60 * 1000;

    return data.token;
  },

  /**
   * Checks courier serviceability and returns serviceable couriers sorted by cost (asc) and rating (desc).
   */
  async checkServiceability(
    pickupPostcode: string,
    deliveryPostcode: string,
    weight: number,
    cod: boolean
  ): Promise<any[]> {
    const token = await this.authenticate();
    const codParam = cod ? 1 : 0;
    const url = `${SHIPROCKET_API_URL}/courier/serviceability?pickup_postcode=${pickupPostcode}&delivery_postcode=${deliveryPostcode}&weight=${weight}&cod=${codParam}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Courier serviceability check failed: ${errText}`);
    }

    const data = await res.json();
    if (env.NODE_ENV === 'development') {
      // console.log('========== SHIPROCKET SERVICEABILITY RESPONSE ==========');
      // console.dir(data, { depth: null });
    }

    const couriers = data?.data?.available_courier_companies || [];

    // Sort couriers:
    // 1. Lowest shipping cost (freight_charge or rate) ascending.
    // 2. Best rated (rating or delivery_performance) descending.
    couriers.sort((a: any, b: any) => {
      const costA = parseFloat(a.freight_charge || a.rate || 0);
      const costB = parseFloat(b.freight_charge || b.rate || 0);
      if (costA !== costB) {
        return costA - costB;
      }
      const ratingA = parseFloat(a.rating || a.delivery_performance || 0);
      const ratingB = parseFloat(b.rating || b.delivery_performance || 0);
      return ratingB - ratingA;
    });

    return couriers;
  },

  /**
   * Creates an adhoc order in Shiprocket.
   */
  async createOrder(orderPayload: any): Promise<{ order_id: number; shipment_id: number; status: string }> {
    const token = await this.authenticate();

    const res = await fetch(`${SHIPROCKET_API_URL}/orders/create/adhoc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderPayload),
    });

    const data = await res.json().catch(() => null);
    if (env.NODE_ENV === 'development') {
      console.log('========== SHIPROCKET CREATE ORDER RESPONSE ==========');
      console.dir(data, { depth: null });
    }

    if (!res.ok || !data || data.status_code === 422 || !data.order_id || !data.shipment_id) {
      const errMsg = data?.message || (data && JSON.stringify(data)) || 'Failed to create order on Shiprocket';
      throw new Error(errMsg);
    }

    return {
      order_id: data.order_id,
      shipment_id: data.shipment_id,
      status: data.status || 'NEW',
    };
  },

  /**
   * Assigns an AWB (Air Waybill) to a shipment.
   */
  async assignAWB(
    shipmentId: number,
    courierCompanyId?: number
  ): Promise<{ awb_code: string; courier_name: string; courier_company_id: string; tracking_url: string }> {
    const token = await this.authenticate();

    const payload: any = {
      shipment_id: shipmentId,
    };
    if (courierCompanyId !== undefined) {
      payload.courier_id = courierCompanyId;
    }

    const res = await fetch(`${SHIPROCKET_API_URL}/courier/assign/awb`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);
    if (env.NODE_ENV === 'development') {
      console.log('========== SHIPROCKET ASSIGN AWB RESPONSE ==========');
      console.dir(data, { depth: null });
    }

    if (!res.ok || !data) {
      throw new Error('Failed to assign AWB on Shiprocket');
    }

    const awbPayload = data?.response?.data;
    if (!awbPayload || !awbPayload.awb_code) {
      const errorMsg = data?.response?.message || data?.message || 'AWB assignment failed: No AWB code returned';
      throw new Error(errorMsg);
    }

    return {
      awb_code: awbPayload.awb_code,
      courier_name: awbPayload.courier_name,
      courier_company_id: awbPayload.courier_company_id?.toString() || courierCompanyId?.toString() || '',
      tracking_url: awbPayload.tracking_url || awbPayload.track_url || `https://shiprocket.co/tracking/${awbPayload.awb_code}`,
    };
  },

  /**
   * Generates a pickup request for a shipment.
   */
  async generatePickup(shipmentId: number): Promise<{ pickup_status: string; pickup_token?: string; pickup_id?: number }> {
    const token = await this.authenticate();

    const res = await fetch(`${SHIPROCKET_API_URL}/courier/generate/pickup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        shipment_id: [shipmentId],
      }),
    });

    const data = await res.json().catch(() => null);
    if (env.NODE_ENV === 'development') {
      console.log('========== SHIPROCKET GENERATE PICKUP RESPONSE ==========');
      console.dir(data, { depth: null });
    }

    if (!res.ok || !data || data.pickup_status === 'error' || data.success === false) {
      const errMsg = data?.message || 'Pickup generation failed';
      throw new Error(errMsg);
    }

    return {
      pickup_status: data.pickup_status || 'scheduled',
      pickup_token: data.pickup_token || '',
      pickup_id: data.pickup_id || null,
    };
  },

  /**
   * Generates a shipping label for a shipment.
   */
  async generateLabel(shipmentId: number): Promise<{ label_url: string }> {
    const token = await this.authenticate();

    const res = await fetch(`${SHIPROCKET_API_URL}/courier/generate/label`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        shipment_id: [shipmentId],
      }),
    });

    const data = await res.json().catch(() => null);
    if (env.NODE_ENV === 'development') {
      console.log('========== SHIPROCKET GENERATE LABEL RESPONSE ==========');
      console.dir(data, { depth: null });
    }

    if (!res.ok || !data || !data.label_url) {
      const errMsg = data?.message || 'Label generation failed';
      throw new Error(errMsg);
    }

    return {
      label_url: data.label_url,
    };
  },

  /**
   * Generates a manifest for a shipment.
   */
  async generateManifest(shipmentId: number): Promise<{ manifest_url: string }> {
    const token = await this.authenticate();

    const res = await fetch(`${SHIPROCKET_API_URL}/manifests/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        shipment_id: [shipmentId],
      }),
    });

    const data = await res.json().catch(() => null);
    if (env.NODE_ENV === 'development') {
      // console.log('========== SHIPROCKET GENERATE MANIFEST RESPONSE ==========');
      // console.dir(data, { depth: null });
    }

    if (!res.ok || !data || !data.manifest_url) {
      const errMsg = data?.message || 'Manifest generation failed';
      throw new Error(errMsg);
    }

    return {
      manifest_url: data.manifest_url,
    };
  },

  /**
   * Tracks a shipment by its AWB code.
   */
  async trackShipment(awbNumber: string): Promise<any> {
    const token = await this.authenticate();

    const res = await fetch(`${SHIPROCKET_API_URL}/courier/track/awb/${awbNumber}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to track shipment: ${errText}`);
    }

    const data = await res.json();
    if (env.NODE_ENV === 'development') {
      // console.log('========== SHIPROCKET TRACKING RESPONSE ==========');
      // console.dir(data, { depth: null });
    }

    return data;
  },
};
