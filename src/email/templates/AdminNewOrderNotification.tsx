import * as React from 'react';
import { Text, Section } from '@react-email/components';
import { BaseLayout, Header, Button, theme, Divider, OrderSummary } from '../components';

interface AdminNewOrderNotificationProps {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: string;
  paymentMethod: string;
}

export const AdminNewOrderNotification = ({
  orderNumber,
  customerName,
  customerEmail,
  total,
  paymentMethod,
}: AdminNewOrderNotificationProps) => (
  <BaseLayout previewText={`New Order: #${orderNumber}`}>
    <Header />
    <Section style={{ padding: '20px 0' }}>
      <Text style={{ color: theme.colors.primary, fontSize: '24px', fontWeight: 'bold', margin: '0 0 15px 0' }}>
        New Order Received!
      </Text>
      <Text style={{ color: theme.colors.textPrimary, fontSize: '16px', lineHeight: '24px', margin: '0 0 20px 0' }}>
        Order <strong>#{orderNumber}</strong> was just placed.
      </Text>
      <Divider />
      <Text style={{ color: theme.colors.textSecondary, margin: '0 0 4px 0' }}>Customer: {customerName}</Text>
      <Text style={{ color: theme.colors.textSecondary, margin: '0 0 4px 0' }}>Email: {customerEmail}</Text>
      <Text style={{ color: theme.colors.textSecondary, margin: '0 0 4px 0' }}>Total: {total}</Text>
      <Text style={{ color: theme.colors.textSecondary, margin: '0 0 4px 0' }}>Payment: {paymentMethod}</Text>
      <Section style={{ textAlign: 'center', marginTop: '20px' }}>
        <Button href={`https://protibae.com/admin/orders/${orderNumber}`}>View Order in Admin</Button>
      </Section>
    </Section>
  </BaseLayout>
);

export default AdminNewOrderNotification;
