import { Column, Img, Row, Section, Text } from '@react-email/components';
import * as React from 'react';
import { theme } from './Theme';

export const SocialIcons = () => {
  return (
    <Section style={{ textAlign: 'center', margin: '20px 0' }}>
      <Row>
        <Column style={{ padding: '0 10px' }}>
          <a href="https://instagram.com/protibae">
            <Text style={{ color: theme.colors.primary }}>Instagram</Text>
          </a>
        </Column>
        <Column style={{ padding: '0 10px' }}>
          <a href="https://facebook.com/protibae">
            <Text style={{ color: theme.colors.primary }}>Facebook</Text>
          </a>
        </Column>
      </Row>
    </Section>
  );
};
