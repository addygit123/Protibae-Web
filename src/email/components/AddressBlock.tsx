import { Section, Text, Row, Column } from '@react-email/components';
import * as React from 'react';
import { theme } from './Theme';

export interface Address {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface AddressBlockProps {
  shippingAddress: Address;
  billingAddress?: Address;
}

export const AddressBlock = ({ shippingAddress, billingAddress }: AddressBlockProps) => {
  return (
    <Section style={{ padding: '20px 0' }}>
      <Row>
        <Column style={{ paddingRight: '10px', verticalAlign: 'top', width: '50%' }}>
          <Text style={{ color: theme.colors.textPrimary, fontSize: '14px', fontWeight: 'bold', margin: '0 0 10px 0' }}>Shipping Address</Text>
          <Text style={{ color: theme.colors.textSecondary, margin: '0 0 4px 0', fontSize: '14px' }}>{shippingAddress.name}</Text>
          <Text style={{ color: theme.colors.textSecondary, margin: '0 0 4px 0', fontSize: '14px' }}>{shippingAddress.line1}</Text>
          {shippingAddress.line2 && <Text style={{ color: theme.colors.textSecondary, margin: '0 0 4px 0', fontSize: '14px' }}>{shippingAddress.line2}</Text>}
          <Text style={{ color: theme.colors.textSecondary, margin: '0 0 4px 0', fontSize: '14px' }}>
            {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
          </Text>
          <Text style={{ color: theme.colors.textSecondary, margin: 0, fontSize: '14px' }}>{shippingAddress.country}</Text>
        </Column>
        
        {billingAddress && (
          <Column style={{ paddingLeft: '10px', verticalAlign: 'top', width: '50%' }}>
            <Text style={{ color: theme.colors.textPrimary, fontSize: '14px', fontWeight: 'bold', margin: '0 0 10px 0' }}>Billing Address</Text>
            <Text style={{ color: theme.colors.textSecondary, margin: '0 0 4px 0', fontSize: '14px' }}>{billingAddress.name}</Text>
            <Text style={{ color: theme.colors.textSecondary, margin: '0 0 4px 0', fontSize: '14px' }}>{billingAddress.line1}</Text>
            {billingAddress.line2 && <Text style={{ color: theme.colors.textSecondary, margin: '0 0 4px 0', fontSize: '14px' }}>{billingAddress.line2}</Text>}
            <Text style={{ color: theme.colors.textSecondary, margin: '0 0 4px 0', fontSize: '14px' }}>
              {billingAddress.city}, {billingAddress.state} {billingAddress.postalCode}
            </Text>
            <Text style={{ color: theme.colors.textSecondary, margin: 0, fontSize: '14px' }}>{billingAddress.country}</Text>
          </Column>
        )}
      </Row>
    </Section>
  );
};
