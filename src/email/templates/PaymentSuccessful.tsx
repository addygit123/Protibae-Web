import * as React from 'react';
import { Text, Section } from '@react-email/components';
import { BaseLayout, Header, Footer, Button, theme } from '../components';

interface PaymentSuccessfulProps {
  customerName: string;
  orderNumber: string;
  amount: string;
}

export const PaymentSuccessful = ({ customerName, orderNumber, amount }: PaymentSuccessfulProps) => (
  <BaseLayout previewText={`Payment Successful for Order #${orderNumber}`}>
    <Header />
    <Section style={{ padding: '20px 0' }}>
      <Text style={{ color: theme.colors.textPrimary, fontSize: '24px', fontWeight: 'bold', margin: '0 0 15px 0' }}>
        Payment Successful!
      </Text>
      <Text style={{ color: theme.colors.textSecondary, fontSize: '16px', lineHeight: '24px', margin: '0 0 20px 0' }}>
        Hi {customerName}, we have successfully received your payment of <strong>{amount}</strong> for order <strong>#{orderNumber}</strong>.
      </Text>
      <Text style={{ color: theme.colors.textSecondary, fontSize: '16px', lineHeight: '24px', margin: '0 0 20px 0' }}>
        Your order is now being processed. We will notify you once it ships!
      </Text>
      <Section style={{ textAlign: 'center' }}>
        <Button href={`https://protibae.com/account/orders/${orderNumber}`}>View Order</Button>
      </Section>
    </Section>
    <Footer />
  </BaseLayout>
);

export default PaymentSuccessful;
