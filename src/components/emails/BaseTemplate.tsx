import React from 'react';
import { Html, Head, Body, Container, Section, Text, Img, Link, Tailwind, Hr } from '@react-email/components';

export function BaseTemplate({
  children,
  previewText,
}: {
  children: React.ReactNode;
  previewText: string;
}) {
  return (
    <Html>
      <Head>
        <title>{previewText}</title>
      </Head>
      <Tailwind>
        <Body className="bg-[#0D0E12] text-[#E3E2E7] font-sans m-0 p-0">
          <Container className="mx-auto my-8 max-w-[600px] border border-[#343539] rounded-lg overflow-hidden">
            {/* Header */}
            <Section className="bg-[#1A1B1F] p-8 text-center border-b border-[#343539]">
              <Text className="text-[#C41E5C] text-2xl font-bold tracking-widest uppercase m-0">PROTIBAE</Text>
            </Section>

            {/* Content Body */}
            <Section className="p-8">
              {children}
            </Section>

            {/* Footer */}
            <Section className="bg-[#1A1B1F] p-8 text-center border-t border-[#343539]">
              <Text className="text-[#E1BEC3] text-[12px] uppercase tracking-widest mb-4">Stay Connected</Text>
              <Section className="flex justify-center gap-4 mb-4">
                <Link href="#" className="text-[#C41E5C] underline text-[12px]">Instagram</Link>
                <Link href="#" className="text-[#C41E5C] underline text-[12px]">Twitter</Link>
                <Link href="#" className="text-[#C41E5C] underline text-[12px]">Contact Us</Link>
              </Section>
              <Hr className="border-[#343539] my-4" />
              <Text className="text-[#8B8D98] text-[10px]">
                © {new Date().getFullYear()} PROTIBAE. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
