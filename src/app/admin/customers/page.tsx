import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam) || 1;
  const take = 10;
  const skip = (page - 1) * take;

  const [customers, totalCustomers] = await Promise.all([
    prisma.user.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      where: { role: 'CUSTOMER' },
      include: {
        _count: {
          select: { orders: true }
        }
      }
    }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
  ]);

  const totalPages = Math.ceil(totalCustomers / take);

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h2 className="font-display-hero text-headline-lg text-[#e3e2e7] leading-none mb-2">CUSTOMERS</h2>
          <p className="font-body text-[#e1bec3] opacity-80">View and manage your customer accounts.</p>
        </div>
      </div>

      {/* Data Table Surface */}
      <div className="bg-[#1a1b1f] rounded-xl border border-[#343539] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#292a2e]/50 border-b border-[#343539]">
                <th className="px-6 py-4 font-label-bold text-[12px] text-[#e1bec3] uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 font-label-bold text-[12px] text-[#e1bec3] uppercase tracking-widest">Email</th>
                <th className="px-6 py-4 font-label-bold text-[12px] text-[#e1bec3] uppercase tracking-widest">Orders</th>
                <th className="px-6 py-4 font-label-bold text-[12px] text-[#e1bec3] uppercase tracking-widest">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#343539]">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-[#e1bec3]">
                    No customers found.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-[#343539]/20 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#292a2e] border border-[#594045] overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-[#ffb1c1]">
                          {customer.name?.charAt(0).toUpperCase() || 'C'}
                        </div>
                        <div>
                          <p className="font-body font-bold text-[#e3e2e7]">{customer.name || 'Anonymous User'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-[#e1bec3] text-body-md">{customer.email || 'N/A'}</td>
                    <td className="px-6 py-5 font-label-bold text-[#e3e2e7]">{customer._count.orders}</td>
                    <td className="px-6 py-5 text-[#e1bec3] text-[12px]">
                      {new Date(customer.createdAt).toLocaleDateString('en-IN', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-[#343539] flex items-center justify-between bg-[#1a1b1f]">
          <span className="font-body text-[#e1bec3] opacity-70">
            Showing {Math.min(skip + 1, totalCustomers)} to {Math.min(skip + take, totalCustomers)} of {totalCustomers} customers
          </span>
          <div className="flex items-center gap-2">
            <Link 
              href={page > 1 ? `/admin/customers?page=${page - 1}` : '#'}
              className={`p-2 border border-[#343539] rounded text-[#e1bec3] hover:text-[#ffb1c1] hover:border-[#ffb1c1] transition-all ${page <= 1 ? 'opacity-30 pointer-events-none' : ''}`}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </Link>
            <div className="flex gap-1">
              <button className="w-8 h-8 rounded bg-[#c41e5c] text-white font-label-bold">{page}</button>
            </div>
            <Link 
              href={page < totalPages ? `/admin/customers?page=${page + 1}` : '#'}
              className={`p-2 border border-[#343539] rounded text-[#e1bec3] hover:text-[#ffb1c1] hover:border-[#ffb1c1] transition-all ${page >= totalPages ? 'opacity-30 pointer-events-none' : ''}`}
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
