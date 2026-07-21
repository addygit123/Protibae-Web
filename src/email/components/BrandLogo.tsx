import { Img, Section } from '@react-email/components';
import * as React from 'react';

export const BrandLogo = () => {
  return (
    <Section style={{ padding: '20px 0', textAlign: 'center' }}>
      <Img
        src="https://protibae.com/logo-light.png"
        alt="PROTIBAE"
        width="150"
        height="auto"
        style={{ margin: '0 auto' }}
      />
    </Section>
  );
};
