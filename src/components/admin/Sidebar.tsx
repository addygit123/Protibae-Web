'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  LineChart,
  Settings
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Analytics', href: '/admin/analytics', icon: LineChart },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-full flex flex-col w-64 border-r border-[#343539] bg-[#0d0e12] z-50 shrink-0 hidden md:flex">
      <div className="px-6 py-8">
        <h1 className="font-display-hero text-headline-md text-[#c41e5c] tracking-wider uppercase">PRO-FUEL</h1>
        <p className="font-label-bold text-label-bold text-[#e1bec3] opacity-60 mt-1">Admin Dashboard</p>
      </div>
      <nav className="flex-1 mt-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-6 py-4 transition-all duration-200 group active:scale-95",
                isActive 
                  ? "text-[#c41e5c] bg-[#c41e5c]/10 border-r-2 border-[#c41e5c]"
                  : "text-[#e1bec3] hover:bg-[#1e1f23] hover:text-[#e3e2e7]"
              )}
            >
              <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-label-bold text-label-bold">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-6 border-t border-[#343539]">
        <button className="w-full py-3 bg-[#292a2e] border border-[#594045] hover:border-[#c41e5c] transition-all text-label-bold font-label-bold flex items-center justify-center gap-2 rounded-lg text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Support
        </button>
      </div>
    </aside>
  );
}
