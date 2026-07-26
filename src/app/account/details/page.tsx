import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AccountLayout } from '@/components/account/AccountLayout';
import { AccountDetailsClient } from '@/components/account/details/AccountDetailsClient';

export const metadata: Metadata = {
  title: 'Account Details | PROTIBAE',
  description: 'Manage your PROTIBAE profile and secure your password settings.',
  robots: { index: false, follow: false },
};

export default async function AccountDetailsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/account/details');
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      rewardAccount: true,
    },
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <AccountLayout>
      <AccountDetailsClient user={user} />
    </AccountLayout>
  );
}
