'use client';

import { Rocket } from 'lucide-react';

/**
 * Shown in place of Add To Cart / Buy Now buttons when the store is in coming-soon mode.
 * Keeps the premium PROTIBAE design language.
 */
export function ComingSoonBanner() {
  return (
    <div className="space-y-4">
      {/* Status badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#c41e5c]/40 bg-[#c41e5c]/10">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffb1c1] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c41e5c]" />
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ffb1c1]">Launching Soon</span>
      </div>

      {/* Coming soon CTA block */}
      <div className="rounded-xl border border-[#594045]/40 bg-[#1a1b1f] p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#c41e5c]/10 border border-[#c41e5c]/20 flex items-center justify-center">
            <Rocket className="text-[#ffb1c1]" size={20} />
          </div>
          <div>
            <p className="font-display-hero text-[#e3e2e7] text-lg uppercase tracking-tight leading-tight">
              PROTIBAE IS ALMOST HERE
            </p>
            <p className="text-[#e1bec3] text-sm mt-1 leading-relaxed">
              We&apos;re putting the final touches on something special. Orders will open very soon.
            </p>
          </div>
        </div>

        {/* Disabled button — visual only */}
        <div
          aria-disabled="true"
          className="w-full flex items-center justify-center gap-3 py-4 rounded-lg bg-[#292a2e] border border-[#343539] cursor-not-allowed"
        >
          <span className="font-label-bold text-[#594045] uppercase tracking-[0.2em] text-sm">Add To Cart</span>
          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#c41e5c]/20 text-[#ffb1c1] border border-[#c41e5c]/30">Coming Soon</span>
        </div>
      </div>
    </div>
  );
}
