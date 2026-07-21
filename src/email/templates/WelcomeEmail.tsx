import * as React from 'react';
import { Text, Section } from '@react-email/components';
import { BaseLayout, Header, Footer, Button, theme } from '../components';

interface WelcomeEmailProps {
  customerName: string;
}

export const WelcomeEmail = ({ customerName }: WelcomeEmailProps) => (
  <BaseLayout previewText="Welcome to PROTIBAE">
    <Header />
    <Section style={{ padding: '20px 0' }}>
      <Text style={{ color: theme.colors.textPrimary, fontSize: '24px', fontWeight: 'bold', margin: '0 0 15px 0' }}>
        Welcome to PROTIBAE, {customerName}!
      </Text>
      <Text style={{ color: theme.colors.textSecondary, fontSize: '16px', lineHeight: '24px', margin: '0 0 20px 0' }}>
        We're thrilled to have you here. Get ready to experience premium nutrition designed to fuel your potential and keep you at your best.
      </Text>
      <Section style={{ textAlign: 'center' }}>
        <Button href="https://protibae.com/shop">Shop Our Collection</Button>
      </Section>
    </Section>
    <Footer />
  </BaseLayout>
);

export default WelcomeEmail;
