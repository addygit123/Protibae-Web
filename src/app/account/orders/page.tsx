import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AccountLayout } from '@/components/account/AccountLayout';
import { OrdersClient } from '@/components/account/orders/OrdersClient';

export const metadata: Metadata = {
  title: 'My Orders | PROTIBAE',
  description: 'Manage your PROTIBAE orders and track your performance gains.',
  robots: { index: false, follow: false },
};

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return (
    <AccountLayout>
      <OrdersClient initialOrders={orders} />
    </AccountLayout>
  );
}
