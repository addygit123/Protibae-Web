import { Wrench } from 'lucide-react';

/**
 * Full-page maintenance view — shown for public users when STORE_MODE=maintenance.
 * Admin routes bypass this entirely via middleware.
 */
export function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#121317] flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center space-y-10">
        {/* Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#ffb1c1]/20 bg-[#ffb1c1]/5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffb1c1] opacity-50" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ffb1c1]" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#ffb1c1]">Under Maintenance</span>
          </div>
        </div>

        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-2xl bg-[#1a1b1f] border border-[#343539] flex items-center justify-center shadow-[0_0_40px_rgba(255,177,193,0.08)]">
            <Wrench className="text-[#ffb1c1]" size={40} />
          </div>
        </div>

        {/* Headline */}
        <div className="space-y-4">
          <h1 className="font-display-hero text-[52px] leading-none uppercase tracking-tight text-[#e3e2e7]">
            WE&apos;RE MAKING<br />
            <span className="text-[#ffb1c1]">IMPROVEMENTS</span>
          </h1>
          <p className="text-[#e1bec3] text-lg leading-relaxed max-w-sm mx-auto">
            We&apos;ll be back shortly. Thanks for your patience.
          </p>
        </div>

        {/* Footer */}
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#343539]">
          PROTIBAE — Performance Nutrition
        </p>
      </div>
    </div>
  );
}
