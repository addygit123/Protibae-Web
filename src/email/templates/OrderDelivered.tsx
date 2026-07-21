import * as React from 'react';
import { Text, Section } from '@react-email/components';
import { BaseLayout, Header, Footer, Button, theme } from '../components';

interface OrderDeliveredProps {
  customerName: string;
  orderNumber: string;
}

export const OrderDelivered = ({ customerName, orderNumber }: OrderDeliveredProps) => (
  <BaseLayout previewText={`Your Order #${orderNumber} has been delivered!`}>
    <Header />
    <Section style={{ padding: '20px 0' }}>
      <Text style={{ color: theme.colors.textPrimary, fontSize: '24px', fontWeight: 'bold', margin: '0 0 15px 0' }}>
        Your PROTIBAE order has arrived!
      </Text>
      <Text style={{ color: theme.colors.textSecondary, fontSize: '16px', lineHeight: '24px', margin: '0 0 20px 0' }}>
        Hi {customerName}, your order <strong>#{orderNumber}</strong> has been marked as delivered.
      </Text>
      <Text style={{ color: theme.colors.textSecondary, fontSize: '16px', lineHeight: '24px', margin: '0 0 20px 0' }}>
        We hope you enjoy your products! If you have any issues with your delivery, please let us know.
      </Text>
      <Section style={{ textAlign: 'center' }}>
        <Button href={`https://protibae.com/shop`}>Shop Again</Button>
      </Section>
    </Section>
    <Footer />
  </BaseLayout>
);

export default OrderDelivered;
