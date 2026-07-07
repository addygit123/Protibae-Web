import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import AdminGuard from '@/components/admin/AdminGuard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Protibae Admin',
  description: 'Admin Portal for Protibae',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <AdminGuard session={session}>
      {children}
    </AdminGuard>
  );
}