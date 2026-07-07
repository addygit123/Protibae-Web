'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBasket, 
  MapPin, 
  User, 
  Lock, 
  Heart, 
  Star, 
  LogOut,
  Mail,
  Phone,
  Zap
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

interface AccountLayoutProps {
  children: ReactNode;
}

export function AccountLayout({ children }: AccountLayoutProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { name: 'Dashboard', href: '/account', icon: LayoutDashboard },
    { name: 'My Orders', href: '/account/orders', icon: ShoppingBasket },
    { name: 'My Addresses', href: '/account/addresses', icon: MapPin },
    { name: 'Account Details', href: '/account/details', icon: User },
    { name: 'Change Password', href: '/account/password', icon: Lock },
    { name: 'Wishlist', href: '/account/wishlist', icon: Heart },
    { name: 'Rewards', href: '/account/rewards', icon: Star },
  ];

  return (
    <div className="max-w-container-max mx-auto px-gutter py-12 md:py-20">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <h1 className="font-display-hero text-headline-lg uppercase mb-2 tracking-tighter">MY ACCOUNT</h1>
          <div className="inline-block bg-primary-container px-4 py-1 skew-x-[-12deg] mb-6">
            <p className="font-display-hero text-headline-md text-on-primary-container italic uppercase skew-x-[12deg]">You vs You. Every day.</p>
          </div>
          <p className="text-on-surface-variant max-w-md">Manage your orders, addresses and account details in one place. Fuel your journey with premium nutrition.</p>
        </div>

        {/* User Summary Profile Overlay */}
        <div className="flex items-center gap-6 bg-surface-container p-6 rounded-xl border border-outline-variant/20 shadow-xl">
          <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-display-hero text-headline-lg">
            {session?.user?.firstName?.[0] || session?.user?.name?.[0] || 'A'}
          </div>
          <div>
            <h2 className="font-display-hero text-headline-md leading-tight">
              Hey, {session?.user?.firstName || session?.user?.name?.split(' ')[0] || 'Athlete'}!
            </h2>
            <p className="text-primary font-label-bold uppercase tracking-widest flex items-center gap-1 text-sm">
              Welcome back <Zap className="w-4 h-4 fill-primary" />
            </p>
            <div className="mt-2 space-y-1">
              <p className="text-on-surface-variant text-sm flex items-center gap-2">
                <Mail className="w-3 h-3" /> {session?.user?.email || 'Loading...'}
              </p>
              <p className="text-on-surface-variant text-sm flex items-center gap-2">
                <Phone className="w-3 h-3" /> Add phone number
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Side Navigation */}
        <aside className="md:col-span-3 space-y-2">
          <nav className="bg-surface-container rounded-xl p-4 border border-outline-variant/10">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all mb-1 ${
                    isActive 
                      ? 'bg-primary-container text-on-primary-container' 
                      : 'text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-label-bold uppercase">{item.name}</span>
                </Link>
              );
            })}
            
            <div className="pt-4 mt-4 border-t border-outline-variant/20">
              <button 
                className="w-full flex items-center gap-3 p-3 rounded-lg text-error hover:bg-error-container/20 transition-all"
                onClick={() => signOut({ callbackUrl: '/login' })}
              >
                <LogOut className="w-5 h-5" />
                <span className="font-label-bold uppercase">Logout</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Dashboard Content */}
        <div className="md:col-span-9 space-y-gutter">
          {children}
        </div>
      </div>
    </div>
  );
}
