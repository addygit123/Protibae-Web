'use client';

import { Clock, Lock } from 'lucide-react';
import Link from 'next/link';

/**
 * Replaces the Proceed to Checkout button in cart when store is not live.
 */
export function CheckoutBlockedBanner() {
  return (
    <div className="rounded-xl border border-[#594045]/40 bg-[#1a1b1f] p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#c41e5c]/10 border border-[#c41e5c]/20 flex items-center justify-center flex-shrink-0">
          <Clock className="text-[#ffb1c1]" size={18} />
        </div>
        <div>
          <p className="font-display-hero text-[#e3e2e7] text-base uppercase tracking-tight">
            Checkout Opening Soon
          </p>
          <p className="text-[#e1bec3] text-xs mt-0.5">
            Checkout will open when PROTIBAE officially launches.
          </p>
        </div>
      </div>

      {/* Disabled checkout button */}
      <button
        disabled
        aria-disabled="true"
        className="w-full flex items-center justify-center gap-3 py-4 rounded-lg bg-[#292a2e] border border-[#343539] cursor-not-allowed"
      >
        <Lock size={16} className="text-[#594045]" />
        <span className="font-label-bold text-[#594045] uppercase tracking-[0.2em] text-sm">Proceed to Checkout</span>
      </button>

      <p className="text-center text-[10px] text-[#594045] uppercase tracking-widest">
        Browse products while you wait →{' '}
        <Link href="/shop" className="text-[#ffb1c1] hover:underline transition-all">
          Shop
        </Link>
      </p>
    </div>
  );
}
