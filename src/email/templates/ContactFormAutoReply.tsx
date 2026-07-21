import * as React from 'react';
import { Text, Section } from '@react-email/components';
import { BaseLayout, Header, Footer, theme } from '../components';

interface ContactFormAutoReplyProps {
  customerName: string;
}

export const ContactFormAutoReply = ({ customerName }: ContactFormAutoReplyProps) => (
  <BaseLayout previewText="We've received your message!">
    <Header />
    <Section style={{ padding: '20px 0' }}>
      <Text style={{ color: theme.colors.textPrimary, fontSize: '24px', fontWeight: 'bold', margin: '0 0 15px 0' }}>
        Message Received
      </Text>
      <Text style={{ color: theme.colors.textSecondary, fontSize: '16px', lineHeight: '24px', margin: '0 0 20px 0' }}>
        Hi {customerName},
      </Text>
      <Text style={{ color: theme.colors.textSecondary, fontSize: '16px', lineHeight: '24px', margin: '0 0 20px 0' }}>
        Thank you for reaching out to PROTIBAE. We have received your message and our support team is looking into it. We typically reply within 24-48 hours.
      </Text>
      <Text style={{ color: theme.colors.textSecondary, fontSize: '16px', lineHeight: '24px', margin: '0 0 20px 0' }}>
        In the meantime, stay strong and keep fueling your potential!
      </Text>
    </Section>
    <Footer />
  </BaseLayout>
);

export default ContactFormAutoReply;
