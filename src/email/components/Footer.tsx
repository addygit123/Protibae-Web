import { Section, Text } from '@react-email/components';
import * as React from 'react';
import { SocialIcons } from './SocialIcons';
import { theme } from './Theme';

export const Footer = () => {
  return (
    <Section style={{ textAlign: 'center', paddingTop: '20px' }}>
      <SocialIcons />
      <Text style={{ color: theme.colors.textSecondary, fontSize: '12px', marginTop: '10px' }}>
        © {new Date().getFullYear()} PROTIBAE. All rights reserved.
      </Text>
      <Text style={{ color: theme.colors.textSecondary, fontSize: '12px' }}>
        If you have any questions, reply to this email or contact us at support@protibae.com.
      </Text>
    </Section>
  );
};
