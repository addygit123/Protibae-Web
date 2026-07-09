import React from 'react';
import { BaseTemplate } from './BaseTemplate';
import { Text, Section, Button } from '@react-email/components';

interface PasswordResetEmailProps {
  name: string;
  resetLink: string;
}

export function PasswordResetEmail({ name, resetLink }: PasswordResetEmailProps) {
  return (
    <BaseTemplate previewText="Reset your PROTIBAE password">
      <Text className="text-[24px] font-bold text-[#E3E2E7] mb-2">Reset Password</Text>
      <Text className="text-[#E1BEC3] text-[16px] mb-6">
        Hi {name}, we received a request to reset the password for your PROTIBAE account.
      </Text>

      <Section className="text-center mb-8">
        <Button 
          href={resetLink}
          className="bg-[#C41E5C] text-white text-[14px] font-bold uppercase tracking-widest px-8 py-4 rounded"
        >
          Reset My Password
        </Button>
      </Section>

      <Text className="text-[#8B8D98] text-[14px] mb-2">
        If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
      </Text>
    </BaseTemplate>
  );
}
