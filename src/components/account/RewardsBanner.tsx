'use client';

import { Zap } from 'lucide-react';

export function RewardsBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-surface-container-high border border-primary/20 p-8 shadow-[0_0_30px_rgba(196,30,92,0.1)]">
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center border border-primary/40">
            <Zap className="w-8 h-8 text-primary fill-primary" />
          </div>
          <div>
            <p className="text-xs font-label-bold uppercase tracking-widest text-on-surface-variant">YOU EARNED IT.</p>
            <h3 className="font-display-hero text-headline-lg text-primary leading-none mt-1">320 POINTS</h3>
            <p className="text-on-surface-variant mt-1">Keep going! Great things await you.</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="text-center bg-surface-container-highest p-3 rounded-xl border border-outline-variant/30 min-w-[100px] grayscale opacity-60">
            <p className="text-[10px] font-bold text-on-surface-variant">100 Points</p>
            <p className="text-sm font-bold mt-1">₹50 OFF</p>
          </div>
          
          <div className="text-center bg-surface-container-highest p-3 rounded-xl border border-outline-variant/30 min-w-[100px] grayscale opacity-60">
            <p className="text-[10px] font-bold text-on-surface-variant">250 Points</p>
            <p className="text-sm font-bold mt-1">₹125 OFF</p>
          </div>
          
          <div className="text-center bg-surface-container-highest p-3 rounded-xl border border-primary/40 min-w-[100px] shadow-lg shadow-primary/10">
            <p className="text-[10px] font-bold text-primary">500 Points</p>
            <p className="text-sm font-bold mt-1">₹300 OFF</p>
          </div>
          
          <button className="ml-4 bg-primary-container text-on-primary-container px-6 py-3 font-display-hero text-headline-md uppercase tracking-wide hover:scale-105 transition-transform">
            VIEW REWARDS
          </button>
        </div>
      </div>
      
      {/* Background aesthetic flare */}
      <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px]"></div>
    </div>
  );
}
