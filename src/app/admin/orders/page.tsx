import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam) || 1;
  const take = 10;
  const skip = (page - 1) * take;

  const [orders, totalOrders, recentOrdersCount, allOrders] = await Promise.all([
    prisma.order.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        items: true,
        payment: true,
      },
    }),
    prisma.order.count(),
    prisma.order.count({
      where: {
        createdAt: {
          // eslint-disable-next-line react-hooks/purity
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    }),
    prisma.order.findMany({
      select: { total: true },
      where: { status: { notIn: ['CANCELLED', 'REFUNDED'] } }
    })
  ]);

  const totalPages = Math.ceil(totalOrders / take);
  const avgOrderValue = allOrders.length > 0 
    ? allOrders.reduce((acc, order) => acc + order.total, 0) / allOrders.length 
    : 0;

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h2 className="font-display-hero text-headline-lg text-[#e3e2e7] leading-none mb-2">ORDERS</h2>
          <p className="font-body text-[#e1bec3] opacity-80">Track and manage your customer fulfillment pipeline.</p>
        </div>
        <button className="px-8 py-3 bg-[#c41e5c] text-white font-label-bold rounded shadow-lg drop-shadow-[0_0_8px_rgba(196,30,92,0.4)] flex items-center gap-2 hover:scale-[1.02] transition-transform uppercase tracking-widest">
          <span className="material-symbols-outlined text-[20px]">download</span>
          Export
        </button>
      </div>

      {/* Filters Bento-ish Bar */}
      <div className="bg-[#1a1b1f] p-6 rounded-xl border border-[#343539] mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="flex flex-col gap-2">
          <label className="font-label-bold text-[12px] text-[#e1bec3] uppercase tracking-wider">Status</label>
          <select className="bg-[#292a2e] border-none rounded text-body-md text-[#e3e2e7] focus:ring-1 focus:ring-[#ffb1c1] h-12">
            <option>All Statuses</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-label-bold text-[12px] text-[#e1bec3] uppercase tracking-wider">Payment</label>
          <select className="bg-[#292a2e] border-none rounded text-body-md text-[#e3e2e7] focus:ring-1 focus:ring-[#ffb1c1] h-12">
            <option>Any Payment</option>
            <option>Pending</option>
            <option>Success</option>
            <option>Failed</option>
            <option>Refunded</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-label-bold text-[12px] text-[#e1bec3] uppercase tracking-wider">Date Range</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#e1bec3] text-[18px]">calendar_today</span>
            <input className="w-full bg-[#292a2e] border-none rounded pl-10 pr-4 h-12 text-body-md text-[#e3e2e7] focus:ring-1 focus:ring-[#ffb1c1]" type="text" defaultValue="Oct 01 - Oct 31, 2023" />
          </div>
        </div>
        <div className="flex items-center justify-end">
          <button className="h-12 px-6 border-2 border-[#c41e5c] text-[#ffb1c1] font-label-bold rounded hover:bg-[#c41e5c]/10 transition-colors uppercase">
            Clear Filters
          </button>
        </div>
      </div>

      {/* Data Table Surface */}
      <div className="bg-[#1a1b1f] rounded-xl border border-[#343539] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#292a2e]/50 border-b border-[#343539]">
                <th className="px-6 py-4 font-label-bold text-[12px] text-[#e1bec3] uppercase tracking-widest">Order #</th>
                <th className="px-6 py-4 font-label-bold text-[12px] text-[#e1bec3] uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 font-label-bold text-[12px] text-[#e1bec3] uppercase tracking-widest">Items</th>
                <th className="px-6 py-4 font-label-bold text-[12px] text-[#e1bec3] uppercase tracking-widest">Total</th>
                <th className="px-6 py-4 font-label-bold text-[12px] text-[#e1bec3] uppercase tracking-widest">Payment</th>
                <th className="px-6 py-4 font-label-bold text-[12px] text-[#e1bec3] uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 font-label-bold text-[12px] text-[#e1bec3] uppercase tracking-widest">Created</th>
                <th className="px-6 py-4 font-label-bold text-[12px] text-[#e1bec3] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#343539]">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-[#e1bec3]">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const itemCount = order.items.reduce((acc, item) => acc + item.quantity, 0);
                  
                  // Payment Status styling
                  let paymentStatusColor = 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
                  if (order.payment?.status === 'SUCCESS') paymentStatusColor = 'bg-green-500/10 text-green-400 border-green-500/20';
                  else if (order.payment?.status === 'FAILED') paymentStatusColor = 'bg-red-500/10 text-red-400 border-red-500/20';
                  else if (order.payment?.status === 'REFUNDED') paymentStatusColor = 'bg-purple-500/10 text-purple-400 border-purple-500/20';

                  // Order Status styling
                  let statusBg = 'bg-[#343539]';
                  let statusText = 'text-[#e1bec3]';
                  let statusIcon = 'pending';
                  
                  if (order.status === 'DELIVERED') {
                    statusBg = 'bg-[#c41e5c]';
                    statusText = 'text-white';
                    statusIcon = 'check_circle';
                  } else if (order.status === 'SHIPPED') {
                    statusBg = 'bg-blue-500';
                    statusText = 'text-white';
                    statusIcon = 'local_shipping';
                  } else if (order.status === 'PROCESSING') {
                    statusBg = 'bg-[#ffb1c1]/20';
                    statusText = 'text-[#ffb1c1]';
                    statusIcon = 'autorenew';
                  } else if (order.status === 'CANCELLED' || order.status === 'REFUNDED') {
                    statusBg = 'bg-red-500';
                    statusText = 'text-white';
                    statusIcon = 'cancel';
                  }
                  
                  return (
                    <tr key={order.id} className="hover:bg-[#343539]/20 transition-colors group">
                      <td className="px-6 py-5 font-label-bold text-[#ffb1c1]">#{order.orderNumber}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-[#292a2e] border border-[#594045] flex items-center justify-center font-bold text-[#ffb1c1]">
                            {order.user.name?.charAt(0) || 'U'}
                          </div>
                          <span className="font-body font-bold text-[#e3e2e7]">{order.user.name || 'Unknown User'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-[#e1bec3] text-body-md">{itemCount} items</td>
                      <td className="px-6 py-5 font-label-bold text-[#e3e2e7]">₹{order.total}</td>
                      <td className="px-6 py-5">
                        <span className={`px-2 py-1 rounded text-[12px] font-bold border uppercase tracking-tighter ${paymentStatusColor}`}>
                          {order.payment?.status || 'PENDING'}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-full ${statusBg} ${statusText} text-[12px] font-bold uppercase tracking-widest flex items-center w-fit gap-1 shadow-sm`}>
                          <span className="material-symbols-outlined text-[14px]">{statusIcon}</span>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-[#e1bec3] text-[12px]">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <Link href={`/admin/orders/${order.id}`} className="p-2 text-[#e1bec3] hover:text-[#ffb1c1] hover:bg-[#ffb1c1]/10 rounded transition-all inline-block">
                          <span className="material-symbols-outlined">visibility</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-[#343539] flex items-center justify-between bg-[#1a1b1f]">
          <span className="font-body text-[#e1bec3] opacity-70">
            Showing {Math.min(skip + 1, totalOrders)} to {Math.min(skip + take, totalOrders)} of {totalOrders} orders
          </span>
          <div className="flex items-center gap-2">
            <Link 
              href={page > 1 ? `/admin/orders?page=${page - 1}` : '#'}
              className={`p-2 border border-[#343539] rounded text-[#e1bec3] hover:text-[#ffb1c1] hover:border-[#ffb1c1] transition-all ${page <= 1 ? 'opacity-30 pointer-events-none' : ''}`}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </Link>
            <div className="flex gap-1">
              <button className="w-8 h-8 rounded bg-[#c41e5c] text-white font-label-bold">{page}</button>
            </div>
            <Link 
              href={page < totalPages ? `/admin/orders?page=${page + 1}` : '#'}
              className={`p-2 border border-[#343539] rounded text-[#e1bec3] hover:text-[#ffb1c1] hover:border-[#ffb1c1] transition-all ${page >= totalPages ? 'opacity-30 pointer-events-none' : ''}`}
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Dynamic Insights Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1a1b1f] p-6 rounded-xl border border-[#343539] relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-[120px]">trending_up</span>
          </div>
          <h4 className="font-label-bold text-[12px] text-[#e1bec3] uppercase tracking-widest mb-4">Daily Velocity</h4>
          <div className="flex items-baseline gap-2">
            <span className="font-display-hero text-headline-md text-[#e3e2e7]">{recentOrdersCount}</span>
            <span className="font-label-bold text-[12px] text-green-400 flex items-center">Real-time</span>
          </div>
          <p className="font-body text-[#e1bec3] opacity-60 mt-2">Orders processed in last 24h</p>
        </div>
        
        <div className="bg-[#1a1b1f] p-6 rounded-xl border border-[#343539] relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-[120px]">payments</span>
          </div>
          <h4 className="font-label-bold text-[12px] text-[#e1bec3] uppercase tracking-widest mb-4">Avg. Order Value</h4>
          <div className="flex items-baseline gap-2">
            <span className="font-display-hero text-headline-md text-[#e3e2e7]">₹{Math.round(avgOrderValue).toLocaleString('en-IN')}</span>
          </div>
          <p className="font-body text-[#e1bec3] opacity-60 mt-2">Overall historical average</p>
        </div>
        
        <div className="bg-[#1a1b1f] p-6 rounded-xl border border-[#343539] relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-[120px]">timer</span>
          </div>
          <h4 className="font-label-bold text-[12px] text-[#e1bec3] uppercase tracking-widest mb-4">Fulfillment Time</h4>
          <div className="flex items-baseline gap-2">
            <span className="font-display-hero text-headline-md text-[#e3e2e7]">2.4 Days</span>
            <span className="font-label-bold text-[12px] text-green-400 flex items-center">Healthy</span>
          </div>
          <p className="font-body text-[#e1bec3] opacity-60 mt-2">Avg. time to ship orders</p>
        </div>
      </div>
    </>
  );
}
