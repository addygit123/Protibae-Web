"use server";

import { prisma } from '@/lib/prisma';
import { emailService } from '@/lib/services/email.service';
import { getBaseUrl } from '@/lib/utils';

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

    const ticketIdStr = ticket.id.slice(-6).toUpperCase();

    // Send Support Acknowledgement Email
    await emailService.sendSupportEmail(
      email,
      `Support Request Received - #${ticketIdStr}`,
      {
        ticketId: ticketIdStr,
        subject: issueType,
        name: firstName
      }
    );

    // Send Admin Notification Email
    try {
      await emailService.sendAdminEmail(
        `New Support Ticket - #${ticketIdStr}`,
        {
          title: 'New Support Ticket',
          message: `A new support request has been submitted by ${firstName} ${lastName}.`,
          details: [
            `Ticket ID: #${ticketIdStr}`,
            `Customer: ${firstName} ${lastName} (${email})`,
            `Subject: ${issueType}`,
            `Message: ${message}`
          ],
          actionUrl: `${getBaseUrl()}/admin`,
          actionLabel: 'View Admin Dashboard'
        }
      );
    } catch (adminEmailError) {
      console.error('Failed to send admin notification email for support ticket:', adminEmailError);
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to submit support ticket:', error);
    return { success: false, error: 'Failed to submit ticket. Please try again later.' };
  }
}
