'use client';

import { useHydration } from '@/hooks/useHydration';
import { Lock } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { useRouter } from 'next/navigation';
import { isStoreLive } from '@/lib/store-config';
import { CheckoutBlockedBanner } from '@/components/store-mode/CheckoutBlockedBanner';

export function OrderSummary() {
  const isMounted = useHydration();
  const { getCartTotal, getCartItemCount } = useCartStore();
  const router = useRouter();

  const subtotal = getCartTotal();
  const itemCount = getCartItemCount();

  // Example logic: discount of 20% applied automatically or mock
  const originalSubtotal = Math.round(subtotal * 1.2);
  const discount = originalSubtotal - subtotal;
  const isFreeShipping = subtotal > 499;
  const shipping = isFreeShipping ? 0 : 250;
  const total = subtotal + shipping;

  if (!isMounted || itemCount === 0) return null;

  return (
    <aside className="space-y-6">
      <div className="rounded-lg border border-[#594045]/20 bg-[#1e1f23] p-8 shadow-xl">
        <h2 className="font-display-hero mb-8 text-3xl tracking-tight text-[#e3e2e7] uppercase">
          ORDER SUMMARY
        </h2>

        <div className="mb-8 space-y-4">
          <div className="flex justify-between">
            <span className="text-[#e1bec3]">Subtotal ({itemCount} items)</span>
            <span className="font-bold text-[#e3e2e7]">
              ₹{originalSubtotal}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#c41e5c]">Discount</span>
            <span className="font-bold text-[#c41e5c]">-₹{discount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#e1bec3]">Shipping</span>
            {isFreeShipping ? (
              <span className="text-sm font-bold text-[#ffb1c1] uppercase">
                FREE
              </span>
            ) : (
              <span className="font-bold text-[#e3e2e7]">₹{shipping}</span>
            )}
          </div>
        </div>

        <div className="mb-4 border-t border-[#594045]/30 pt-6">
          <div className="flex items-center justify-between">
            <span className="font-display-hero text-2xl tracking-tight text-[#e3e2e7] uppercase">
              TOTAL
            </span>
            <span className="font-display-hero text-4xl tracking-tight text-[#ffb1c1]">
              ₹{total}
            </span>
          </div>
          <p className="mt-2 text-[10px] font-bold tracking-widest text-[#ffb1c1] uppercase">
            You save ₹{discount} on this order!
          </p>
        </div>

        {isStoreLive ? (
          <button
            className="mt-8 flex w-full items-center justify-center space-x-3 rounded-lg bg-[#c41e5c] py-5 text-white transition-all duration-150 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(196,30,92,0.3)] active:scale-[0.98]"
            onClick={() => router.push('/checkout')}
          >
            <Lock fill="currentColor" size={20} />
            <span className="font-label-bold text-lg font-bold tracking-[0.2em] uppercase">
              PROCEED TO CHECKOUT
            </span>
          </button>
        ) : (
          <div className="mt-8">
            <CheckoutBlockedBanner />
          </div>
        )}
        <div className="mt-8">
          <p className="mb-4 text-center text-[10px] font-bold tracking-widest text-[#e1bec3] uppercase">
            WE ACCEPT
          </p>
          <div className="flex items-center justify-center space-x-4 opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0">
            <div className="text-sm font-bold text-[#e3e2e7]">VISA</div>
            <div className="text-sm font-bold text-[#e3e2e7]">MasterCard</div>
            <div className="text-sm font-bold text-[#e3e2e7]">UPI</div>
            <div className="text-sm font-bold text-[#e3e2e7]">RuPay</div>
          </div>
        </div>
      </div>

      {/* Trust Points */}
      <div className="mt-10 space-y-4 border-t border-[#594045]/30 pt-8">
        <div className="flex items-center space-x-3 text-xs">
          <span
            className="material-symbols-outlined text-[#c41e5c]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            stars
          </span>
          <span className="text-[#e1bec3]">
            Earn{' '}
            <strong className="text-[#e3e2e7]">
              {Math.round(total * 0.1)} Reward Points
            </strong>{' '}
            on this order
          </span>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <span className="material-symbols-outlined text-[#c41e5c]">
            inventory_2
          </span>
          <span className="text-[#e1bec3]">
            <strong className="text-[#e3e2e7]">Secure Packaging</strong> - No
            damage, always.
          </span>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <span className="material-symbols-outlined text-[#c41e5c]">
            verified
          </span>
          <span className="text-[#e1bec3]">
            <strong className="text-[#e3e2e7]">Quality You Can Trust</strong> -
            Clean ingredients.
          </span>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <span
            className="material-symbols-outlined text-[#c41e5c]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            bolt
          </span>
          <span className="text-[#e1bec3]">
            <strong className="text-[#e3e2e7]">Fuel That Hits Different</strong>{' '}
            - High protein results.
          </span>
        </div>
      </div>
    </aside>
  );
}
