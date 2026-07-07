import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import LoginClient from './LoginClient';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your Protibae account',
};

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/account');
  }

  return <LoginClient />;
}
