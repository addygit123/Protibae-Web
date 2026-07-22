import type { Metadata } from 'next';
import { MaintenancePage } from '@/components/store-mode/MaintenancePage';
import { isMaintenanceMode } from '@/lib/store-config';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Under Maintenance',
  description: "We're making some improvements. We'll be back shortly.",
  robots: { index: false, follow: false },
};

export default function MaintenanceRoutePage() {
  // If someone manually visits /maintenance when store is live, redirect home
  if (!isMaintenanceMode) {
    redirect('/');
  }

  return <MaintenancePage />;
}
