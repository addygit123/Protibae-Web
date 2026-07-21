import { Section, Text, Row, Column } from '@react-email/components';
import * as React from 'react';
import { theme } from './Theme';
import { Divider } from './Divider';

interface OrderSummaryProps {
  subtotal: string;
  shipping: string;
  discount?: string;
  tax: string;
  total: string;
  paymentMethod: string;
}

export const OrderSummary = ({ subtotal, shipping, discount, tax, total, paymentMethod }: OrderSummaryProps) => {
  return (
    <Section style={{ padding: '20px 0' }}>
      <Text style={{ color: theme.colors.textPrimary, fontSize: '16px', fontWeight: 'bold', margin: '0 0 15px 0' }}>Order Summary</Text>
      
      <Row style={{ marginBottom: '8px' }}>
        <Column><Text style={{ color: theme.colors.textSecondary, margin: 0 }}>Subtotal</Text></Column>
        <Column style={{ textAlign: 'right' }}><Text style={{ color: theme.colors.textPrimary, margin: 0 }}>{subtotal}</Text></Column>
      </Row>
      
      <Row style={{ marginBottom: '8px' }}>
        <Column><Text style={{ color: theme.colors.textSecondary, margin: 0 }}>Shipping</Text></Column>
        <Column style={{ textAlign: 'right' }}><Text style={{ color: theme.colors.textPrimary, margin: 0 }}>{shipping}</Text></Column>
      </Row>

      {discount && (
        <Row style={{ marginBottom: '8px' }}>
          <Column><Text style={{ color: theme.colors.textSecondary, margin: 0 }}>Discount</Text></Column>
          <Column style={{ textAlign: 'right' }}><Text style={{ color: theme.colors.primary, margin: 0 }}>-{discount}</Text></Column>
        </Row>
      )}

      <Row style={{ marginBottom: '8px' }}>
        <Column><Text style={{ color: theme.colors.textSecondary, margin: 0 }}>Tax</Text></Column>
        <Column style={{ textAlign: 'right' }}><Text style={{ color: theme.colors.textPrimary, margin: 0 }}>{tax}</Text></Column>
      </Row>

      <Divider />

      <Row style={{ marginBottom: '8px' }}>
        <Column><Text style={{ color: theme.colors.textPrimary, fontWeight: 'bold', margin: 0 }}>Total</Text></Column>
        <Column style={{ textAlign: 'right' }}><Text style={{ color: theme.colors.textPrimary, fontWeight: 'bold', fontSize: '18px', margin: 0 }}>{total}</Text></Column>
      </Row>

      <Row style={{ marginTop: '16px' }}>
        <Column><Text style={{ color: theme.colors.textSecondary, fontSize: '14px', margin: 0 }}>Payment Method: {paymentMethod}</Text></Column>
      </Row>
    </Section>
  );
};
