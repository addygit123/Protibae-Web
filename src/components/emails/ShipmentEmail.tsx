import React from 'react';
import { BaseTemplate } from './BaseTemplate';
import { Text, Section, Row, Column, Button } from '@react-email/components';

interface ShipmentEmailProps {
  title: string;
  message: string;
  orderNumber: string;
  courier: string;
  awbNumber: string;
  trackingUrl: string;
  estimatedDelivery?: string;
}

export function ShipmentEmail({
  title,
  message,
  orderNumber,
  courier,
  awbNumber,
  trackingUrl,
  estimatedDelivery,
}: ShipmentEmailProps) {
  return (
    <BaseTemplate previewText={title}>
      <Text className="text-[24px] font-bold text-[#E3E2E7] mb-2">{title}</Text>
      <Text className="text-[#E1BEC3] text-[16px] mb-6">{message}</Text>

      <Section className="bg-[#1A1B1F] p-6 rounded border border-[#343539] mb-8">
        <Text className="text-[14px] uppercase tracking-widest text-[#E1BEC3] font-bold mb-4">Shipment Details</Text>
        
        <Row className="mb-4">
          <Column>
            <Text className="text-[12px] uppercase tracking-widest text-[#8B8D98] m-0 mb-1">Order Number</Text>
            <Text className="text-[16px] text-[#E3E2E7] m-0">#{orderNumber}</Text>
          </Column>
          <Column>
            <Text className="text-[12px] uppercase tracking-widest text-[#8B8D98] m-0 mb-1">Courier</Text>
            <Text className="text-[16px] text-[#E3E2E7] m-0">{courier}</Text>
          </Column>
        </Row>
        <Row>
          <Column>
            <Text className="text-[12px] uppercase tracking-widest text-[#8B8D98] m-0 mb-1">Tracking Number</Text>
            <Text className="text-[16px] font-mono text-[#E3E2E7] m-0">{awbNumber}</Text>
          </Column>
          {estimatedDelivery && (
            <Column>
              <Text className="text-[12px] uppercase tracking-widest text-[#8B8D98] m-0 mb-1">Estimated Delivery</Text>
              <Text className="text-[16px] text-[#E3E2E7] m-0">{estimatedDelivery}</Text>
            </Column>
          )}
        </Row>
      </Section>

      <Section className="text-center">
        <Button 
          href={trackingUrl}
          className="bg-[#C41E5C] text-white text-[14px] font-bold uppercase tracking-widest px-8 py-4 rounded"
        >
          Track Package
        </Button>
      </Section>
    </BaseTemplate>
  );
}
