import React from 'react';
import { BaseTemplate } from './BaseTemplate';
import { Text, Section, Button } from '@react-email/components';
import { getBaseUrl } from '@/lib/utils';

interface WelcomeEmailProps {
  name: string;
}

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  const storeUrl = getBaseUrl();

  return (
    <BaseTemplate previewText="Welcome to PROTIBAE!">
      <Text className="text-[24px] font-bold text-[#E3E2E7] mb-2">Welcome to the Team!</Text>
      <Text className="text-[#E1BEC3] text-[16px] mb-6">
        Hi {name}, we're thrilled to have you here at PROTIBAE.
      </Text>

      <Text className="text-[#E3E2E7] text-[16px] mb-4">
        At PROTIBAE, we are dedicated to crafting high-performance, clean nutrition to fuel your ambition. Zero compromise, pure power — made for athletes who demand the absolute best from their bodies.
      </Text>

      <Section className="bg-[#1A1B1F] p-6 rounded border border-[#343539] mb-8">
        <Text className="text-[14px] uppercase tracking-widest text-[#E1BEC3] font-bold mb-2">What's Next?</Text>
        <Text className="text-[14px] mb-2">
          • <strong>Shop the Store:</strong> Discover our range of premium protein bars.
        </Text>
        <Text className="text-[14px] mb-2">
          • <strong>Earn Rewards:</strong> Check your rewards balance on your account page.
        </Text>
        <Text className="text-[14px]">
          • <strong>Track Orders:</strong> Get real-time delivery status updates.
        </Text>
      </Section>

      <Section className="text-center mb-8">
        <Button 
          href={storeUrl}
          className="bg-[#C41E5C] text-white text-[14px] font-bold uppercase tracking-widest px-8 py-4 rounded"
        >
          Start Shopping
        </Button>
      </Section>

      <Text className="text-[#8B8D98] text-[14px]">
        If you have any questions or feedback, we're here to help! Simply reply to this email or reach out to us at hello@protibae.com.
      </Text>
    </BaseTemplate>
  );
}
