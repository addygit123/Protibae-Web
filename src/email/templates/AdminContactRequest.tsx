import * as React from 'react';
import { Text, Section } from '@react-email/components';
import { BaseLayout, Header, theme, Divider } from '../components';

interface AdminContactRequestProps {
  customerName: string;
  customerEmail: string;
  subject: string;
  message: string;
}

export const AdminContactRequest = ({
  customerName,
  customerEmail,
  subject,
  message,
}: AdminContactRequestProps) => (
  <BaseLayout previewText={`New Contact Form Submission: ${subject}`}>
    <Header />
    <Section style={{ padding: '20px 0' }}>
      <Text style={{ color: theme.colors.primary, fontSize: '24px', fontWeight: 'bold', margin: '0 0 15px 0' }}>
        New Contact Request
      </Text>
      <Divider />
      <Text style={{ color: theme.colors.textPrimary, margin: '0 0 8px 0', fontWeight: 'bold' }}>From:</Text>
      <Text style={{ color: theme.colors.textSecondary, margin: '0 0 4px 0' }}>{customerName} ({customerEmail})</Text>
      
      <Text style={{ color: theme.colors.textPrimary, margin: '15px 0 8px 0', fontWeight: 'bold' }}>Subject:</Text>
      <Text style={{ color: theme.colors.textSecondary, margin: '0 0 4px 0' }}>{subject}</Text>
      
      <Text style={{ color: theme.colors.textPrimary, margin: '15px 0 8px 0', fontWeight: 'bold' }}>Message:</Text>
      <Text style={{ color: theme.colors.textSecondary, margin: '0 0 20px 0', whiteSpace: 'pre-wrap' }}>{message}</Text>
    </Section>
  </BaseLayout>
);

export default AdminContactRequest;
