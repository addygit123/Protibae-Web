import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

import { Prisma } from '@prisma/client';

export default async function AdminSupportPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>
}) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || '';
  const statusFilter = resolvedSearchParams.status || '';

  const whereClause: Prisma.SupportTicketWhereInput = {};
  
  if (query) {
    whereClause.OR = [
      { id: { contains: query, mode: 'insensitive' } },
      { firstName: { contains: query, mode: 'insensitive' } },
      { lastName: { contains: query, mode: 'insensitive' } },
      { email: { contains: query, mode: 'insensitive' } },
      { issueType: { contains: query, mode: 'insensitive' } },
    ];
  }
  
  if (statusFilter) {
    whereClause.status = statusFilter;
  }

  const [
    tickets,
    openTicketsCount,
    inProgressCount,
    resolvedTodayCount,
  ] = await Promise.all([
    prisma.supportTicket.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.supportTicket.count({ where: { status: 'OPEN' } }),
    prisma.supportTicket.count({ where: { status: 'IN_PROGRESS' } }),
    prisma.supportTicket.count({
      where: {
        status: 'RESOLVED',
        updatedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    })
  ]);

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'URGENT': return 'bg-red-950 text-red-400 border-red-500/20';
      case 'HIGH': return 'bg-orange-950 text-orange-400 border-orange-500/20';
      case 'MEDIUM': return 'bg-blue-950 text-blue-400 border-blue-500/20';
      case 'LOW': return 'bg-[#343539] text-[#e1bec3] border-[#594045]';
      default: return 'bg-[#343539] text-[#e1bec3] border-[#594045]';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'OPEN': return 'bg-[#c41e5c] text-white drop-shadow-[0_0_8px_rgba(196,30,92,0.3)]';
      case 'IN_PROGRESS': return 'bg-[#343539] text-[#e3e2e7] border border-[#594045]';
      case 'RESOLVED': return 'bg-[#454747]/20 text-[#c6c6c7] border border-[#c6c6c7]/20';
      case 'CLOSED': return 'bg-transparent text-[#e1bec3] border border-[#594045]';
      default: return 'bg-transparent text-[#e1bec3]';
    }
  };

  return (
    <>
      <div className="mb-10">
        <h2 className="font-display-hero text-headline-lg text-[#e3e2e7] tracking-wide uppercase">Support Center</h2>
        <p className="text-[#e1bec3] font-body mt-2">Manage customer support tickets and conversations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-[#1e1f23] p-6 rounded-xl border border-[#594045] hover:border-[#ffb1c1]/50 transition-all cursor-default">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#e1bec3]">Open Tickets</span>
            <span className="material-symbols-outlined text-[#ffb1c1]">confirmation_number</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-display-hero text-[#e3e2e7]">{openTicketsCount}</span>
          </div>
        </div>
        <div className="bg-[#1e1f23] p-6 rounded-xl border border-[#594045] hover:border-[#ffb1c1]/50 transition-all cursor-default">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#e1bec3]">In Progress</span>
            <span className="material-symbols-outlined text-[#e1bec3]">cached</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-display-hero text-[#e3e2e7]">{inProgressCount}</span>
          </div>
        </div>
        <div className="bg-[#1e1f23] p-6 rounded-xl border border-[#594045] hover:border-[#ffb1c1]/50 transition-all cursor-default">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#e1bec3]">Resolved Today</span>
            <span className="material-symbols-outlined text-[#e1bec3]">check_circle</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-display-hero text-[#e3e2e7]">{resolvedTodayCount}</span>
          </div>
        </div>
        <div className="bg-[#1e1f23] p-6 rounded-xl border border-[#594045] hover:border-[#ffb1c1]/50 transition-all cursor-default">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#e1bec3]">Avg. Response Time</span>
            <span className="material-symbols-outlined text-[#e1bec3]">timer</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-display-hero text-[#e3e2e7]">2<span className="text-2xl">h</span> 15<span className="text-2xl">m</span></span>
          </div>
        </div>
      </div>

      <section className="bg-[#1e1f23] border border-[#594045] rounded-xl overflow-hidden mb-12">
        <div className="p-6 border-b border-[#594045] flex justify-between items-center flex-wrap gap-4">
          <h3 className="font-display-hero text-headline-md text-[#e3e2e7] tracking-tight">Active Tickets</h3>
          
          <form className="flex gap-2" method="GET">
            <input 
              type="text" 
              name="q" 
              defaultValue={query} 
              placeholder="Search Name, Email, Subject, ID" 
              className="bg-[#1a1b1f] border border-[#594045] rounded-lg px-3 py-1.5 text-sm text-[#e3e2e7] placeholder:text-[#e1bec3]"
            />
            <select 
              name="status" 
              defaultValue={statusFilter}
              className="bg-[#1a1b1f] border border-[#594045] rounded-lg px-3 py-1.5 text-sm text-[#e3e2e7]"
            >
              <option value="">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
            <button type="submit" className="px-3 py-1.5 bg-[#343539] text-[#e3e2e7] text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">search</span> Search
            </button>
          </form>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#292a2e]/50 text-[10px] font-bold uppercase tracking-[0.2em] text-[#e1bec3] border-b border-[#594045]">
                <th className="px-6 py-4">Ticket ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#594045]/30">
              {tickets.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-[#e1bec3]">No tickets found.</td>
                </tr>
              )}
              {tickets.map(ticket => (
                <tr key={ticket.id} className="group hover:bg-[#343539]/40 transition-colors cursor-pointer">
                  <td className="px-6 py-5 font-label-bold text-[#e3e2e7]">#{ticket.id.slice(-6).toUpperCase()}</td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#e3e2e7]">{ticket.firstName} {ticket.lastName}</span>
                      <span className="text-xs text-[#e1bec3]">{ticket.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-[#e1bec3] truncate max-w-[200px]">{ticket.issueType}</td>
                  <td className="px-6 py-5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-[#e1bec3]">{formatDistanceToNow(ticket.createdAt, { addSuffix: true })}</td>
                  <td className="px-6 py-5 text-right">
                    <Link href={`/admin/support/${ticket.id}`} className="p-2 text-[#e1bec3] group-hover:text-[#ffb1c1] transition-all inline-block">
                      <span className="material-symbols-outlined">visibility</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
