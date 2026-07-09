import { env } from '@/lib/env';

const SHIPROCKET_API_URL = 'https://apiv2.shiprocket.in/v1/external';

let tokenCache: string | null = null;
let tokenExpiry: number | null = null;

export const shiprocketService = {
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
      const err = await res.json();
      throw new Error(`Shiprocket auth failed: ${err.message || 'Unknown error'}`);
    }

    const data = await res.json();
    tokenCache = data.token;
    // Shiprocket tokens usually last a few days, we cache it for 24 hours
    tokenExpiry = Date.now() + 24 * 60 * 60 * 1000;

    return data.token;
  },

  async createOrderAndGenerateAWB(orderPayload: any) {
    const token = await this.authenticate();

    // 1. Create Order
    const orderRes = await fetch(`${SHIPROCKET_API_URL}/orders/create/adhoc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderPayload),
    });

    if (!orderRes.ok) {
      const errText = await orderRes.text();
      throw new Error(`Failed to create Shiprocket order: ${errText}`);
    }

    const orderData = await orderRes.json();
    const shiprocketOrderId = orderData.order_id;
    const shipmentId = orderData.shipment_id;

    // 2. Generate AWB
    const awbRes = await fetch(`${SHIPROCKET_API_URL}/courier/generate/awb`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        shipment_id: shipmentId,
      }),
    });

    if (!awbRes.ok) {
      const errText = await awbRes.text();
      throw new Error(`Failed to generate AWB: ${errText}`);
    }

    const awbData = await awbRes.json();
    const awbPayload = awbData.response?.data;

    return {
      shiprocketOrderId,
      shipmentId,
      awbNumber: awbPayload?.awb_code,
      courierName: awbPayload?.courier_name,
      trackingUrl: `https://shiprocket.co/tracking/${awbPayload?.awb_code}`,
    };
  }
};
