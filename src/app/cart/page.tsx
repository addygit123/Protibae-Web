import { ShieldCheck, Truck, RefreshCw, HeadphonesIcon } from 'lucide-react';
import { CartList } from '@/components/cart/CartList';
import { OrderSummary } from '@/components/cart/OrderSummary';
import { FreeShippingProgress } from '@/components/cart/FreeShippingProgress';
import { SectionReveal } from '@/components/sections/SectionReveal';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Cart',
  description: 'Review your PROTIBAE cart and proceed to checkout.',
  robots: { index: false, follow: false },
};


export default function CartPage() {
  return (
    <div className="min-h-screen bg-[#121317]">
      <main className="pt-32 pb-[120px] px-6 max-w-[1280px] mx-auto">
        <SectionReveal>
          {/* Header Section */}
          <div className="mb-12">
            <h1 className="font-display-hero text-[64px] uppercase tracking-tighter mb-2 text-[#e3e2e7] leading-none">YOUR CART</h1>
            <div className="inline-block bg-[#c41e5c] px-4 py-1 -skew-x-[12deg] mb-6">
              <p className="font-display-hero text-[#ffdee3] italic uppercase tracking-wider text-xl skew-x-[12deg]">Good choices. Even better results.</p>
            </div>
            <p className="text-[#e1bec3] max-w-md">Review your items, update quantities and proceed to checkout.</p>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 py-8 border-y border-[#594045]/20">
            <div className="flex items-center space-x-4">
              <div className="text-[#c41e5c]"><ShieldCheck size={36} /></div>
              <div className="text-xs font-label-bold font-bold uppercase tracking-tighter text-[#e1bec3]">100% SECURE<br/>PAYMENT</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-[#c41e5c]"><Truck size={36} /></div>
              <div className="text-xs font-label-bold font-bold uppercase tracking-tighter text-[#e1bec3]">FAST & RELIABLE<br/>DELIVERY</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-[#c41e5c]"><RefreshCw size={36} /></div>
              <div className="text-xs font-label-bold font-bold uppercase tracking-tighter text-[#e1bec3]">7 DAY EASY<br/>RETURNS</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-[#c41e5c]"><HeadphonesIcon size={36} /></div>
              <div className="text-xs font-label-bold font-bold uppercase tracking-tighter text-[#e1bec3]">CUSTOMER<br/>SUPPORT</div>
            </div>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <CartList />
            <OrderSummary />
          </div>
        </SectionReveal>

        <div className="mt-8 animate-slide-up">
          <FreeShippingProgress />
        </div>

      </main>
    </div>
  );
}
