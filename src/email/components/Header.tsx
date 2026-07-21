import { Section, Text } from '@react-email/components';
import * as React from 'react';
import { BrandLogo } from './BrandLogo';
import { theme } from './Theme';

export const Header = () => {
  return (
    <Section style={{ paddingBottom: '20px' }}>
      <BrandLogo />
      <Text style={{ color: theme.colors.textPrimary, textAlign: 'center', fontSize: '18px', margin: 0 }}>
        Fueling Your Potential
      </Text>
    </Section>
  );
};
