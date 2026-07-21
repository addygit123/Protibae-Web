import * as React from 'react';
import { Text, Section } from '@react-email/components';
import { BaseLayout, Header, Footer, Button, theme } from '../components';

interface OrderShippedProps {
  customerName: string;
  orderNumber: string;
  trackingLink: string;
  trackingNumber: string;
  courierName: string;
}

export const OrderShipped = ({ customerName, orderNumber, trackingLink, trackingNumber, courierName }: OrderShippedProps) => (
  <BaseLayout previewText={`Your Order #${orderNumber} has shipped!`}>
    <Header />
    <Section style={{ padding: '20px 0' }}>
      <Text style={{ color: theme.colors.textPrimary, fontSize: '24px', fontWeight: 'bold', margin: '0 0 15px 0' }}>
        Great news, {customerName}! Your order is on the way.
      </Text>
      <Text style={{ color: theme.colors.textSecondary, fontSize: '16px', lineHeight: '24px', margin: '0 0 20px 0' }}>
        Your order <strong>#{orderNumber}</strong> has been shipped via <strong>{courierName}</strong>.
      </Text>
      <Text style={{ color: theme.colors.textSecondary, fontSize: '16px', lineHeight: '24px', margin: '0 0 20px 0' }}>
        Tracking Number: <strong>{trackingNumber}</strong>
      </Text>
      <Section style={{ textAlign: 'center' }}>
        <Button href={trackingLink}>Track Your Package</Button>
      </Section>
    </Section>
    <Footer />
  </BaseLayout>
);

export default OrderShipped;
