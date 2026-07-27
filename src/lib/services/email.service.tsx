import { Resend } from 'resend';
import { env } from '@/lib/env';
import React from 'react';
import { render } from '@react-email/render';
import { OrderEmail } from '@/components/emails/OrderEmail';
import { ShipmentEmail } from '@/components/emails/ShipmentEmail';
import { SupportEmail } from '@/components/emails/SupportEmail';
import { PasswordResetEmail } from '@/components/emails/PasswordResetEmail';
import { VerificationEmail } from '@/components/emails/VerificationEmail';
import { WelcomeEmail } from '@/components/emails/WelcomeEmail';
import { AdminNotificationEmail } from '@/components/emails/AdminNotificationEmail';

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;
const FROM_EMAIL = env.RESEND_FROM_EMAIL || 'Protibae <hello@protibae.com>';
const ADMIN_EMAIL = env.ADMIN_EMAIL || 'admin@protibae.com';

interface SendEmailOptions {
  to: string;
  subject: string;
  react: React.ReactElement;
}

export const emailService = {
  async sendEmail({ to, subject, react }: SendEmailOptions) {
    try {
      if (!resend) {
        console.warn('\n[MOCK EMAIL SENT]');
        console.warn(`From: ${FROM_EMAIL}`);
        console.warn(`To: ${to}`);
        console.warn(`Subject: ${subject}`);
        console.warn('(No RESEND_API_KEY found, check server logs for react template if needed)\n');
        return { success: true, mock: true };
      }

      // Generate HTML and plain text versions for compatibility
      const html = await render(react);
      const text = await render(react, { plainText: true });

      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to,
        subject,
        html,
        text,
      });

      if (error) {
        console.error(`[EmailService] Resend API Error sending to ${to} (Subject: "${subject}"):`, error);
        return { success: false, error };
      }

      console.log(`[EmailService] Email sent successfully to ${to} (Subject: "${subject}")`);
      return { success: true, data };
    } catch (err) {
      console.error(`[EmailService] Unexpected Error sending to ${to} (Subject: "${subject}"):`, err);
      return { success: false, error: err };
    }
  },

  async sendOrderEmail(to: string, subject: string, props: any) {
    return this.sendEmail({
      to,
      subject,
      react: <OrderEmail {...props} />
    });
  },

  async sendShipmentEmail(to: string, subject: string, props: any) {
    return this.sendEmail({
      to,
      subject,
      react: <ShipmentEmail {...props} />
    });
  },

  async sendSupportEmail(to: string, subject: string, props: any) {
    return this.sendEmail({
      to,
      subject,
      react: <SupportEmail {...props} />
    });
  },

  async sendPasswordResetEmail(to: string, subject: string, props: any) {
    return this.sendEmail({
      to,
      subject,
      react: <PasswordResetEmail {...props} />
    });
  },

  async sendVerificationEmail(to: string, subject: string, props: any) {
    return this.sendEmail({
      to,
      subject,
      react: <VerificationEmail {...props} />
    });
  },

  async sendWelcomeEmail(to: string, subject: string, props: { name: string }) {
    return this.sendEmail({
      to,
      subject,
      react: <WelcomeEmail {...props} />
    });
  },

  async sendAdminEmail(subject: string, props: { title: string; message: string; details: string[]; actionUrl?: string; actionLabel?: string }) {
    return this.sendEmail({
      to: ADMIN_EMAIL,
      subject,
      react: <AdminNotificationEmail {...props} />
    });
  }
};
