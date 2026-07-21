import * as React from 'react';
import { Text, Section } from '@react-email/components';
import { BaseLayout, Header, Footer, Button, theme } from '../components';

interface PasswordResetProps {
  customerName: string;
  resetLink: string;
}

export const PasswordReset = ({ customerName, resetLink }: PasswordResetProps) => (
  <BaseLayout previewText="Reset your PROTIBAE password">
    <Header />
    <Section style={{ padding: '20px 0' }}>
      <Text style={{ color: theme.colors.textPrimary, fontSize: '24px', fontWeight: 'bold', margin: '0 0 15px 0' }}>
        Password Reset Request
      </Text>
      <Text style={{ color: theme.colors.textSecondary, fontSize: '16px', lineHeight: '24px', margin: '0 0 20px 0' }}>
        Hi {customerName}, we received a request to reset the password for your PROTIBAE account.
      </Text>
      <Section style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Button href={resetLink}>Reset Password</Button>
      </Section>
      <Text style={{ color: theme.colors.textSecondary, fontSize: '14px', lineHeight: '24px', margin: '0 0 20px 0' }}>
        If you didn't request a password reset, you can safely ignore this email.
      </Text>
    </Section>
    <Footer />
  </BaseLayout>
);

export default PasswordReset;
