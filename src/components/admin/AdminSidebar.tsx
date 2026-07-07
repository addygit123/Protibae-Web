'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: 'dashboard' },
    { name: 'Orders', href: '/admin/orders', icon: 'shopping_cart' },
    { name: 'Products', href: '/admin/products', icon: 'inventory_2' },
    { name: 'Customers', href: '/admin/customers', icon: 'group' },
    { name: 'Analytics', href: '/admin/analytics', icon: 'monitoring' },
    { name: 'Settings', href: '/admin/settings', icon: 'settings' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-[#343539] bg-[#0d0e12] z-50 flex flex-col">
      <div className="px-6 py-8">
        <h1 className="font-display-hero text-headline-md text-[#c41e5c] tracking-wider uppercase">PRO-FUEL</h1>
        <p className="font-label-bold text-label-bold text-[#e1bec3] opacity-60">Admin Dashboard</p>
      </div>
      
      <nav className="flex-1 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-6 py-4 transition-all duration-200 group active:scale-95',
                isActive
                  ? 'text-[#ffb1c1] bg-[#c41e5c]/10 border-r-2 border-[#ffb1c1]'
                  : 'text-[#e1bec3] hover:bg-[#1e1f23] hover:text-[#e3e2e7]'
              )}
            >
              <span className="material-symbols-outlined group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className="font-label-bold text-label-bold">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-6">
        <button className="w-full py-3 bg-[#292a2e] border border-[#594045] hover:border-[#ffb1c1] transition-all text-label-bold font-label-bold flex items-center justify-center gap-2 text-[#e3e2e7] rounded">
          <span className="material-symbols-outlined text-[18px]">help</span>
          Support
        </button>
      </div>
    </aside>
  );
}
