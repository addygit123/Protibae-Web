import React from 'react';
import { BaseTemplate } from './BaseTemplate';
import { Text, Section, Row, Column, Button, Hr } from '@react-email/components';

interface OrderItemProps {
  name: string;
  quantity: number;
  price: number;
}

interface OrderEmailProps {
  title: string;
  message: string;
  orderNumber: string;
  items: OrderItemProps[];
  shipping: number;
  total: number;
  address: string;
  orderUrl: string;
}

export function OrderEmail({
  title,
  message,
  orderNumber,
  items,
  shipping,
  total,
  address,
  orderUrl,
}: OrderEmailProps) {
  return (
    <BaseTemplate previewText={title}>
      <Text className="text-[24px] font-bold text-[#E3E2E7] mb-2">{title}</Text>
      <Text className="text-[#E1BEC3] text-[16px] mb-6">{message}</Text>

      <Section className="bg-[#1A1B1F] p-6 rounded border border-[#343539] mb-6">
        <Text className="text-[14px] uppercase tracking-widest text-[#E1BEC3] font-bold mb-4">Order Summary: #{orderNumber}</Text>
        
        {items.map((item, i) => (
          <Row key={i} className="mb-4">
            <Column>
              <Text className="text-[16px] text-[#E3E2E7] m-0">{item.name}</Text>
              <Text className="text-[12px] text-[#8B8D98] m-0">Qty: {item.quantity}</Text>
            </Column>
            <Column align="right">
              <Text className="text-[16px] text-[#E3E2E7] m-0">₹{(item.price * item.quantity).toFixed(2)}</Text>
            </Column>
          </Row>
        ))}

        <Hr className="border-[#343539] my-4" />
        
        <Row className="mb-2">
          <Column>
            <Text className="text-[14px] text-[#E1BEC3] m-0">Shipping</Text>
          </Column>
          <Column align="right">
            <Text className="text-[14px] text-[#E1BEC3] m-0">₹{shipping.toFixed(2)}</Text>
          </Column>
        </Row>
        <Row>
          <Column>
            <Text className="text-[16px] font-bold text-[#E3E2E7] m-0">Total</Text>
          </Column>
          <Column align="right">
            <Text className="text-[18px] font-bold text-[#C41E5C] m-0">₹{total.toFixed(2)}</Text>
          </Column>
        </Row>
      </Section>

      <Section className="bg-[#1A1B1F] p-6 rounded border border-[#343539] mb-8">
        <Text className="text-[14px] uppercase tracking-widest text-[#E1BEC3] font-bold mb-2">Shipping Address</Text>
        <Text className="text-[16px] text-[#E3E2E7] m-0" style={{ whiteSpace: 'pre-line' }}>{address}</Text>
      </Section>

      <Section className="text-center">
        <Button 
          href={orderUrl}
          className="bg-[#C41E5C] text-white text-[14px] font-bold uppercase tracking-widest px-8 py-4 rounded"
        >
          View Order Status
        </Button>
      </Section>
    </BaseTemplate>
  );
}
