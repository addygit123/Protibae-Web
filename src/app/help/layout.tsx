/**
 * Help route layout — provides SEO metadata for the client-rendered help page.
 * Metadata must live in a Server Component. This layout wraps the client page.
 */
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Help & Support',
  description:
    'Get help with your PROTIBAE order. Track your shipment, request a refund, or contact our support team — we\'re here 24/7.',
  path: '/help',
  keywords: ['PROTIBAE support', 'contact us', 'help center', 'protein bar refund', 'order tracking'],
});

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
