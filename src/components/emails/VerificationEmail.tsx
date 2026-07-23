import React from 'react';
import { BaseTemplate } from './BaseTemplate';
import { Text, Section, Button } from '@react-email/components';

interface VerificationEmailProps {
  name: string;
  verificationLink: string;
}

export function VerificationEmail({ name, verificationLink }: VerificationEmailProps) {
  return (
    <BaseTemplate previewText="Verify your PROTIBAE email address">
      <Text className="text-[24px] font-bold text-[#E3E2E7] mb-2">Verify Your Email</Text>
      <Text className="text-[#E1BEC3] text-[16px] mb-6">
        Hi {name}, welcome to PROTIBAE! Please verify your email address by clicking the button below.
      </Text>

      <Section className="text-center mb-8">
        <Button 
          href={verificationLink}
          className="bg-[#C41E5C] text-white text-[14px] font-bold uppercase tracking-widest px-8 py-4 rounded"
        >
          Verify Email
        </Button>
      </Section>

      <Text className="text-[#8B8D98] text-[14px] mb-2">
        If you didn't create an account, you can safely ignore this email.
      </Text>
    </BaseTemplate>
  );
}
