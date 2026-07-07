import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { orderService } from '@/lib/services/order.service';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const order = await orderService.getOrderById(id, session.user.id);
    return NextResponse.json({ order });

  } catch (error) {
    console.error('[GET /api/orders/[id]] Error fetching order:', error);
    
    if (error instanceof Error && error.message === 'Order not found or unauthorized') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}
