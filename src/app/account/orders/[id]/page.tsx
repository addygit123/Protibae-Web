import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AccountLayout } from '@/components/account/AccountLayout';
import { ArrowLeft, Package, Truck, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { ProductImage } from '@/components/shared/ProductImage';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'Order Details',
  description: 'View the details of your PROTIBAE order.',
  robots: { index: false, follow: false },
};

async function getOrder(id: string) {
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  
  const res = await fetch(`${protocol}://${host}/api/orders/${id}`, {
    headers: {
      cookie: headersList.get('cookie') || '',
    },
    cache: 'no-store'
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  return data.order;
}

export default async function OrderDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  const { id } = await props.params;
  const order = await getOrder(id);

  if (!order) {
    return (
      <AccountLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package className="w-16 h-16 text-on-surface-variant mb-4" />
          <h2 className="font-display text-headline-sm text-white mb-2">Order Not Found</h2>
          <p className="text-on-surface-variant mb-6">The order you are looking for does not exist or you do not have permission to view it.</p>
          <Link href="/account" className="text-primary hover:underline font-label-bold">
            Return to Orders
          </Link>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-outline-variant/20 pb-6">
          <Link href="/account" className="p-2 hover:bg-surface-container rounded-full transition-colors group">
            <ArrowLeft className="w-5 h-5 text-on-surface group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <h1 className="font-display text-headline-sm text-white uppercase tracking-wider">
              Order {order.orderNumber}
            </h1>
            <p className="text-sm text-on-surface-variant">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="ml-auto">
            <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wider bg-surface-container border border-outline-variant/30 text-white">
              {order.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface border border-outline-variant/10 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-outline-variant/10">
                <h2 className="font-label-bold uppercase tracking-widest text-sm text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" />
                  Order Items
                </h2>
              </div>
              <div className="divide-y divide-outline-variant/10">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {order.items.map((item: any) => (
                  <div key={item.id} className="p-6 flex gap-6 items-center">
                    <div className="w-20 h-20 bg-surface-container rounded border border-outline-variant/10 overflow-hidden relative shrink-0">
                      <ProductImage 
                        src={item.product.images[0] || '/placeholder.png'} 
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-white mb-1">{item.product.name}</h3>
                      <p className="text-sm text-on-surface-variant mb-2">Qty: {item.quantity}</p>
                      <p className="font-mono text-white">₹{item.price.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-white text-lg">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-surface-container/30 space-y-3 border-t border-outline-variant/10">
                <div className="flex justify-between text-sm text-on-surface-variant">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">₹{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-on-surface-variant">
                  <span>Shipping</span>
                  <span className="font-mono text-white">
                    {order.shipping === 0 ? 'FREE' : `₹${order.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="pt-3 border-t border-outline-variant/10 flex justify-between items-center">
                  <span className="font-label-bold tracking-widest text-white uppercase">Total</span>
                  <span className="font-mono text-xl font-bold text-primary">₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Details */}
          <div className="space-y-6">
            <div className="bg-surface border border-outline-variant/10 rounded-xl p-6">
              <h2 className="font-label-bold uppercase tracking-widest text-sm text-white flex items-center gap-2 mb-4">
                <Truck className="w-4 h-4 text-primary" />
                Shipping Address
              </h2>
              <div className="text-sm text-on-surface-variant space-y-1">
                <p className="font-bold text-white">{order.address.firstName} {order.address.lastName}</p>
                <p>{order.address.street}</p>
                <p>{order.address.city}, {order.address.zip}</p>
                <p>{order.address.phone}</p>
              </div>
            </div>

            <div className="bg-surface border border-outline-variant/10 rounded-xl p-6">
              <h2 className="font-label-bold uppercase tracking-widest text-sm text-white flex items-center gap-2 mb-4">
                <CreditCard className="w-4 h-4 text-primary" />
                Payment Status
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant capitalize">
                  {order.payment?.provider?.replace('_', ' ') || 'Checkout'}
                </span>
                <span className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded text-xs font-bold tracking-wider">
                  {order.payment?.status || 'UNKNOWN'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}
