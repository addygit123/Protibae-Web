import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow, format } from 'date-fns';
import { revalidatePath } from 'next/cache';

export default async function SupportTicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticket = await prisma.supportTicket.findUnique({
    where: { id },
  });

  if (!ticket) {
    notFound();
  }

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'URGENT': return 'bg-error-container text-on-error-container';
      case 'HIGH': return 'bg-orange-950 text-orange-400';
      case 'MEDIUM': return 'bg-blue-950 text-blue-400';
      case 'LOW': return 'bg-surface-container-high text-on-surface-variant';
      default: return 'bg-surface-container-high text-on-surface-variant';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'OPEN': return 'bg-primary-container text-white';
      case 'IN_PROGRESS': return 'bg-surface-variant text-on-surface';
      case 'RESOLVED': return 'bg-secondary-container/20 text-secondary';
      case 'CLOSED': return 'bg-transparent text-on-surface-variant';
      default: return 'bg-transparent text-on-surface-variant';
    }
  };

  async function updateTicket(formData: FormData) {
    'use server';
    const status = formData.get('status') as string;
    const priority = formData.get('priority') as string;
    await prisma.supportTicket.update({
      where: { id },
      data: { status, priority },
    });
    revalidatePath(`/admin/support/${id}`);
    revalidatePath(`/admin/support`);
  }

  return (
    <div className="h-[calc(100vh-8rem)] w-full max-w-5xl bg-[#121317] border border-[#594045] rounded-xl flex flex-col shadow-2xl mx-auto">
      {/* Header */}
      <div className="px-8 py-6 border-b border-[#594045] flex justify-between items-center bg-[#1a1b1f] rounded-t-xl">
        <div className="flex items-center gap-4">
          <Link href="/admin/support" className="material-symbols-outlined hover:text-[#ffb1c1] transition-colors text-[#e1bec3]">arrow_back</Link>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="font-display-hero text-2xl text-[#e3e2e7]">TICKET #{ticket.id.slice(-6).toUpperCase()}</h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-[#594045] ${getStatusColor(ticket.status)}`}>
                {ticket.status}
              </span>
            </div>
            <p className="text-[#e1bec3] text-label-sm">Created {format(ticket.createdAt, 'MMM dd, yyyy • HH:mm')} GMT</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[#e1bec3]">
          <button className="p-2 hover:bg-[#343539] rounded transition-colors material-symbols-outlined">print</button>
          <button className="p-2 hover:bg-[#343539] rounded transition-colors material-symbols-outlined">share</button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Left Panel: Customer Profile */}
        <div className="w-80 border-r border-[#594045] p-6 bg-[#0d0e12] overflow-y-auto hidden md:block">
          <div className="text-center mb-8">
            <div className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-[#c41e5c] p-1 flex items-center justify-center bg-[#1e1f23]">
               <span className="text-3xl font-display-hero text-[#ffb1c1]">{ticket.firstName[0]}{ticket.lastName[0]}</span>
            </div>
            <h4 className="font-display-hero text-xl text-[#e3e2e7]">{ticket.firstName} {ticket.lastName}</h4>
            <p className="text-[#c41e5c] font-label-bold">Customer</p>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-[10px] text-[#e1bec3] uppercase tracking-widest font-bold mb-2">Contact Info</p>
              <div className="space-y-2 text-label-sm text-[#e3e2e7]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#ffb1c1]">mail</span>
                  <span>{ticket.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Conversation */}
        <div className="flex-1 flex flex-col bg-[#121317] overflow-y-auto">
          <div className="p-8 flex-1">
            <div className="mb-8">
              <h4 className="font-display-hero text-2xl mb-4 text-[#e3e2e7]">{ticket.issueType}</h4>
              <div className="p-6 bg-[#1a1b1f] border-l-4 border-[#c41e5c] rounded shadow-sm">
                <div className="flex justify-between mb-4">
                  <span className="font-label-bold text-[#e3e2e7]">{ticket.firstName} {ticket.lastName}</span>
                  <span className="text-label-sm text-[#e1bec3]">{formatDistanceToNow(ticket.createdAt, { addSuffix: true })}</span>
                </div>
                <p className="text-body-md leading-relaxed text-[#e3e2e7]/90 whitespace-pre-wrap">
                  {ticket.message}
                </p>
              </div>
            </div>

            <form action={updateTicket} className="space-y-8 bg-[#1e1f23] p-6 rounded-xl border border-[#594045]">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-[#e1bec3] uppercase tracking-widest mb-2">Update Status</label>
                  <select name="status" defaultValue={ticket.status} className="w-full bg-[#343539] border-[#594045] rounded py-2 px-3 text-label-bold text-[#e3e2e7] focus:ring-[#ffb1c1] focus:border-[#ffb1c1]">
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#e1bec3] uppercase tracking-widest mb-2">Update Priority</label>
                  <select name="priority" defaultValue={ticket.priority} className="w-full bg-[#343539] border-[#594045] rounded py-2 px-3 text-label-bold text-[#e3e2e7] focus:ring-[#ffb1c1] focus:border-[#ffb1c1]">
                    <option value="URGENT" className="text-red-400">Urgent</option>
                    <option value="HIGH" className="text-orange-400">High</option>
                    <option value="MEDIUM" className="text-blue-400">Medium</option>
                    <option value="LOW" className="text-gray-400">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-[#343539]">
                <button type="submit" className="px-6 py-2 bg-[#c41e5c] text-white font-label-bold text-label-bold rounded hover:bg-[#ffb1c1] hover:text-[#66002a] transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
