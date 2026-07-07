'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingBag, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product } from '@/config/products';
import { useCartStore, getPackPrice } from '@/lib/store/cart';

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  // Try to parse the base price, fallback to 909 if it fails
  const [quantity, setQuantity] = useState(1);
  const [selectedPack, setSelectedPack] = useState<'6' | '12' | '24'>('12');
  const addItem = useCartStore((state) => state.addItem);

  const handleDecrease = () => setQuantity((q) => Math.max(1, q - 1));
  const handleIncrease = () => setQuantity((q) => Math.min(10, q + 1));

  return (
    <div className="space-y-10">
      {/* Header Info */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[#c41e5c] font-body text-label-bold text-[12px] uppercase tracking-tighter">
            Only One. The One.
          </span>
        </div>
        <h1 className="text-display-hero text-[#e3e2e7] uppercase mb-2 leading-none">
          {product.name}
        </h1>
        <div className="bg-[#c41e5c] w-fit px-4 py-1 mb-6">
          <span className="text-headline-md text-white uppercase font-display-hero">
            {product.category === 'protein-bars' ? 'PROTEIN BAR' : 'PREMIUM SNACK'}
          </span>
        </div>
        <p className="text-[#e1bec3] text-body-lg mb-8 max-w-md">
          {product.description}
        </p>

        {/* Nutritional Stats */}
        <div className="grid grid-cols-3 gap-4 py-6 border-y border-[#594045]/30">
          <div className="flex flex-col">
            <span className="text-headline-md text-[#ffb1c1] font-display-hero">
              {product.badges.find(b => b.label.includes('Protein'))?.label.split(' ')[0] || '13G'}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#e1bec3]">Protein</span>
          </div>
          <div className="flex flex-col">
            <span className="text-headline-md text-[#ffb1c1] font-display-hero">6.5G</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#e1bec3]">Fiber</span>
          </div>
          <div className="flex flex-col">
            <span className="text-headline-md text-[#ffb1c1] font-display-hero">&lt;0.5G</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#e1bec3]">Added Sugar</span>
          </div>
        </div>
      </div>

      {/* Pack Selection */}
      <div>
        <label className="block font-body text-label-bold uppercase tracking-wider text-sm mb-4 text-[#e3e2e7]">
          Choose Your Pack
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(['6', '12', '24'] as const).map((pack) => {
            const isSelected = selectedPack === pack;
            const price = getPackPrice(product.price, pack);
            let discount = '';
            if (pack === '6') discount = 'SAVE 15%';
            if (pack === '12') discount = 'SAVE 22%';
            if (pack === '24') discount = 'SAVE 28%';

            return (
              <button
                key={pack}
                onClick={() => setSelectedPack(pack)}
                className={cn(
                  'flex flex-col items-center justify-center p-4 rounded-lg group transition-all border',
                  isSelected
                    ? 'border-[#c41e5c] bg-[#c41e5c]/5'
                    : 'border-[#594045] hover:border-[#ffb1c1]'
                )}
              >
                <span className={cn(
                  'text-[10px] font-bold uppercase',
                  isSelected ? 'text-[#ffb1c1]' : 'text-[#e1bec3] group-hover:text-[#ffb1c1]'
                )}>
                  PACK OF {pack}
                </span>
                <span className="text-lg font-bold text-[#e3e2e7] mt-1">₹{price}</span>
                <span className={cn(
                  'text-[10px] px-2 py-0.5 rounded-full mt-2 font-bold transition-colors',
                  isSelected
                    ? 'bg-[#c41e5c]/20 text-[#ffb1c1]'
                    : 'bg-[#c41e5c]/10 text-[#c41e5c] group-hover:bg-[#c41e5c]/20'
                )}>
                  {discount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CTA Actions */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex items-center border border-[#594045] rounded-lg px-4 h-14 bg-[#1a1b1f]">
            <button
              onClick={handleDecrease}
              className="text-[#e1bec3] hover:text-[#ffb1c1] transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={18} />
            </button>
            <input
              className="w-12 bg-transparent border-none text-center text-[#e3e2e7] focus:ring-0 font-bold"
              readOnly
              type="text"
              value={quantity}
              aria-label="Quantity"
            />
            <button
              onClick={handleIncrease}
              className="text-[#e1bec3] hover:text-[#ffb1c1] transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={18} />
            </button>
          </div>
          <button
            className={cn(
              'flex-1 bg-[#c41e5c] text-white',
              'font-display-hero text-headline-md uppercase',
              'hover:shadow-[0_0_20px_rgba(196,30,92,0.5)] transition-all active:scale-[0.98]',
              'flex items-center justify-center gap-3 rounded-lg h-14'
            )}
            onClick={() => {
              addItem(product.id, selectedPack, quantity, {
                name: product.name,
                price: product.price,
                image: product.image,
                imageAlt: product.imageAlt,
                badges: product.badges
              });
            }}
          >
            Add To Cart <ShoppingBag size={24} />
          </button>
        </div>

        {/* Guarantees */}
        <div className="grid grid-cols-3 gap-2 mt-6">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tight text-[#e1bec3]">
            <Truck className="text-[#ffb1c1]" size={16} /> Fast Delivery
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tight text-[#e1bec3]">
            <ShieldCheck className="text-[#ffb1c1]" size={16} /> Secure Checkout
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tight text-[#e1bec3]">
            <RefreshCw className="text-[#ffb1c1]" size={16} /> Easy Returns
          </div>
        </div>
      </div>
    </div>
  );
}
