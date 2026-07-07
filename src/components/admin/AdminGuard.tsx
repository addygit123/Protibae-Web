'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Session } from 'next-auth';

import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface AdminGuardProps {
  session: Session | null;
  children: React.ReactNode;
}

export default function AdminGuard({ session, children }: AdminGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    if (pathname === '/admin/login') {
      if (session?.user?.role === 'ADMIN') {
        router.replace('/admin');
      }
      return;
    }

    if (!session) {
      router.replace('/admin/login');
      return;
    }

    if (session.user.role !== 'ADMIN') {
      router.replace('/');
      return;
    }
  }, [pathname, session, router, isMounted]);

  if (!isMounted) return null;

  // Render just the page if it's the login or invoice route
  if (pathname === '/admin/login' || pathname.endsWith('/invoice')) {
    return <>{children}</>;
  }

  // If we're on an admin route and not admin, don't flash content before redirect
  if (!session || session.user.role !== 'ADMIN') {
    return null; 
  }

  return (
    <div className="flex h-screen bg-[#0d0e12] text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
