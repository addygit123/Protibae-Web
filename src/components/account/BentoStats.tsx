'use client';

import { ShoppingBag, Truck, IndianRupee, Medal } from 'lucide-react';

interface BentoStatsProps {
  totalOrders: number;
  totalSpent: number;
  pendingOrders: number;
  deliveredOrders: number;
}

export function BentoStats({
  totalOrders,
  totalSpent,
  pendingOrders,
  deliveredOrders,
}: BentoStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <div className="bg-surface-container border-outline-variant/10 group hover:border-primary/50 flex flex-col items-center justify-center rounded-xl border p-6 text-center transition-all">
        <ShoppingBag className="text-primary mb-2 h-8 w-8 transition-transform group-hover:scale-110" />
        <p className="font-display-hero text-headline-md leading-none">
          {totalOrders}
        </p>
        <p className="text-on-surface-variant font-label-bold mt-1 text-[10px] tracking-widest uppercase">
          Total Orders
        </p>
      </div>

      <div className="bg-surface-container border-outline-variant/10 group hover:border-primary/50 flex flex-col items-center justify-center rounded-xl border p-6 text-center transition-all">
        <IndianRupee className="text-primary mb-2 h-8 w-8 transition-transform group-hover:scale-110" />
        <p className="font-display-hero text-headline-md leading-none">
          ₹{Math.round(totalSpent)}
        </p>
        <p className="text-on-surface-variant font-label-bold mt-1 text-[10px] tracking-widest uppercase">
          Total Spent
        </p>
      </div>

      <div className="bg-surface-container border-outline-variant/10 group hover:border-primary/50 flex flex-col items-center justify-center rounded-xl border p-6 text-center transition-all">
        <Truck className="text-primary mb-2 h-8 w-8 transition-transform group-hover:scale-110" />
        <p className="font-display-hero text-headline-md leading-none">
          {pendingOrders}
        </p>
        <p className="text-on-surface-variant font-label-bold mt-1 text-[10px] tracking-widest uppercase">
          Pending
        </p>
      </div>

      <div className="bg-surface-container border-outline-variant/10 group hover:border-primary/50 flex flex-col items-center justify-center rounded-xl border p-6 text-center transition-all">
        <Medal className="text-primary mb-2 h-8 w-8 transition-transform group-hover:scale-110" />
        <p className="font-display-hero text-headline-md text-primary leading-none">
          {deliveredOrders}
        </p>
        <p className="text-on-surface-variant font-label-bold mt-1 text-[10px] tracking-widest uppercase">
          Delivered
        </p>
      </div>
    </div>
  );
}
