import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AccountLayout } from '@/components/account/AccountLayout';
import { AddressesClient } from '@/components/account/addresses/AddressesClient';

export const metadata: Metadata = {
  title: 'My Addresses | PROTIBAE',
  description: 'Manage your PROTIBAE shipping and billing addresses.',
  robots: { index: false, follow: false },
};

export default async function AddressesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/account/addresses');
  }

  const addresses = await prisma.address.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <AccountLayout>
      <AddressesClient initialAddresses={addresses} />
    </AccountLayout>
  );
}
