import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // Fetch real data
  const [
    totalUsers,
    activeOrdersCount,
    revenueResult,
    recentOrders,
    products
  ] = await Promise.all([
    prisma.user.count(),
    prisma.order.count({
      where: { status: { in: ['PENDING', 'PROCESSING'] } }
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: 'CANCELLED' } }
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, image: true, email: true } },
      }
    }),
    prisma.product.findMany({
      select: { inventory: true }
    })
  ]);

  const totalRevenue = revenueResult._sum.total || 0;
  
  // Inventory logic: percentage of items that have stock > 0
  const productsWithStock = products.filter(p => p.inventory > 0).length;
  const inventoryHealth = products.length > 0 
    ? Math.round((productsWithStock / products.length) * 100) 
    : 0;

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h2 className="font-display-hero text-headline-md text-white uppercase tracking-tight">Overview Dashboard</h2>
        <p className="font-body-md text-[#e1bec3] max-w-2xl mt-2">Real-time performance metrics for PRO-FUEL performance snacks. Tracking momentum and gourmet fuel logistics.</p>
      </div>

      {/* KPI Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Revenue */}
        <div className="bg-[#292a2e] border border-[#343539] hover:border-[#c41e5c] transition-all p-6 flex flex-col justify-between h-40 rounded-xl">
          <div className="flex justify-between items-start">
            <span className="font-label-bold text-label-bold text-[#e1bec3] opacity-60 uppercase tracking-widest">Total Revenue</span>
            <span className="text-[#c41e5c] drop-shadow-[0_0_10px_rgba(196,30,92,0.4)]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </span>
          </div>
          <div className="mt-4">
            <div className="font-display-hero text-[36px] text-white">₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            <div className="flex items-center gap-1 text-[#c41e5c] text-[12px] font-bold mt-1">
              +12.5% vs last month
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-[#292a2e] border border-[#343539] hover:border-[#c41e5c] transition-all p-6 flex flex-col justify-between h-40 rounded-xl">
          <div className="flex justify-between items-start">
            <span className="font-label-bold text-label-bold text-[#e1bec3] opacity-60 uppercase tracking-widest">Active Orders</span>
            <span className="text-[#c41e5c] drop-shadow-[0_0_10px_rgba(196,30,92,0.4)]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            </span>
          </div>
          <div className="mt-4">
            <div className="font-display-hero text-[36px] text-white">{activeOrdersCount}</div>
            <div className="flex items-center gap-1 text-[#c41e5c] text-[12px] font-bold mt-1">
              +8.2% vs last month
            </div>
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-[#292a2e] border border-[#343539] hover:border-[#c41e5c] transition-all p-6 flex flex-col justify-between h-40 rounded-xl">
          <div className="flex justify-between items-start">
            <span className="font-label-bold text-label-bold text-[#e1bec3] opacity-60 uppercase tracking-widest">Inventory Fuel</span>
            <span className="text-[#c41e5c] drop-shadow-[0_0_10px_rgba(196,30,92,0.4)]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            </span>
          </div>
          <div className="mt-4">
            <div className="font-display-hero text-[36px] text-white">{inventoryHealth}%</div>
            <div className="flex items-center gap-1 text-[#e1bec3] text-[12px] font-bold mt-1">
              Healthy Stock Levels
            </div>
          </div>
        </div>

        {/* Customers */}
        <div className="bg-[#292a2e] border border-[#343539] hover:border-[#c41e5c] transition-all p-6 flex flex-col justify-between h-40 rounded-xl">
          <div className="flex justify-between items-start">
            <span className="font-label-bold text-label-bold text-[#e1bec3] opacity-60 uppercase tracking-widest">Athletes Joined</span>
            <span className="text-[#c41e5c] drop-shadow-[0_0_10px_rgba(196,30,92,0.4)]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </span>
          </div>
          <div className="mt-4">
            <div className="font-display-hero text-[36px] text-white">{totalUsers}</div>
            <div className="flex items-center gap-1 text-[#c41e5c] text-[12px] font-bold mt-1">
              +24.1% user growth
            </div>
          </div>
        </div>
      </section>

      {/* Recent Orders Table */}
      <section className="bg-[#292a2e] border border-[#343539] rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-[#343539] flex justify-between items-center bg-[#1a1b1f]/50">
          <h3 className="font-display-hero text-headline-md text-white uppercase">Recent Orders</h3>
          <Link href="/admin/orders" className="text-[#c41e5c] font-label-bold text-label-bold flex items-center gap-1 hover:underline">
            View All
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#1e1f23] text-[#e1bec3] font-label-bold text-label-bold border-b border-[#343539]">
                <th className="px-6 py-4 uppercase tracking-wider text-xs">Order #</th>
                <th className="px-6 py-4 uppercase tracking-wider text-xs">Customer</th>
                <th className="px-6 py-4 uppercase tracking-wider text-xs">Amount</th>
                <th className="px-6 py-4 uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-4 uppercase tracking-wider text-xs">Date</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#343539] font-body-md text-white">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#c41e5c]/5 transition-colors">
                  <td className="px-6 py-5 font-bold">#{order.id.slice(-6).toUpperCase()}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1a1b1f] border border-[#594045] overflow-hidden flex items-center justify-center">
                        {order.user.image ? (
                          <Image src={order.user.image} alt={order.user.name || ''} width={32} height={32} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs font-bold">{order.user.name?.charAt(0) || order.user.email?.charAt(0)}</span>
                        )}
                      </div>
                      <span>{order.user.name || order.user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-bold">₹{order.total.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-1 text-[11px] font-bold uppercase rounded-full ${
                      order.status === 'DELIVERED' ? 'bg-green-500/20 text-green-400' :
                      order.status === 'PENDING' ? 'bg-[#343539] text-[#e3e2e7]' :
                      order.status === 'CANCELLED' ? 'bg-red-500/20 text-red-400' :
                      'bg-[#c41e5c]/20 text-[#ffb1c1]'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-[#e1bec3] text-sm">
                    {order.createdAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Link href={`/admin/orders/${order.id}`} className="p-2 text-[#e1bec3] hover:text-[#c41e5c] hover:bg-[#c41e5c]/10 rounded-full transition-colors inline-block">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                    </Link>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-[#e1bec3]">
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}