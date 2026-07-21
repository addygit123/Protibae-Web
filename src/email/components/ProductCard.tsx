import { Column, Img, Row, Section, Text } from '@react-email/components';
import * as React from 'react';
import { theme } from './Theme';

interface ProductCardProps {
  image: string;
  name: string;
  quantity: number;
  price: string;
}

export const ProductCard = ({ image, name, quantity, price }: ProductCardProps) => {
  return (
    <Section style={{ padding: '10px 0', borderBottom: `1px solid ${theme.colors.border}` }}>
      <Row>
        <Column style={{ width: '80px' }}>
          <Img src={image} alt={name} width="60" height="60" style={{ borderRadius: '4px', objectFit: 'cover' }} />
        </Column>
        <Column>
          <Text style={{ color: theme.colors.textPrimary, margin: '0 0 5px 0', fontWeight: 'bold' }}>{name}</Text>
          <Text style={{ color: theme.colors.textSecondary, margin: 0 }}>Qty: {quantity}</Text>
        </Column>
        <Column style={{ textAlign: 'right' }}>
          <Text style={{ color: theme.colors.textPrimary, margin: 0, fontWeight: 'bold' }}>{price}</Text>
        </Column>
      </Row>
    </Section>
  );
};
