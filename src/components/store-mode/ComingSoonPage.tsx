import { Rocket, ArrowRight } from 'lucide-react';
import Link from 'next/link';

/**
 * Full-page coming soon view — shown at /checkout when store is not live.
 */
export function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-[#121317] flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center space-y-10">
        {/* Animated badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#c41e5c]/40 bg-[#c41e5c]/10">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffb1c1] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#c41e5c]" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#ffb1c1]">Launching Soon</span>
          </div>
        </div>

        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-2xl bg-[#1a1b1f] border border-[#594045]/40 flex items-center justify-center shadow-[0_0_40px_rgba(196,30,92,0.15)]">
            <Rocket className="text-[#c41e5c]" size={40} />
          </div>
        </div>

        {/* Headline */}
        <div className="space-y-4">
          <h1 className="font-display-hero text-[56px] leading-none uppercase tracking-tight text-[#e3e2e7]">
            CHECKOUT<br />
            <span className="text-[#c41e5c]">OPENING</span><br />
            SOON
          </h1>
          <p className="text-[#e1bec3] text-lg leading-relaxed max-w-sm mx-auto">
            PROTIBAE is almost ready to ship. Our store is launching very soon. Browse our products in the meantime.
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-[#343539]" />
          <span className="text-[10px] font-bold tracking-widest text-[#594045] uppercase">In the meantime</span>
          <div className="flex-1 h-px bg-[#343539]" />
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-[#c41e5c] text-white rounded-lg font-label-bold uppercase tracking-[0.15em] hover:shadow-[0_0_20px_rgba(196,30,92,0.4)] hover:scale-[1.02] transition-all"
          >
            Browse Products <ArrowRight size={16} />
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-8 py-4 border border-[#343539] text-[#e1bec3] rounded-lg font-label-bold uppercase tracking-[0.15em] hover:border-[#594045] hover:text-[#e3e2e7] transition-all"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
