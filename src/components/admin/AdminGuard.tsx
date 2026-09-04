'use client';

import { usePathname } from 'next/navigation';
import type { Session } from 'next-auth';

import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface AdminGuardProps {
  session: Session | null;
  children: React.ReactNode;
}

export default function AdminGuard({ session: _session, children }: AdminGuardProps) {
  const pathname = usePathname();

  // Render just the page if it's the login or invoice route
  if (pathname === '/admin/login' || pathname?.endsWith('/invoice')) {
    return <>{children}</>;
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
