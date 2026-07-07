'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useHydration } from '@/hooks/useHydration';
import { ShoppingBag, User, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { navLinks, siteConfig } from '@/config/site';
import { useCartStore } from '@/lib/store/cart';
import { useSession, signOut } from 'next-auth/react';

/**
 * Navbar
 * Sticky, glassmorphism navigation bar.
 * Matches Stitch: bg-background/90 backdrop-blur-xl, pink nav glow, Bebas Neue wordmark.
 * Desktop: full nav links. Mobile: hamburger → full-screen drawer.
 * Auth-aware: shows Login or Account/Logout based on session state.
 */
export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const isMounted = useHydration();
  const cartCount = useCartStore((state) => state.getCartItemCount());
  const { data: session, status } = useSession();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const displayCount = isMounted ? cartCount : 0;
  const isLoggedIn = status === 'authenticated' && !!session;

  const handleSignOut = async () => {
    setAccountMenuOpen(false);
    setMobileOpen(false);
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 h-20 w-full',
          'bg-[#121317]/90 backdrop-blur-xl',
          'border-b border-[#594045]/30',
          'shadow-[0_0_20px_rgba(196,30,92,0.15)]',
        )}
      >
        <div className="container-max px-gutter h-full flex items-center justify-between">
          {/* Wordmark */}
          <Link
            href="/"
            className="font-display text-[32px] leading-none tracking-tighter italic uppercase text-[#e3e2e7] hover:text-[#ffb1c1] transition-colors duration-300"
            aria-label={`${siteConfig.name} — Home`}
          >
            {siteConfig.name}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'font-body text-label-bold uppercase tracking-widest transition-colors duration-300 pb-1',
                    isActive
                      ? 'text-[#ffb1c1] border-b-2 border-[#c41e5c]'
                      : 'text-[#e1bec3] hover:text-[#ffb1c1]',
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-5">
            {/* Account — session-aware */}
            {isMounted && isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setAccountMenuOpen((prev) => !prev)}
                  aria-label="Account menu"
                  aria-expanded={accountMenuOpen}
                  className="text-[#e3e2e7] hover:text-[#ffb1c1] transition-colors duration-300"
                >
                  <User size={22} strokeWidth={1.5} />
                </button>

                <AnimatePresence>
                  {accountMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-10 w-48 bg-[#1e1f23] border border-[#594045]/40 shadow-xl z-50"
                    >
                      <div className="px-4 py-3 border-b border-[#594045]/30">
                        <p className="text-xs text-[#e1bec3] truncate">
                          {session.user?.email}
                        </p>
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2 w-full px-4 py-3 text-sm text-[#e3e2e7] hover:bg-[#594045]/20 hover:text-[#ffb1c1] transition-colors"
                      >
                        <LayoutDashboard size={15} />
                        My Account
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 w-full px-4 py-3 text-sm text-[#e3e2e7] hover:bg-[#594045]/20 hover:text-[#ffb1c1] transition-colors"
                      >
                        <LogOut size={15} />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Close dropdown when clicking outside */}
                {accountMenuOpen && (
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setAccountMenuOpen(false)}
                    aria-hidden="true"
                  />
                )}
              </div>
            ) : (
              <Link
                href="/login"
                aria-label="Login"
                className="text-[#e3e2e7] hover:text-[#ffb1c1] transition-colors duration-300"
              >
                <User size={22} strokeWidth={1.5} />
              </Link>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              aria-label={`Shopping bag, ${displayCount} items`}
              className="relative text-[#e3e2e7] hover:text-[#ffb1c1] transition-colors duration-300"
            >
              <ShoppingBag size={22} strokeWidth={1.5} />
              {displayCount > 0 && (
                <motion.span
                  key={displayCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 bg-[#c41e5c] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none"
                >
                  {displayCount}
                </motion.span>
              )}
            </Link>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden text-[#e3e2e7] hover:text-[#ffb1c1] transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer panel */}
            <motion.nav
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 z-50 h-full w-[300px] bg-[#1e1f23] border-l border-[#594045]/30 flex flex-col p-8"
              aria-label="Mobile navigation"
            >
              {/* Close */}
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation menu"
                className="self-end text-[#e3e2e7] hover:text-[#ffb1c1] transition-colors mb-10"
              >
                <X size={24} strokeWidth={1.5} />
              </button>

              {/* Wordmark in drawer */}
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="font-display text-[28px] italic uppercase text-[#e3e2e7] mb-10"
              >
                {siteConfig.name}
              </Link>

              <ul className="space-y-6 flex-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'font-body text-label-bold uppercase tracking-widest transition-colors block',
                          isActive ? 'text-[#ffb1c1]' : 'text-[#e1bec3] hover:text-[#ffb1c1]',
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}

                {/* Mobile auth links */}
                <li className="border-t border-[#594045]/30 pt-6">
                  {isMounted && isLoggedIn ? (
                    <div className="space-y-4">
                      <Link
                        href="/account"
                        onClick={() => setMobileOpen(false)}
                        className="font-body text-label-bold uppercase tracking-widest text-[#e1bec3] hover:text-[#ffb1c1] transition-colors block"
                      >
                        My Account
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="font-body text-label-bold uppercase tracking-widest text-[#e1bec3] hover:text-[#ffb1c1] transition-colors block"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="font-body text-label-bold uppercase tracking-widest text-[#e1bec3] hover:text-[#ffb1c1] transition-colors block"
                    >
                      Login
                    </Link>
                  )}
                </li>
              </ul>

              {/* CTA at bottom */}
              <Link
                href="/shop"
                onClick={() => setMobileOpen(false)}
                className="mt-auto font-display text-headline-md uppercase text-center bg-[#c41e5c] text-white py-4 px-6 tracking-wider hover:bg-[#90003e] transition-colors"
              >
                SHOP NOW
              </Link>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
