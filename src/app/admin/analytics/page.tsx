import { prisma } from '@/lib/prisma';
import { format, subDays, startOfDay } from 'date-fns';

export default async function AdminAnalyticsPage() {
  const thirtyDaysAgo = startOfDay(subDays(new Date(), 30));

  const [
    allValidOrders,
    completedOrdersCount,
    pendingOrdersCount,
    totalUsers,
    inventoryData,
    activeProductsCount,
    rawTopSellingItems,
    last30DaysOrders
  ] = await Promise.all([
    prisma.order.findMany({
      where: { status: { notIn: ['CANCELLED', 'REFUNDED'] } },
      select: { total: true }
    }),
    prisma.order.count({
      where: { status: 'DELIVERED' }
    }),
    prisma.order.count({
      where: { status: 'PENDING' }
    }),
    prisma.user.count({
      where: { role: 'CUSTOMER' }
    }),
    prisma.product.aggregate({
      _sum: { inventory: true },
    }),
    prisma.product.count({
      where: { isActive: true }
    }),
    prisma.orderItem.groupBy({
      by: ['productId', 'packSize'],
      _sum: { quantity: true },
    }),
    prisma.order.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo },
        status: { notIn: ['CANCELLED', 'REFUNDED'] }
      },
      select: { total: true, createdAt: true }
    })
  ]);

  const totalRevenue = allValidOrders.reduce((acc, order) => acc + order.total, 0);
  const totalOrdersCount = allValidOrders.length;
  const avgOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;
  
  const lowStockCount = await prisma.product.count({
    where: { inventory: { lt: 10 } }
  });

  // Calculate Revenue Growth Data
  const dailyRevenue: Record<string, number> = {};
  for (let i = 0; i < 30; i++) {
    const day = format(subDays(new Date(), 29 - i), 'MMM dd');
    dailyRevenue[day] = 0;
  }
  
  last30DaysOrders.forEach(order => {
    const day = format(order.createdAt, 'MMM dd');
    if (dailyRevenue[day] !== undefined) {
      dailyRevenue[day] += order.total;
    }
  });

  const dailyRevenueEntries = Object.entries(dailyRevenue);
  const maxDayRevenue = Math.max(...dailyRevenueEntries.map(e => e[1]), 1); // Avoid division by zero
  const peakDayEntry = dailyRevenueEntries.reduce((max, current) => current[1] > max[1] ? current : max, dailyRevenueEntries[0]);

  // Generate SVG path points
  const points = dailyRevenueEntries.map((entry, index) => {
    const x = (index / 29) * 1000;
    const y = 300 - (entry[1] / maxDayRevenue) * 280; // leave some padding at top
    return `${x},${y}`;
  });

  const pathD = `M${points.join(' L')}`;
  const areaD = `M0,300 L${points.join(' L')} L1000,300 Z`;

  // Fetch product details for top selling
  const productTotals = new Map<string, number>();
  for (const item of rawTopSellingItems) {
    let multiplier = 1;
    if (item.packSize && item.packSize.includes('6')) {
      multiplier = 6;
    }
    const totalBars = (item._sum.quantity || 0) * multiplier;
    productTotals.set(item.productId, (productTotals.get(item.productId) || 0) + totalBars);
  }

  const sortedTopSellingItems = Array.from(productTotals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([productId, quantity]) => ({ productId, quantity }));

  const topProducts = await Promise.all(sortedTopSellingItems.map(async (item) => {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    return {
      name: product?.name || 'Unknown Product',
      quantity: item.quantity,
    };
  }));

  const maxTopSellingQty = topProducts.length > 0 ? Math.max(...topProducts.map(p => p.quantity)) : 1;

  const kpis = [
    { title: 'Total Revenue', value: `₹${Math.round(totalRevenue).toLocaleString('en-IN')}`, icon: 'payments' },
    { title: 'Total Orders', value: totalOrdersCount, icon: 'shopping_cart' },
    { title: 'Customers', value: totalUsers, icon: 'group' },
    { title: 'Avg Order Value', value: `₹${Math.round(avgOrderValue).toLocaleString('en-IN')}`, icon: 'shopping_bag' },
    { title: 'Pending Orders', value: pendingOrdersCount, icon: 'pending_actions' },
    { title: 'Completed Orders', value: completedOrdersCount, icon: 'local_shipping' },
    { title: 'Low Stock Products', value: lowStockCount, icon: 'warning' },
    { title: 'Active Products', value: activeProductsCount, icon: 'inventory_2' },
  ];

  return (
    <>
      <section className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display-hero text-headline-lg text-[#e3e2e7] leading-none">Analytics Dashboard</h2>
          <p className="text-[#e1bec3] font-body mt-2">Real-time store performance data.</p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-[#1a1b1f]/60 backdrop-blur-md border border-white/5 p-6 rounded-xl group hover:border-[#ffb1c1]/30 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[#e1bec3] font-label-bold text-xs uppercase tracking-widest">{kpi.title}</span>
              <span className="text-[#ffb1c1] material-symbols-outlined text-xl">{kpi.icon}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display-hero text-headline-md text-[#e3e2e7]">{kpi.value}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Main Chart Section: Revenue */}
      <section className="bg-[#1a1b1f]/60 backdrop-blur-md border border-white/5 p-8 rounded-xl mb-8 relative overflow-hidden">
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div>
            <h3 className="font-display-hero text-headline-md text-[#e3e2e7]">Revenue Growth</h3>
            <p className="text-[#e1bec3] font-label-bold text-xs uppercase tracking-widest">Last 30 Days (Actual Orders)</p>
          </div>
        </div>
        
        {totalOrdersCount > 0 ? (
          <div className="h-80 w-full relative flex items-end justify-between gap-1">
            <div className="absolute inset-0 flex items-end">
              <svg className="w-full h-full drop-shadow-[0_0_8px_rgba(196,30,92,0.4)]" preserveAspectRatio="none" viewBox="0 0 1000 300">
                <defs>
                  <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#C41E5C" stopOpacity="0.2"></stop>
                    <stop offset="100%" stopColor="#C41E5C" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
                <path d={areaD} fill="url(#areaGradient)"></path>
                <path d={pathD} fill="none" stroke="#C41E5C" strokeLinecap="round" strokeWidth="4"></path>
              </svg>
              {/* Floating Data Label */}
              <div className="absolute top-[10%] left-[65%] bg-[#1a1b1f]/60 backdrop-blur-md p-3 rounded-lg border border-[#ffb1c1]/50 translate-x-1/2 z-20">
                <p className="text-[10px] text-[#ffb1c1] font-bold uppercase tracking-widest">Peak Day</p>
                <p className="font-display-hero text-2xl leading-none text-[#e3e2e7]">₹{Math.round(peakDayEntry[1]).toLocaleString('en-IN')}</p>
                <p className="text-[10px] text-[#e1bec3]">{peakDayEntry[0]}</p>
              </div>
            </div>
            {/* X-Axis Labels (Show 5 evenly spaced) */}
            <div className="absolute bottom-0 w-full flex justify-between px-2 pt-4 border-t border-[#343539] z-10">
              {[0, 7, 14, 21, 29].map(dayIndex => (
                <span key={dayIndex} className="text-[10px] text-[#e1bec3] font-label-bold uppercase">
                  {dailyRevenueEntries[dayIndex][0]}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-40 w-full flex items-center justify-center">
            <p className="text-[#e1bec3] font-label-bold">No data available</p>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Selling Products */}
        <section className="bg-[#1a1b1f]/60 backdrop-blur-md border border-white/5 p-8 rounded-xl">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="font-display-hero text-headline-md text-[#e3e2e7]">Top Selling Products</h3>
              <p className="text-[#e1bec3] font-label-bold text-xs uppercase tracking-widest">By Quantity Sold</p>
            </div>
            <span className="material-symbols-outlined text-[#e1bec3]">bar_chart</span>
          </div>
          <div className="space-y-6">
            {topProducts.length > 0 ? topProducts.map((p, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-xs font-label-bold uppercase tracking-wider text-[#e3e2e7]">
                  <span>{p.name}</span>
                  <span className="text-[#ffb1c1]">{p.quantity} Units</span>
                </div>
                <div className="h-3 bg-[#1a1b1f] rounded-full overflow-hidden">
                  <div className="h-full bg-[#ffb1c1] drop-shadow-[0_0_8px_rgba(196,30,92,0.4)]" style={{ width: `${(p.quantity / maxTopSellingQty) * 100}%` }}></div>
                </div>
              </div>
            )) : (
              <p className="text-[#e1bec3] font-label-bold">No data available</p>
            )}
          </div>
        </section>

        {/* Inventory Snapshot */}
        <section className="bg-[#1a1b1f]/60 backdrop-blur-md border border-white/5 p-8 rounded-xl flex flex-col justify-center">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="font-display-hero text-headline-md text-[#e3e2e7]">Current Inventory Snapshot</h3>
              <p className="text-[#e1bec3] font-label-bold text-xs uppercase tracking-widest">Real-time stock level</p>
            </div>
            <span className="material-symbols-outlined text-[#e1bec3]">inventory</span>
          </div>
          
          <div className="mt-6 pt-6 border-t border-[#343539] flex justify-between">
            <div>
              <p className="text-[10px] text-[#e1bec3] uppercase tracking-widest font-bold">Total Items In Stock</p>
              <p className="font-display-hero text-4xl text-[#e3e2e7] mt-2">
                {inventoryData._sum.inventory || 0}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-[#e1bec3] uppercase tracking-widest font-bold">Low Stock Products</p>
              <p className="font-display-hero text-4xl text-[#ffb1c1] mt-2">
                {lowStockCount}
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
