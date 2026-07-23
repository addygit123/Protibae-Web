import { Metadata } from 'next';
import { AccountLayout } from '@/components/account/AccountLayout';
import { BentoStats } from '@/components/account/BentoStats';
import { RecentOrders } from '@/components/account/RecentOrders';
import { AccountDetails } from '@/components/account/AccountDetails';

import { Truck, ShieldCheck, Undo2, Headset } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

export const metadata: Metadata = {
  title: 'My Account',
  description: 'Manage your PROTIBAE account, view orders, and track loyalty rewards.',
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      orders: {
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
      },
      addresses: true,
    },
  });

  if (!user) {
    redirect('/login');
  }

  const totalOrders = user.orders.length;

  const totalSpent = user.orders.reduce((sum, order) => sum + order.total, 0);

  const pendingOrders = user.orders.filter(
    (o) =>
      o.status === OrderStatus.PENDING ||
      o.status === OrderStatus.PROCESSING ||
      o.status === OrderStatus.PAID
  ).length;

  const deliveredOrders = user.orders.filter(
    (o) => o.status === OrderStatus.DELIVERED
  ).length;

  return (
    <AccountLayout>
      <div className="space-y-6">
        <BentoStats
          totalOrders={totalOrders}
          totalSpent={totalSpent}
          pendingOrders={pendingOrders}
          deliveredOrders={deliveredOrders}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <RecentOrders orders={user.orders} />

          <AccountDetails />
        </div>

        {/* Trust Badges */}

        <div className="grid grid-cols-2 gap-6 pt-8 md:grid-cols-4">
          <div className="flex flex-col items-center text-center">
            <div className="bg-surface-container border-outline-variant/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full border">
              <Truck className="text-primary h-6 w-6" />
            </div>
            <h4 className="font-label-bold mb-1 text-[10px] tracking-widest uppercase">
              Fast & Reliable Delivery
            </h4>
            <p className="text-on-surface-variant max-w-[150px] text-[10px]">
              Delivered fresh to your doorstep.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="bg-surface-container border-outline-variant/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full border">
              <ShieldCheck className="text-primary h-6 w-6" />
            </div>
            <h4 className="font-label-bold mb-1 text-[10px] tracking-widest uppercase">
              100% Secure Payment
            </h4>
            <p className="text-on-surface-variant max-w-[150px] text-[10px]">
              Your payment details are safe with us.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="bg-surface-container border-outline-variant/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full border">
              <Undo2 className="text-primary h-6 w-6" />
            </div>
            <h4 className="font-label-bold mb-1 text-[10px] tracking-widest uppercase">
              7 Day Easy Returns
            </h4>
            <p className="text-on-surface-variant max-w-[150px] text-[10px]">
              Not satisfied? We&apos;ve got you.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="bg-surface-container border-outline-variant/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full border">
              <Headset className="text-primary h-6 w-6" />
            </div>
            <h4 className="font-label-bold mb-1 text-[10px] tracking-widest uppercase">
              Customer Support
            </h4>
            <p className="text-on-surface-variant max-w-[150px] text-[10px]">
              We&apos;re here for you, always.
            </p>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}
