import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getShippingOptions } from '@/lib/shipping';
import { z } from 'zod';
import { isStoreLive, getStoreBlockedResponse } from '@/lib/store-config';

const shippingOptionsSchema = z.object({
  pickupPostcode: z.string().min(6),
  deliveryPostcode: z.string().min(6),
  weightKg: z.coerce.number().positive().default(0.5),
  cod: z.coerce.boolean().default(false),
});

export async function GET(req: Request) {
  // Store mode guard
  if (!isStoreLive) {
    return NextResponse.json(getStoreBlockedResponse(), { status: 503 });
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = {
      pickupPostcode: searchParams.get('pickupPostcode'),
      deliveryPostcode: searchParams.get('deliveryPostcode'),
      weightKg: searchParams.get('weightKg'),
      cod: searchParams.get('cod') === 'true',
    };

    const result = shippingOptionsSchema.safeParse(query);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: result.error.issues },
        { status: 400 }
      );
    }

    const allOptions = await getShippingOptions(
      result.data.pickupPostcode,
      result.data.deliveryPostcode,
      result.data.weightKg,
      result.data.cod
    );

    const { getBestShippingOption } = await import('@/lib/shipping/selector');
    const bestOption = getBestShippingOption(allOptions, result.data.deliveryPostcode);

    return NextResponse.json({ options: bestOption ? [bestOption] : [] });
  } catch (error) {
    console.error('[GET /api/shipping/options] Error fetching options:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
