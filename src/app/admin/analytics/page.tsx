import { prisma } from '@/lib/prisma';

export default async function AdminAnalyticsPage() {
  const [
    allValidOrders,
    fulfilledOrdersCount,
    usersWithMultipleOrders,
    totalUsers
  ] = await Promise.all([
    prisma.order.findMany({
      where: { status: { notIn: ['CANCELLED', 'REFUNDED'] } },
      select: { total: true }
    }),
    prisma.order.count({
      where: { status: 'DELIVERED' }
    }),
    prisma.user.count({
      where: {
        orders: {
          some: {}
        }
      }
    }),
    prisma.user.count()
  ]);

  const totalRevenue = allValidOrders.reduce((acc, order) => acc + order.total, 0);
  const avgOrderValue = allValidOrders.length > 0 ? totalRevenue / allValidOrders.length : 0;
  
  // Real retention logic requires raw query or grouping, simplified here for demo
  const customerRetention = totalUsers > 0 ? (usersWithMultipleOrders / totalUsers) * 100 : 0;

  return (
    <>
      {/* Dashboard Header */}
      <section className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display-hero text-headline-lg text-[#e3e2e7] leading-none">Performance deep dive</h2>
          <p className="text-[#e1bec3] font-body mt-2">Real-time data synchronization with global distribution centers.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-[#1a1b1f] rounded p-1">
            <button className="px-4 py-1.5 text-[12px] font-label-bold bg-[#292a2e] text-[#e3e2e7] rounded shadow-sm">Last 30 Days</button>
            <button className="px-4 py-1.5 text-[12px] font-label-bold text-[#e1bec3] hover:text-[#e3e2e7] transition-colors">Quarterly</button>
            <button className="px-4 py-1.5 text-[12px] font-label-bold text-[#e1bec3] hover:text-[#e3e2e7] transition-colors">Yearly</button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#343539] text-[12px] font-label-bold hover:bg-[#1a1b1f] transition-colors rounded text-[#e3e2e7]">
            <span className="material-symbols-outlined text-sm">download</span> Export
          </button>
        </div>
      </section>

      {/* KPI Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#1a1b1f]/60 backdrop-blur-md border border-white/5 p-6 rounded-xl group hover:border-[#ffb1c1]/30 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[#e1bec3] font-label-bold text-xs uppercase tracking-widest">Total Revenue</span>
            <span className="text-[#ffb1c1] material-symbols-outlined text-xl">payments</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display-hero text-headline-md text-[#e3e2e7]">₹{Math.round(totalRevenue).toLocaleString('en-IN')}</span>
            <span className="text-emerald-400 text-xs font-bold flex items-center">+12.4%</span>
          </div>
          <div className="mt-4 w-full h-1 bg-[#343539] rounded-full overflow-hidden">
            <div className="h-full bg-[#ffb1c1] w-[72%] drop-shadow-[0_0_8px_rgba(196,30,92,0.5)]"></div>
          </div>
        </div>

        <div className="bg-[#1a1b1f]/60 backdrop-blur-md border border-white/5 p-6 rounded-xl group hover:border-[#ffb1c1]/30 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[#e1bec3] font-label-bold text-xs uppercase tracking-widest">Orders Fulfilled</span>
            <span className="text-[#ffb1c1] material-symbols-outlined text-xl">local_shipping</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display-hero text-headline-md text-[#e3e2e7]">{fulfilledOrdersCount}</span>
            <span className="text-emerald-400 text-xs font-bold flex items-center">+8.1%</span>
          </div>
          <div className="mt-4 w-full h-1 bg-[#343539] rounded-full overflow-hidden">
            <div className="h-full bg-[#ffb1c1] w-[55%] drop-shadow-[0_0_8px_rgba(196,30,92,0.5)]"></div>
          </div>
        </div>

        <div className="bg-[#1a1b1f]/60 backdrop-blur-md border border-white/5 p-6 rounded-xl group hover:border-[#ffb1c1]/30 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[#e1bec3] font-label-bold text-xs uppercase tracking-widest">Avg Order Value</span>
            <span className="text-[#ffb1c1] material-symbols-outlined text-xl">shopping_bag</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display-hero text-headline-md text-[#e3e2e7]">₹{Math.round(avgOrderValue).toLocaleString('en-IN')}</span>
            <span className="text-rose-400 text-xs font-bold flex items-center">-2.3%</span>
          </div>
          <div className="mt-4 w-full h-1 bg-[#343539] rounded-full overflow-hidden">
            <div className="h-full bg-[#ffb1c1] w-[88%] drop-shadow-[0_0_8px_rgba(196,30,92,0.5)]"></div>
          </div>
        </div>

        <div className="bg-[#1a1b1f]/60 backdrop-blur-md border border-white/5 p-6 rounded-xl group hover:border-[#ffb1c1]/30 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[#e1bec3] font-label-bold text-xs uppercase tracking-widest">Customer Retention</span>
            <span className="text-[#ffb1c1] material-symbols-outlined text-xl">sync</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display-hero text-headline-md text-[#e3e2e7]">{customerRetention.toFixed(1)}%</span>
            <span className="text-emerald-400 text-xs font-bold flex items-center">+5.2%</span>
          </div>
          <div className="mt-4 w-full h-1 bg-[#343539] rounded-full overflow-hidden">
            <div className="h-full bg-[#ffb1c1] w-[64%] drop-shadow-[0_0_8px_rgba(196,30,92,0.5)]"></div>
          </div>
        </div>
      </section>

      {/* Main Chart Section: Revenue */}
      <section className="bg-[#1a1b1f]/60 backdrop-blur-md border border-white/5 p-8 rounded-xl mb-8 relative overflow-hidden">
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div>
            <h3 className="font-display-hero text-headline-md text-[#e3e2e7]">Revenue Growth</h3>
            <p className="text-[#e1bec3] font-label-bold text-xs uppercase tracking-widest">Daily breakdown vs previous period</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ffb1c1]"></span>
              <span className="text-xs text-[#e1bec3]">Current Period</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#343539]"></span>
              <span className="text-xs text-[#e1bec3]">Previous Period</span>
            </div>
          </div>
        </div>
        <div className="h-80 w-full relative flex items-end justify-between gap-1">
          {/* SVG Line Chart Overlay Simulation */}
          <div className="absolute inset-0 flex items-end">
            <svg className="w-full h-full drop-shadow-[0_0_8px_rgba(196,30,92,0.4)]" preserveAspectRatio="none" viewBox="0 0 1000 300">
              <defs>
                <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#C41E5C" stopOpacity="0.2"></stop>
                  <stop offset="100%" stopColor="#C41E5C" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              <path d="M0,220 L100,240 L200,210 L300,230 L400,180 L500,200 L600,150 L700,170 L800,140 L900,160 L1000,130" fill="none" stroke="#343539" strokeDasharray="4,4" strokeWidth="2"></path>
              <path d="M0,200 L100,180 L200,220 L300,140 L400,160 L500,100 L600,120 L700,60 L800,80 L900,40 L1000,20 V300 H0 Z" fill="url(#areaGradient)"></path>
              <path d="M0,200 L100,180 L200,220 L300,140 L400,160 L500,100 L600,120 L700,60 L800,80 L900,40 L1000,20" fill="none" stroke="#C41E5C" strokeLinecap="round" strokeWidth="4"></path>
              <circle className="animate-pulse" cx="700" cy="60" fill="#C41E5C" r="6"></circle>
            </svg>
            {/* Floating Data Label */}
            <div className="absolute top-[10%] left-[65%] bg-[#1a1b1f]/60 backdrop-blur-md p-3 rounded-lg border border-[#ffb1c1]/50 translate-x-1/2">
              <p className="text-[10px] text-[#ffb1c1] font-bold uppercase tracking-widest">Peak Day</p>
              <p className="font-display-hero text-2xl leading-none text-[#e3e2e7]">₹82,400</p>
              <p className="text-[10px] text-[#e1bec3]">March 24, 2024</p>
            </div>
          </div>
          {/* X-Axis Labels */}
          <div className="absolute bottom-0 w-full flex justify-between px-2 pt-4 border-t border-[#343539]">
            <span className="text-[10px] text-[#e1bec3] font-label-bold uppercase">Mar 01</span>
            <span className="text-[10px] text-[#e1bec3] font-label-bold uppercase">Mar 08</span>
            <span className="text-[10px] text-[#e1bec3] font-label-bold uppercase">Mar 15</span>
            <span className="text-[10px] text-[#e1bec3] font-label-bold uppercase">Mar 22</span>
            <span className="text-[10px] text-[#e1bec3] font-label-bold uppercase">Mar 30</span>
          </div>
        </div>
      </section>

      {/* Lower Grid: Top Selling and Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Selling Packs Bar Chart */}
        <section className="bg-[#1a1b1f]/60 backdrop-blur-md border border-white/5 p-8 rounded-xl">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="font-display-hero text-headline-md text-[#e3e2e7]">Top Selling Products</h3>
              <p className="text-[#e1bec3] font-label-bold text-xs uppercase tracking-widest">Volume by flavor profile</p>
            </div>
            <span className="material-symbols-outlined text-[#e1bec3]">bar_chart</span>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-label-bold uppercase tracking-wider text-[#e3e2e7]">
                <span>Double Chocolate Power</span>
                <span className="text-[#ffb1c1]">842 Units</span>
              </div>
              <div className="h-3 bg-[#1a1b1f] rounded-full overflow-hidden">
                <div className="h-full bg-[#ffb1c1] drop-shadow-[0_0_8px_rgba(196,30,92,0.4)]" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-label-bold uppercase tracking-wider text-[#e3e2e7]">
                <span>Salted Caramel Surge</span>
                <span className="text-[#ffb1c1]">614 Units</span>
              </div>
              <div className="h-3 bg-[#1a1b1f] rounded-full overflow-hidden">
                <div className="h-full bg-[#ffb1c1] drop-shadow-[0_0_8px_rgba(196,30,92,0.4)]" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-label-bold uppercase tracking-wider text-[#e3e2e7]">
                <span>Wild Berry Recovery</span>
                <span className="text-[#ffb1c1]">420 Units</span>
              </div>
              <div className="h-3 bg-[#1a1b1f] rounded-full overflow-hidden">
                <div className="h-full bg-[#ffb1c1]/40" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-label-bold uppercase tracking-wider text-[#e3e2e7]">
                <span>Vanilla Bean Vitality</span>
                <span className="text-[#ffb1c1]">310 Units</span>
              </div>
              <div className="h-3 bg-[#1a1b1f] rounded-full overflow-hidden">
                <div className="h-full bg-[#ffb1c1]/40" style={{ width: '35%' }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Inventory Trend Area Chart */}
        <section className="bg-[#1a1b1f]/60 backdrop-blur-md border border-white/5 p-8 rounded-xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="font-display-hero text-headline-md text-[#e3e2e7]">Inventory Trend</h3>
              <p className="text-[#e1bec3] font-label-bold text-xs uppercase tracking-widest">Stock health & projections</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-emerald-400 font-label-bold text-xs uppercase tracking-widest">Optimized</span>
              <div className="flex items-center gap-1 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-[10px] text-[#e1bec3]">Live Sync</span>
              </div>
            </div>
          </div>
          <div className="h-56 w-full flex items-end">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 200">
              <defs>
                <linearGradient id="invGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.1"></stop>
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              <line stroke="#1e1f23" strokeWidth="1" x1="0" x2="400" y1="50" y2="50"></line>
              <line stroke="#1e1f23" strokeWidth="1" x1="0" x2="400" y1="100" y2="100"></line>
              <line stroke="#1e1f23" strokeWidth="1" x1="0" x2="400" y1="150" y2="150"></line>
              <path d="M0,120 L50,110 L100,130 L150,125 L200,90 L250,95 L300,70 L350,75 L400,60 V200 H0 Z" fill="url(#invGradient)"></path>
              <path d="M0,120 L50,110 L100,130 L150,125 L200,90 L250,95 L300,70 L350,75 L400,60" fill="none" stroke="#FFFFFF" strokeWidth="2"></path>
            </svg>
          </div>
          <div className="mt-6 pt-6 border-t border-[#343539] flex justify-between">
            <div>
              <p className="text-[10px] text-[#e1bec3] uppercase tracking-widest font-bold">In Stock</p>
              <p className="font-display-hero text-2xl text-[#e3e2e7]">4,120 <span className="text-xs text-[#e1bec3] font-body opacity-60">lbs</span></p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-[#e1bec3] uppercase tracking-widest font-bold">Next Restock</p>
              <p className="font-display-hero text-2xl text-[#ffb1c1]">02 APR</p>
            </div>
          </div>
        </section>
      </div>

      {/* Recent Activity Feed (Bento Style) */}
      <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-[#1a1b1f]/60 backdrop-blur-md border border-white/5 p-6 rounded-xl">
          <h4 className="font-display-hero text-2xl mb-6 text-[#e3e2e7]">Recent Distribution Events</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#343539] text-[#e1bec3] text-[10px] uppercase tracking-widest">
                  <th className="pb-4 font-bold">Event ID</th>
                  <th className="pb-4 font-bold">Location</th>
                  <th className="pb-4 font-bold">Volume</th>
                  <th className="pb-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm text-[#e3e2e7]">
                <tr className="border-b border-[#343539]/30">
                  <td className="py-4 font-label-bold text-[#ffb1c1]">#TRX-9412</td>
                  <td className="py-4">Berlin Hub, DE</td>
                  <td className="py-4">420 Cases</td>
                  <td className="py-4"><span className="px-2 py-0.5 rounded text-[10px] bg-emerald-400/10 text-emerald-400 font-bold tracking-widest">DISPATCHED</span></td>
                </tr>
                <tr className="border-b border-[#343539]/30">
                  <td className="py-4 font-label-bold text-[#ffb1c1]">#TRX-8241</td>
                  <td className="py-4">Austin DC, US</td>
                  <td className="py-4">1,150 Cases</td>
                  <td className="py-4"><span className="px-2 py-0.5 rounded text-[10px] bg-[#ffb1c1]/10 text-[#ffb1c1] font-bold tracking-widest">PROCESSING</span></td>
                </tr>
                <tr>
                  <td className="py-4 font-label-bold text-[#ffb1c1]">#TRX-7756</td>
                  <td className="py-4">Tokyo Port, JP</td>
                  <td className="py-4">280 Cases</td>
                  <td className="py-4"><span className="px-2 py-0.5 rounded text-[10px] bg-emerald-400/10 text-emerald-400 font-bold tracking-widest">DELIVERED</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-[#c41e5c] p-6 rounded-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-8 -bottom-8 opacity-10 rotate-12 transition-transform group-hover:rotate-0 duration-700">
            <span className="material-symbols-outlined text-[160px] text-white">bolt</span>
          </div>
          <div className="relative z-10">
            <span className="material-symbols-outlined text-white text-3xl mb-4">bolt</span>
            <h4 className="font-display-hero text-white text-3xl leading-tight">SYSTEM PERFORMANCE</h4>
            <p className="text-white/80 font-body mt-2">All warehouse protocols operating at peak efficiency. Latency is within 20ms range.</p>
          </div>
          <div className="relative z-10 pt-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Reliability Score</span>
              <span className="text-white font-label-bold">99.98%</span>
            </div>
            <div className="w-full h-1 bg-white/20 rounded-full">
              <div className="h-full bg-white w-full"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
