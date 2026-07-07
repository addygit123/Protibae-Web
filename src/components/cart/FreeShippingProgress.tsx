'use client';

import { Truck, Zap } from 'lucide-react';
import { useHydration } from '@/hooks/useHydration';
import { useCartStore } from '@/lib/store/cart';

const FREE_SHIPPING_THRESHOLD = 499;

export function FreeShippingProgress() {
  const isMounted = useHydration();
  const { getCartTotal, items } = useCartStore();
  
  if (!isMounted || items.length === 0) return null;

  const total = getCartTotal();
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const percentage = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);
  const isFree = percentage === 100;

  return (
    <div className="mt-20 p-10 bg-[#1a1b1f] rounded-lg border-2 border-[#c41e5c]/20 relative overflow-hidden group">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        
        {/* Left Status */}
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 rounded-full bg-[#c41e5c] flex items-center justify-center shadow-[0_0_15px_rgba(196,30,92,0.5)] animate-pulse shrink-0">
            <Zap className="text-white" size={32} fill="currentColor" />
          </div>
          <div>
            {isFree ? (
              <>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e1bec3] mb-1">CONGRATULATIONS!</p>
                <h3 className="font-display-hero text-4xl uppercase italic text-[#ffb1c1]">YOU&apos;VE UNLOCKED FREE SHIPPING!</h3>
                <p className="text-xs text-[#e1bec3] mt-2">Your premium fuel is on its way at no extra cost.</p>
              </>
            ) : (
              <>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e1bec3] mb-1">YOU&apos;RE ONLY ₹{remaining} AWAY FROM</p>
                <h3 className="font-display-hero text-4xl uppercase italic text-[#ffb1c1]">FREE SHIPPING!</h3>
                <p className="text-xs text-[#e1bec3] mt-2">Add more to your cart and save on delivery costs.</p>
              </>
            )}
          </div>
        </div>

        {/* Right Progress Bar */}
        <div className="flex-grow max-w-2xl px-0 md:px-12">
          <div className="relative w-full h-4 bg-[#343539] rounded-full overflow-hidden mb-2">
            <div 
              className="absolute top-0 left-0 h-full bg-[#c41e5c] shadow-[0_0_15px_rgba(196,30,92,0.5)] transition-all duration-1000 ease-out" 
              style={{ width: `${percentage}%` }}
            >
              {/* animated shine could go here */}
            </div>
            <div 
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full border-4 border-[#c41e5c] shadow-lg flex items-center justify-center transition-all duration-1000 ease-out"
              style={{ left: `${percentage}%` }}
            >
              <Truck size={12} className="text-[#c41e5c]" />
            </div>
          </div>
          <div className="flex justify-between text-[10px] font-bold text-[#e1bec3] uppercase tracking-widest">
            <span>₹0</span>
            <span className="text-[#ffb1c1]">₹{total}</span>
            <span>₹{FREE_SHIPPING_THRESHOLD}</span>
          </div>
        </div>

        <div className="text-right hidden md:block">
          <span className="text-[10px] font-bold text-[#ffb1c1] uppercase tracking-[0.3em]">
            FREE SHIPPING UNLOCKS AT ₹{FREE_SHIPPING_THRESHOLD}
          </span>
        </div>
      </div>

      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-[#c41e5c]/5 to-transparent skew-x-[-20deg] translate-x-32 group-hover:translate-x-16 transition-transform duration-1000"></div>
    </div>
  );
}
