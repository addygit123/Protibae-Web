import { Button as ReactEmailButton } from '@react-email/components';
import * as React from 'react';
import { theme } from './Theme';

interface ButtonProps {
  href: string;
  children: React.ReactNode;
}

export const Button = ({ href, children }: ButtonProps) => {
  return (
    <ReactEmailButton
      href={href}
      style={{
        backgroundColor: theme.colors.primary,
        color: theme.colors.white,
        padding: '12px 24px',
        borderRadius: '4px',
        textDecoration: 'none',
        fontWeight: 'bold',
        display: 'inline-block',
        textAlign: 'center',
      }}
    >
      {children}
    </ReactEmailButton>
  );
};
