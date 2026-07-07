import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { PrintButton } from '@/components/admin/PrintButton';

export default async function AdminOrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      address: true,
      payment: true,
      items: {
        include: {
          product: true
        }
      }
    }
  });

  if (!order) {
    notFound();
  }

  // Payment Status styling
  let paymentStatusColor = 'text-yellow-400';
  if (order.payment?.status === 'SUCCESS') paymentStatusColor = 'text-green-400';
  else if (order.payment?.status === 'FAILED') paymentStatusColor = 'text-red-400';

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Link href="/admin/orders" className="text-[#ffb1c1] hover:underline flex items-center gap-1 font-label-bold text-[14px] mb-4">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Orders
          </Link>
          <h3 className="font-display-hero text-headline-md tracking-tight text-[#e3e2e7]">Order Details</h3>
        </div>
      </div>

      <div className="flex-1 w-full max-w-[800px] bg-[#1a1b1f]/70 backdrop-blur-md border border-[#343539] shadow-2xl rounded-xl flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b border-[#343539] flex justify-between items-center bg-[#0d0e12]/50 rounded-t-xl">
          <div>
            <span className="font-label-bold text-[14px] text-[#ffb1c1] uppercase tracking-[0.2em] mb-1 block">Order Details</span>
            <h2 className="font-display-hero text-[32px] text-[#e3e2e7]">#{order.orderNumber}</h2>
          </div>
          <Link href="/admin/orders" className="w-10 h-10 rounded-full border border-[#594045] flex items-center justify-center hover:bg-[#1e1f23] transition-all group">
            <span className="material-symbols-outlined text-[#e1bec3] group-hover:text-[#e3e2e7]">close</span>
          </Link>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-10">
          
          {/* Customer Summary Section */}
          <section>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded bg-[#c41e5c]/20 flex items-center justify-center text-[#ffb1c1] border border-[#c41e5c]/40">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
              </div>
              <div>
                <h4 className="font-label-bold text-[14px] uppercase tracking-widest text-[#e1bec3] mb-1">Customer Details</h4>
                <p className="font-body text-[18px] text-[#e3e2e7]">{order.user.name}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 bg-[#1a1b1f] p-5 rounded border border-[#343539]/50">
              <div>
                <label className="block font-label-bold text-[12px] uppercase tracking-tighter text-[#e1bec3] mb-1">Email</label>
                <p className="font-body text-[16px] text-[#e3e2e7]">{order.user.email}</p>
              </div>
              <div>
                <label className="block font-label-bold text-[12px] uppercase tracking-tighter text-[#e1bec3] mb-1">Phone</label>
                <p className="font-body text-[16px] text-[#e3e2e7]">{order.address.phone || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <label className="block font-label-bold text-[12px] uppercase tracking-tighter text-[#e1bec3] mb-1">Shipping Address</label>
                <p className="font-body text-[16px] text-[#e3e2e7]">
                  {order.address.firstName} {order.address.lastName}<br />
                  {order.address.street}<br />
                  {order.address.city}, {order.address.state} {order.address.zip}<br />
                  {order.address.country}
                </p>
              </div>
            </div>
          </section>

          {/* Payment Info Section */}
          <section>
            <h4 className="font-label-bold text-[14px] uppercase tracking-widest text-[#e1bec3] mb-4">Payment & Logistics</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-[#343539] rounded">
                <div className="flex items-center gap-3 text-[#e3e2e7]">
                  <span className="material-symbols-outlined text-[#ffb1c1]">credit_card</span>
                  <span className="font-body text-[16px]">Paid via {order.payment?.provider || 'Unknown'}</span>
                </div>
                <span className={`font-label-bold text-[14px] ${paymentStatusColor}`}>
                  {order.payment?.status || 'PENDING'}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 border border-[#343539] rounded">
                <div className="flex items-center gap-3 text-[#e3e2e7]">
                  <span className="material-symbols-outlined text-[#e1bec3]">local_shipping</span>
                  <span className="font-body text-[16px]">Standard Shipping</span>
                </div>
                <span className="text-[#e1bec3] font-label-bold text-[14px]">₹{order.shipping.toFixed(2)}</span>
              </div>
            </div>
          </section>

          {/* Products List Section */}
          <section>
            <h4 className="font-label-bold text-[14px] uppercase tracking-widest text-[#e1bec3] mb-4">Products Ordered</h4>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center group">
                  <div className="w-16 h-16 bg-[#292a2e] rounded flex-shrink-0 border border-[#343539] overflow-hidden">
                    {item.product.images[0] && (
                      <Image 
                        src={item.product.images[0]} 
                        alt={item.product.name}
                        width={64} 
                        height={64}
                        className="w-full h-full object-cover" 
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h5 className="font-label-bold text-[16px] text-[#e3e2e7] group-hover:text-[#ffb1c1] transition-colors">
                        {item.product.name} {item.packSize && `- Pack of ${item.packSize}`}
                      </h5>
                      <p className="font-label-bold text-[#e3e2e7]">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <p className="text-[#e1bec3] text-[12px]">Qty: {item.quantity} units (₹{item.price.toFixed(2)} each)</p>
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t border-[#343539] flex justify-between items-center">
                <span className="font-label-bold text-[14px] uppercase tracking-widest text-[#e1bec3]">Total Value</span>
                <span className="font-display-hero text-[32px] text-[#ffb1c1]">₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </section>

          {/* Order Timeline Section */}
          <section>
            <h4 className="font-label-bold text-[14px] uppercase tracking-widest text-[#e1bec3] mb-6">Order Timeline</h4>
            <div className="relative pl-8 space-y-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#343539]">
              {order.status === 'DELIVERED' && (
                <div className="relative">
                  <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-[#c41e5c] flex items-center justify-center ring-4 ring-[#121317] z-10 shadow-[0_0_10px_rgba(196,30,92,0.4)]">
                    <span className="material-symbols-outlined text-[14px] text-white font-bold">check</span>
                  </div>
                  <div>
                    <h5 className="font-label-bold text-[#e3e2e7]">Order Delivered</h5>
                    <p className="text-[12px] text-[#e1bec3]">{new Date(order.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              )}
              
              {(order.status === 'SHIPPED' || order.status === 'DELIVERED') && (
                <div className="relative">
                  <div className={`absolute -left-8 top-1 w-6 h-6 rounded-full ${order.status === 'SHIPPED' ? 'bg-[#c41e5c] shadow-[0_0_10px_rgba(196,30,92,0.4)]' : 'bg-[#343539]'} flex items-center justify-center ring-4 ring-[#121317] z-10`}>
                    <span className="material-symbols-outlined text-[14px] text-white font-bold">check</span>
                  </div>
                  <div>
                    <h5 className="font-label-bold text-[#e3e2e7]">Shipped</h5>
                  </div>
                </div>
              )}

              {(order.status === 'PROCESSING' || order.status === 'SHIPPED' || order.status === 'DELIVERED') && (
                <div className="relative">
                  <div className={`absolute -left-8 top-1 w-6 h-6 rounded-full ${order.status === 'PROCESSING' ? 'bg-[#c41e5c] shadow-[0_0_10px_rgba(196,30,92,0.4)]' : 'bg-[#343539]'} flex items-center justify-center ring-4 ring-[#121317] z-10`}>
                    <span className="material-symbols-outlined text-[14px] text-white font-bold">check</span>
                  </div>
                  <div>
                    <h5 className="font-label-bold text-[#e3e2e7]">Processing at Warehouse</h5>
                  </div>
                </div>
              )}

              {order.status === 'CANCELLED' && (
                <div className="relative">
                  <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center ring-4 ring-[#121317] z-10 shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                    <span className="material-symbols-outlined text-[14px] text-white font-bold">close</span>
                  </div>
                  <div>
                    <h5 className="font-label-bold text-[#e3e2e7]">Order Cancelled</h5>
                    <p className="text-[12px] text-[#e1bec3]">{new Date(order.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              )}

              <div className="relative">
                <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-[#343539] flex items-center justify-center ring-4 ring-[#121317] z-10">
                  <span className="material-symbols-outlined text-[14px] text-white font-bold">check</span>
                </div>
                <div>
                  <h5 className="font-label-bold text-[#e3e2e7]">Order Received</h5>
                  <p className="text-[12px] text-[#e1bec3]">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Drawer Footer */}
        <div className="p-6 border-t border-[#343539] grid grid-cols-2 gap-4 bg-[#0d0e12]/80 backdrop-blur-sm rounded-b-xl">
          <PrintButton orderId={order.id} />
          
          <form className="w-full flex items-center gap-2" action={async (formData) => {
            'use server';
            const newStatus = formData.get('status') as string;
            if (newStatus && ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'].includes(newStatus)) {
              await prisma.order.update({
                where: { id: order.id },
                data: { status: newStatus as import('@prisma/client').OrderStatus }
              });
              revalidatePath(`/admin/orders/${order.id}`);
            }
          }}>
            <select 
              name="status" 
              defaultValue={order.status}
              className="flex-1 h-full min-h-[52px] bg-[#1a1b1f] border-2 border-[#343539] text-[#e3e2e7] px-4 rounded font-label-bold focus:ring-[#ffb1c1]"
            >
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <button className="h-full min-h-[52px] flex items-center justify-center px-6 bg-[#c41e5c] text-white font-label-bold text-[14px] uppercase tracking-widest hover:brightness-110 shadow-[0_0_20px_rgba(196,30,92,0.3)] transition-all rounded">
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
