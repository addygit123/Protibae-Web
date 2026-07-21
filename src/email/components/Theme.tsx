import { Html, Head, Preview, Body, Container } from '@react-email/components';
import * as React from 'react';

export const theme = {
  colors: {
    background: '#121317',
    surface: '#1E1F23',
    primary: '#C41E5C',
    textPrimary: '#E3E2E7',
    textSecondary: '#A0A0A0',
    border: '#333333',
    white: '#FFFFFF',
    black: '#000000',
  },
  fontFamily: 'Helvetica, Arial, sans-serif',
};

interface BaseLayoutProps {
  children: React.ReactNode;
  previewText?: string;
}

export const BaseLayout = ({ children, previewText }: BaseLayoutProps) => {
  return (
    <Html>
      <Head />
      {previewText && <Preview>{previewText}</Preview>}
      <Body style={{ backgroundColor: theme.colors.background, fontFamily: theme.fontFamily, margin: '0 auto', padding: '20px 0' }}>
        <Container style={{ backgroundColor: theme.colors.surface, borderRadius: '8px', overflow: 'hidden', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
          {children}
        </Container>
      </Body>
    </Html>
  );
};
