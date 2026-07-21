import { Hr } from '@react-email/components';
import * as React from 'react';
import { theme } from './Theme';

export const Divider = () => {
  return <Hr style={{ borderColor: theme.colors.border, margin: '20px 0' }} />;
};
