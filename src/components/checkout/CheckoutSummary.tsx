'use client';

import Image from 'next/image';
import { ShieldCheck, Truck } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { FreeShippingProgress } from '@/components/cart/FreeShippingProgress';
import { useHydration } from '@/hooks/useHydration';
import { getPackPrice } from '@/lib/store/cart';

export function CheckoutSummary() {
  const { items, getCartTotal } = useCartStore();
  const isMounted = useHydration();
  if (!isMounted) {
    return null;
  }
  const subtotal = getCartTotal();

  // Free shipping logic
  const isFreeShipping = subtotal > 499;
  const shipping = isFreeShipping ? 0 : 250;

  // Just like the cart, we might want to mock a discount or remove it. Let's keep it simple.
  const total = subtotal + shipping;

  return (
    <aside className="sticky top-28 rounded-xl border border-[#594045]/20 bg-[#292a2e]/40 p-6 shadow-2xl backdrop-blur-md">
      <h2 className="font-display text-headline-md mb-6 tracking-wide text-[#e3e2e7]">
        ORDER SUMMARY
      </h2>

      <div className="custom-scrollbar mb-8 max-h-[40vh] space-y-4 overflow-y-auto pr-2">
        {items.length === 0 ? (
          <div className="space-y-3 py-10 text-center">
            <Truck className="mx-auto text-[#594045]" size={34} />

            <h3 className="font-bold text-[#e3e2e7]">Your cart is empty</h3>

            <p className="text-sm text-[#a8898e]">
              Add a few protein bars to continue checkout.
            </p>
          </div>
        ) : (
          items.map((item) => {
            const product = item.product;
            if (!product) return null;
            const packPrice = getPackPrice(product.price, item.packSize);

            // Simplified display of price (e.g. ₹909)
            // In a real app, price should be stored as a number, but here we strip non-digits for math,
            // or rely on cart store if it gives us the item price.
            // Since `cart.ts` handles getPackPrice we don't have it directly exposed per item here,
            // but we can just use the item's unit price if we had it. Let's assume the cart store gives us `getCartTotal` accurately.

            return (
              <div key={item.id} className="flex items-center gap-4">
                <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded border border-[#594045]/30 bg-[#0d0e12] p-2">
                  <Image
                    src={product.image}
                    alt={product.imageAlt}
                    fill
                    sizes="80px"
                    className="object-contain p-2"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-[#e3e2e7] uppercase">
                    {product.name}
                  </h3>
                  <p className="text-xs tracking-wider text-[#e1bec3] uppercase">
                    {item.packSize === '6'
                      ? 'Pack of 6'
                      : item.packSize === '12'
                        ? 'Pack of 12'
                        : 'Pack of 24'}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-[#a8898e]">
                      Qty: {item.quantity}
                    </span>

                    <span className="font-bold text-[#e3e2e7]">
                      ₹{packPrice}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-4 border-t border-[#594045]/20 pt-6">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            type="text"
            placeholder="Discount code or gift card"
            className="flex-1 rounded border border-[#594045]/30 bg-[#1a1b1f] p-3 text-sm text-[#e3e2e7] focus:border-[#c41e5c] focus:outline-none"
          />
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded bg-[#343539] px-4 text-sm font-bold text-[#8a8a8a]"
          >
            Coming Soon
          </button>
        </form>
      </div>

      <div className="mt-6 space-y-3 border-t border-[#594045]/20 pt-6">
        <div className="flex justify-between text-sm">
          <span className="text-[#e1bec3]">Subtotal</span>
          <span className="text-[#e3e2e7]">₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#e1bec3]">Shipping</span>
          {isFreeShipping ? (
            <span className="font-bold tracking-widest text-green-400 uppercase">
              Free
            </span>
          ) : (
            <span className="text-[#e3e2e7]">₹{shipping}</span>
          )}
        </div>

        <div className="text-headline-md font-display mt-4 flex items-center justify-between border-t border-[#594045]/40 pt-4">
          <span className="text-[#e3e2e7]">TOTAL</span>
          <span className="text-white">₹{total}</span>
        </div>
      </div>

      <div className="mt-8">
        <FreeShippingProgress />
      </div>

      {/* Trust Badges */}
      <div className="mt-8 grid grid-cols-2 gap-4 border-t border-[#594045]/20 pt-6">
        <div className="flex flex-col items-center p-3 text-center">
          <ShieldCheck size={24} className="mb-2 text-[#c41e5c]" />
          <span className="text-[10px] font-bold tracking-tighter text-[#e1bec3] uppercase">
            100% Original
          </span>
        </div>
        <div className="flex flex-col items-center p-3 text-center">
          <Truck size={24} className="mb-2 text-[#c41e5c]" />
          <span className="text-[10px] font-bold tracking-tighter text-[#e1bec3] uppercase">
            Fast Delivery
          </span>
        </div>
      </div>
    </aside>
  );
}
