import { Resend } from 'resend';
import { render } from '@react-email/render';
import React from 'react';
import {
  WelcomeEmail,
  OrderConfirmation,
  PaymentSuccessful,
  OrderShipped,
  OrderDelivered,
  PasswordReset,
  EmailVerification,
  ContactFormAutoReply,
  AdminNewOrderNotification,
  AdminContactRequest,
} from './templates';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = 'PROTIBAE <onboarding@resend.dev>'; // Update this with the verified production domain later

export type EmailTemplateName =
  | 'WelcomeEmail'
  | 'OrderConfirmation'
  | 'PaymentSuccessful'
  | 'OrderShipped'
  | 'OrderDelivered'
  | 'PasswordReset'
  | 'EmailVerification'
  | 'ContactFormAutoReply'
  | 'AdminNewOrderNotification'
  | 'AdminContactRequest';

interface SendEmailParams {
  to: string | string[];
  subject: string;
  template: EmailTemplateName;
  props: any;
}

const getTemplateComponent = (template: EmailTemplateName, props: any) => {
  switch (template) {
    case 'WelcomeEmail': return <WelcomeEmail {...props} />;
    case 'OrderConfirmation': return <OrderConfirmation {...props} />;
    case 'PaymentSuccessful': return <PaymentSuccessful {...props} />;
    case 'OrderShipped': return <OrderShipped {...props} />;
    case 'OrderDelivered': return <OrderDelivered {...props} />;
    case 'PasswordReset': return <PasswordReset {...props} />;
    case 'EmailVerification': return <EmailVerification {...props} />;
    case 'ContactFormAutoReply': return <ContactFormAutoReply {...props} />;
    case 'AdminNewOrderNotification': return <AdminNewOrderNotification {...props} />;
    case 'AdminContactRequest': return <AdminContactRequest {...props} />;
    default:
      throw new Error(`Template ${template} not found`);
  }
};

/**
 * Send a transactional email using Resend and React Email.
 * Implements graceful error handling and renders the template to HTML string safely.
 */
export async function sendEmail({ to, subject, template, props }: SendEmailParams) {
  try {
    if (!resend) {
      console.warn('RESEND_API_KEY not found. Skipping email send.', { to, subject, template });
      return { success: true, dummy: true };
    }

    const emailComponent = getTemplateComponent(template, props);
    
    // We can render HTML in case we need it, though Resend accepts react components directly.
    // We pass the react component for better support with Resend's API.
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      react: emailComponent,
    });

    if (error) {
      console.error(`Failed to send email to ${to}:`, error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error(`Unexpected error sending email to ${to}:`, error);
    // Returning failure instead of throwing enables safe retry logic on the caller side.
    return { success: false, error };
  }
}
