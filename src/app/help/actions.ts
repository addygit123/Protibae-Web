"use server";

import { prisma } from '@/lib/prisma';
import { emailService } from '@/lib/services/email.service';

export async function submitSupportTicket(formData: FormData) {
  try {
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const issueType = formData.get('issueType') as string;
    const message = formData.get('message') as string;

    if (!firstName || !lastName || !email || !issueType || !message) {
      return { success: false, error: 'All fields are required.' };
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        firstName,
        lastName,
        email,
        issueType,
        message,
      },
    });

    // Send Support Acknowledgement Email
    await emailService.sendSupportEmail(
      email,
      `Support Request Received - #${ticket.id.slice(-6).toUpperCase()}`,
      {
        ticketId: ticket.id.slice(-6).toUpperCase(),
        subject: issueType,
        name: firstName
      }
    );

    return { success: true };
  } catch (error) {
    console.error('Failed to submit support ticket:', error);
    return { success: false, error: 'Failed to submit ticket. Please try again later.' };
  }
}
