import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AccountLayout } from '@/components/account/AccountLayout';
import { AddressForm } from '@/components/account/addresses/AddressForm';

export const metadata: Metadata = {
  title: 'Manage Address | PROTIBAE',
  description: 'Add or Edit your PROTIBAE account shipping details.',
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AddEditAddressPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/account/addresses');
  }

  const { id } = await params;

  let initialAddress = null;

  if (id !== 'new') {
    initialAddress = await prisma.address.findUnique({
      where: { id },
    });

    // Check if address exists and belongs to the authenticated user
    if (!initialAddress || initialAddress.userId !== session.user.id) {
      notFound();
    }
  }

  return (
    <AccountLayout>
      <AddressForm initialAddress={initialAddress} />
    </AccountLayout>
  );
}
