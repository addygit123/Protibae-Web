'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useHydration } from '@/hooks/useHydration';
import { Home, ShoppingBag, User, Menu, X, HelpCircle, Gift, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { navLinks, siteConfig } from '@/config/site';
import { useCartStore } from '@/lib/store/cart';
import { useSession, signOut } from 'next-auth/react';

export function MobileBottomNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isMounted = useHydration();
  const cartCount = useCartStore((state) => state.getCartItemCount());
  const { data: session, status } = useSession();

  // Hide on admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const displayCount = isMounted ? cartCount : 0;
  const isLoggedIn = status === 'authenticated' && !!session;

  const handleSignOut = async () => {
    setMenuOpen(false);
    useCartStore.getState().clearCart();
    await signOut({ callbackUrl: '/login' });
  };

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Shop', href: '/shop', icon: ShoppingBag },
    { label: 'Cart', href: '/cart', icon: ShoppingBag, isCart: true },
    { label: 'Account', href: isLoggedIn ? '/account' : '/login', icon: User },
    { label: 'Menu', href: '#menu', icon: Menu, isMenu: true },
  ];

  return (
    <>
      {/* Bottom Nav Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#121317]/95 backdrop-blur-xl border-t border-[#594045]/40 shadow-[0_-10px_25px_rgba(0,0,0,0.5)] pb-safe-bottom">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isMenu = item.isMenu;
            const isCart = item.isCart;
            const isActive = !isMenu && (item.href === '/' ? pathname === '/' : pathname.startsWith(item.href));
            const Icon = item.icon;

            const content = (
              <div className="flex flex-col items-center justify-center w-full h-full py-1 text-center relative">
                <div className="relative">
                  <Icon
                    size={22}
                    className={cn(
                      'transition-colors duration-200',
                      isActive ? 'text-[#ffb1c1]' : 'text-[#e1bec3] hover:text-[#ffb1c1]'
                    )}
                  />
                  {isCart && displayCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-[#c41e5c] text-white text-[9px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center leading-none border border-[#121317]">
                      {displayCount}
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    'text-[10px] mt-1 font-body tracking-wider uppercase font-medium transition-colors duration-200',
                    isActive ? 'text-[#ffb1c1]' : 'text-[#e1bec3]'
                  )}
                >
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabGlow"
                    className="absolute top-0 w-8 h-[2px] bg-[#c41e5c] shadow-[0_0_8px_#c41e5c]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </div>
            );

            if (isMenu) {
              return (
                <button
                  key={item.label}
                  onClick={() => setMenuOpen(true)}
                  className="flex-1 flex flex-col items-center justify-center focus:outline-none"
                  aria-label="Open menu drawer"
                >
                  {content}
                </button>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex-1 flex flex-col items-center justify-center"
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Side Menu Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Dark Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm md:hidden"
              onClick={() => setMenuOpen(false)}
            />

            {/* Slide up sheet or right drawer - let's make it a slide-up drawer for native look */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-[#1e1f23] rounded-t-3xl border-t border-[#594045]/40 p-6 flex flex-col max-h-[85vh] md:hidden"
            >
              {/* Handle */}
              <div className="w-12 h-1.5 bg-[#594045]/30 rounded-full mx-auto mb-6" onClick={() => setMenuOpen(false)} />

              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="font-display text-[26px] tracking-tight italic uppercase text-[#e3e2e7]"
                >
                  {siteConfig.name}
                </Link>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-1 text-[#e3e2e7] hover:text-[#ffb1c1] transition-colors"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Links Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8 overflow-y-auto pr-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 p-4 bg-[#121317]/50 rounded-xl border border-[#594045]/20 hover:border-[#ffb1c1]/40 transition-all text-[#e3e2e7]"
                  >
                    <span className="font-body text-xs font-semibold uppercase tracking-wider">{link.label}</span>
                  </Link>
                ))}

                <Link
                  href="/rewards"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 p-4 bg-[#121317]/50 rounded-xl border border-[#594045]/20 hover:border-[#ffb1c1]/40 transition-all text-[#e3e2e7]"
                >
                  <Gift size={16} className="text-[#ffb1c1]" />
                  <span className="font-body text-xs font-semibold uppercase tracking-wider">Rewards</span>
                </Link>

                <Link
                  href="/our-story"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 p-4 bg-[#121317]/50 rounded-xl border border-[#594045]/20 hover:border-[#ffb1c1]/40 transition-all text-[#e3e2e7]"
                >
                  <BookOpen size={16} className="text-[#ffb1c1]" />
                  <span className="font-body text-xs font-semibold uppercase tracking-wider">Our Story</span>
                </Link>

                <Link
                  href="/help"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 p-4 bg-[#121317]/50 rounded-xl border border-[#594045]/20 hover:border-[#ffb1c1]/40 transition-all text-[#e3e2e7]"
                >
                  <HelpCircle size={16} className="text-[#ffb1c1]" />
                  <span className="font-body text-xs font-semibold uppercase tracking-wider">Help</span>
                </Link>
              </div>

              {/* Profile / Auth at Bottom */}
              <div className="border-t border-[#594045]/30 pt-6 mt-auto">
                {isMounted && isLoggedIn ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#e1bec3] truncate max-w-[200px]">
                        Logged in as: <strong className="text-white block font-medium">{session.user?.email}</strong>
                      </span>
                      <Link
                        href="/account"
                        onClick={() => setMenuOpen(false)}
                        className="text-xs text-[#ffb1c1] underline flex items-center gap-1 font-semibold uppercase tracking-wider"
                      >
                        View Account
                      </Link>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full py-3 bg-[#c41e5c]/10 border border-[#c41e5c]/30 text-white rounded-xl hover:bg-[#c41e5c]/20 transition-all font-body text-xs font-semibold uppercase tracking-widest"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex justify-center items-center w-full py-3 bg-[#c41e5c] hover:bg-[#90003e] text-white rounded-xl transition-all font-body text-xs font-semibold uppercase tracking-widest"
                  >
                    Login / Create Account
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
