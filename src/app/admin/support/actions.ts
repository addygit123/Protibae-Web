'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateTicketStatusAndPriority(ticketId: string, status: string, priority: string) {
  await prisma.supportTicket.update({
    where: { id: ticketId },
    data: {
      status,
      priority,
    }
  });

  revalidatePath('/admin/support');
  revalidatePath(`/admin/support/${ticketId}`);
}
