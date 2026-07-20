import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import LoginClient from './LoginClient';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your PROTIBAE account to track orders, manage rewards, and access exclusive member benefits.',
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/account');
  }

  return <LoginClient />;
}
