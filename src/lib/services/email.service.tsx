import { Resend } from 'resend';
import { env } from '@/lib/env';
import React from 'react';
import { OrderEmail } from '@/components/emails/OrderEmail';
import { ShipmentEmail } from '@/components/emails/ShipmentEmail';
import { SupportEmail } from '@/components/emails/SupportEmail';
import { PasswordResetEmail } from '@/components/emails/PasswordResetEmail';

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;
const FROM_EMAIL = 'Protibae <onboarding@resend.dev>';

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
        console.warn(`To: ${to}`);
        console.warn(`Subject: ${subject}`);
        console.warn('(No RESEND_API_KEY found, check server logs for react template if needed)\n');
        return { success: true, mock: true };
      }

      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to,
        subject,
        react,
      });

      if (error) {
        console.error('[EmailService] Resend API Error:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (err) {
      console.error('[EmailService] Unexpected Error:', err);
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
  }
};
