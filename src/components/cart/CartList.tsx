'use client';

import Link from 'next/link';
import { ArrowRight, Ticket } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { CartItem } from '@/components/cart/CartItem';
import { useHydration } from '@/hooks/useHydration';

export function CartList() {
  const isMounted = useHydration();
  const { items } = useCartStore();

  if (!isMounted || items.length === 0) {
    return (
      <div className="lg:col-span-2 space-y-8 flex flex-col items-center justify-center py-20 border border-[#594045]/20 rounded-lg bg-[#1a1b1f]/50">
        <h2 className="font-display-hero text-3xl uppercase text-[#e3e2e7] mb-2">Your Cart is Empty</h2>
        <p className="text-[#e1bec3] mb-6">Looks like you haven&apos;t added any premium fuel yet.</p>
        <Link 
          href="/shop"
          className="bg-[#c41e5c] text-white px-8 py-3.5 font-label-bold uppercase tracking-widest hover:shadow-[0_0_15px_rgba(196,30,92,0.5)] transition-all"
        >
          START SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 space-y-8">
      {/* Table Header (Desktop only) */}
      <div className="hidden md:grid grid-cols-6 pb-4 border-b border-[#594045] font-label-bold text-label-bold uppercase tracking-widest text-[#e1bec3]">
        <div className="col-span-3">PRODUCT</div>
        <div className="text-right">PRICE</div>
        <div className="text-center">QUANTITY</div>
        <div className="text-right">TOTAL</div>
      </div>

      {/* Cart Items */}
      <div className="space-y-0">
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      {/* Coupon and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-8 gap-6 border-t border-[#594045]/20">
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c41e5c]" size={20} />
            <input 
              className="w-full bg-[#1e1f23] border border-[#594045] focus:border-[#c41e5c] focus:ring-1 focus:ring-[#c41e5c] pl-10 pr-4 py-3 text-sm text-[#e3e2e7] outline-none" 
              placeholder="Enter coupon code" 
              type="text"
            />
          </div>
          <button className="bg-[#c41e5c] hover:bg-[#90003e] transition-colors text-white px-8 py-3.5 font-label-bold uppercase tracking-widest hover:shadow-[0_0_15px_rgba(196,30,92,0.3)]">
            APPLY
          </button>
        </div>
        <Link 
          href="/shop"
          className="flex items-center text-[#c41e5c] font-label-bold uppercase tracking-widest hover:translate-x-[-4px] transition-transform"
        >
          <ArrowRight className="mr-2 rotate-180" size={20} /> CONTINUE SHOPPING
        </Link>
      </div>
    </div>
  );
}
