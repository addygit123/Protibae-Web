import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import AdminGuard from '@/components/admin/AdminGuard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Portal',
  description: 'PROTIBAE Admin Portal',
  robots: {
    index: false,
    follow: false,
  },
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