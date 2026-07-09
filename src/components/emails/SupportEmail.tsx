import React from 'react';
import { BaseTemplate } from './BaseTemplate';
import { Text, Section, Button } from '@react-email/components';

interface SupportEmailProps {
  ticketId: string;
  subject: string;
  name: string;
}

export function SupportEmail({ ticketId, subject, name }: SupportEmailProps) {
  return (
    <BaseTemplate previewText="We've received your support request">
      <Text className="text-[24px] font-bold text-[#E3E2E7] mb-2">Request Received</Text>
      <Text className="text-[#E1BEC3] text-[16px] mb-6">
        Hi {name}, we have received your support ticket and our team is on it!
      </Text>

      <Section className="bg-[#1A1B1F] p-6 rounded border border-[#343539] mb-8">
        <Text className="text-[12px] uppercase tracking-widest text-[#8B8D98] m-0 mb-1">Ticket ID</Text>
        <Text className="text-[16px] font-mono text-[#E3E2E7] mb-4">#{ticketId}</Text>
        
        <Text className="text-[12px] uppercase tracking-widest text-[#8B8D98] m-0 mb-1">Subject</Text>
        <Text className="text-[16px] text-[#E3E2E7] mb-4">{subject}</Text>

        <Text className="text-[12px] uppercase tracking-widest text-[#8B8D98] m-0 mb-1">Estimated Response Time</Text>
        <Text className="text-[16px] text-[#E3E2E7] m-0">24-48 Hours</Text>
      </Section>

      <Text className="text-[#8B8D98] text-[14px] mb-6">
        If you have any additional information to add, simply reply to this email.
      </Text>

      <Section className="text-center">
        <Button 
          href="mailto:support@protibae.com"
          className="bg-transparent border border-[#343539] text-[#E3E2E7] text-[14px] font-bold uppercase tracking-widest px-8 py-4 rounded hover:bg-[#1A1B1F]"
        >
          Contact Support
        </Button>
      </Section>
    </BaseTemplate>
  );
}
