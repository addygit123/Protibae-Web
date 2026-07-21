import * as React from 'react';
import { Text, Section } from '@react-email/components';
import { BaseLayout, Header, Footer, Button, theme } from '../components';

interface EmailVerificationProps {
  customerName: string;
  verificationLink: string;
}

export const EmailVerification = ({ customerName, verificationLink }: EmailVerificationProps) => (
  <BaseLayout previewText="Verify your PROTIBAE email address">
    <Header />
    <Section style={{ padding: '20px 0' }}>
      <Text style={{ color: theme.colors.textPrimary, fontSize: '24px', fontWeight: 'bold', margin: '0 0 15px 0' }}>
        Verify Your Email
      </Text>
      <Text style={{ color: theme.colors.textSecondary, fontSize: '16px', lineHeight: '24px', margin: '0 0 20px 0' }}>
        Hi {customerName}, thank you for registering with PROTIBAE. Please click the button below to verify your email address.
      </Text>
      <Section style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Button href={verificationLink}>Verify Email</Button>
      </Section>
      <Text style={{ color: theme.colors.textSecondary, fontSize: '14px', lineHeight: '24px', margin: '0 0 20px 0' }}>
        If you didn't create an account, you can safely ignore this email.
      </Text>
    </Section>
    <Footer />
  </BaseLayout>
);

export default EmailVerification;
