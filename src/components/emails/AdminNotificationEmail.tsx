import React from 'react';
import { BaseTemplate } from './BaseTemplate';
import { Text, Section, Button } from '@react-email/components';

interface AdminNotificationEmailProps {
  title: string;
  message: string;
  details: string[];
  actionUrl?: string;
  actionLabel?: string;
}

export function AdminNotificationEmail({
  title,
  message,
  details,
  actionUrl,
  actionLabel = 'View Dashboard',
}: AdminNotificationEmailProps) {
  return (
    <BaseTemplate previewText={title}>
      <Text className="text-[24px] font-bold text-[#E3E2E7] mb-2">{title}</Text>
      <Text className="text-[#E1BEC3] text-[16px] mb-6">{message}</Text>

      <Section className="bg-[#1A1B1F] p-6 rounded border border-[#343539] mb-8">
        <Text className="text-[14px] uppercase tracking-widest text-[#E1BEC3] font-bold mb-4">Event Details</Text>
        {details.map((detail, index) => (
          <Text key={index} className="text-[14px] text-[#E3E2E7] mb-2 last:mb-0">
            {detail}
          </Text>
        ))}
      </Section>

      {actionUrl && (
        <Section className="text-center">
          <Button 
            href={actionUrl}
            className="bg-[#C41E5C] text-white text-[14px] font-bold uppercase tracking-widest px-8 py-4 rounded"
          >
            {actionLabel}
          </Button>
        </Section>
      )}
    </BaseTemplate>
  );
}
