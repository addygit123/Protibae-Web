import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminLoginForm from '@/components/admin/AdminLoginForm';

export const metadata: Metadata = {
  title: 'Admin Login',
  description: 'Login to Protibae Admin Portal',
};

export default async function AdminLoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role === 'ADMIN') {
    redirect('/admin');
  } else if (session) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-[#0d0e12] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-display-hero text-headline-lg text-white mb-2 tracking-tight">ADMIN PORTAL</h1>
          <p className="text-[#8e8e93] font-body-md">Restricted Access. Authorized personnel only.</p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}
