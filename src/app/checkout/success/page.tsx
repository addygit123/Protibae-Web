import Link from 'next/link';
import { CheckCircle2, Package, MapPin } from 'lucide-react';
import { SectionReveal } from '@/components/sections/SectionReveal';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Confirmed | PROTIBAE',
};

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const { orderId } = await searchParams;

  if (!orderId) {
    redirect('/shop');
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: session.user.id,
    },
    include: {
      address: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#121317] px-6 py-16">
      <SectionReveal>
        <div className="w-full max-w-3xl rounded-2xl border border-[#594045]/20 bg-[#1a1b1f] p-10 shadow-2xl">
          <div className="mb-8 flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[#c41e5c]/30 bg-[#c41e5c]/10">
              <CheckCircle2 className="h-12 w-12 text-[#c41e5c]" />
            </div>
          </div>

          <h1 className="font-display text-center text-5xl text-white uppercase">
            ORDER CONFIRMED
          </h1>

          <p className="mt-4 text-center text-[#e1bec3]">
            Thanks for your order,
            <span className="font-bold text-white">
              {' '}
              {session.user.firstName ?? session.user.name}
            </span>
            .
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-[#0d0e12] p-6">
              <p className="text-xs tracking-[0.3em] text-[#a8898e] uppercase">
                Order Number
              </p>

              <p className="mt-2 font-mono text-2xl font-bold text-white">
                {order.orderNumber}
              </p>
            </div>

            <div className="rounded-xl bg-[#0d0e12] p-6">
              <p className="text-xs tracking-[0.3em] text-[#a8898e] uppercase">
                Total Paid
              </p>

              <p className="mt-2 text-2xl font-bold text-white">
                ₹{order.total}
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-xl border border-[#594045]/20 p-6">
            <div className="mb-5 flex items-center gap-2">
              <Package size={18} />
              <h2 className="font-bold text-white">Items Ordered</h2>
            </div>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-[#2d2e33] pb-4"
                >
                  <div>
                    <p className="font-semibold text-white">
                      {item.product.name}
                    </p>

                    <p className="text-sm text-[#a8898e]">
                      Qty {item.quantity}
                    </p>
                  </div>

                  <p className="font-bold text-white">₹{item.price}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-[#594045]/20 p-6">
            <div className="mb-4 flex items-center gap-2">
              <MapPin size={18} />
              <h2 className="font-bold text-white">Shipping Address</h2>
            </div>

            <p className="text-[#e1bec3]">
              {order.address.firstName} {order.address.lastName}
            </p>

            <p className="text-[#e1bec3]">{order.address.street}</p>

            <p className="text-[#e1bec3]">
              {order.address.city} {order.address.zip}
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href={`/account/orders/${order.id}`}
              className="flex-1 rounded-lg border border-[#594045]/30 py-4 text-center font-bold text-white hover:bg-[#24252a]"
            >
              VIEW ORDER
            </Link>

            <Link
              href="/shop"
              className="flex-1 rounded-lg bg-[#c41e5c] py-4 text-center font-bold text-white hover:brightness-110"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </SectionReveal>
    </div>
  );
}
