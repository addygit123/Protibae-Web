'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingBag, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product } from '@/config/products';
import { useCartStore, getPackPrice } from '@/lib/store/cart';
import { trackProductView, trackAddToCart } from '@/lib/analytics/events';
import { useEffect } from 'react';

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedPack, setSelectedPack] = useState<'1' | '6'>('1');
  const addItem = useCartStore((state) => state.addItem);

  // Dynamic price based on selected pack
  const displayPrice = selectedPack === '1' ? product.price : (product.price6 ?? product.price * 6);

  const barsPerPack = Number(selectedPack);
  const maxQuantity = Math.floor(product.inventory / barsPerPack);
  const outOfStock = maxQuantity <= 0;

  useEffect(() => {
    trackProductView({
      currency: 'INR',
      value: displayPrice,
      items: [
        {
          id: product.id,
          name: product.name,
          price: displayPrice,
          brand: 'PROTIBAE',
          category: product.category,
        },
      ],
    });
  }, [product, displayPrice]);

  const handleDecrease = () => setQuantity((q) => Math.max(1, q - 1));

  const handleIncrease = () => {
    setQuantity((q) => Math.min(maxQuantity || 1, q + 1));
  };

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
        <span className="font-display text-headline-md tracking-widest text-[#ffb1c1]">
          ₹{displayPrice}
        </span>
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
        <div className="flex items-center justify-between mb-4">
          <label className="block font-body text-label-bold uppercase tracking-wider text-sm text-[#e3e2e7]">
            Choose Your Pack
          </label>
          {outOfStock ? (
            <span className="text-[10px] font-bold px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded uppercase tracking-widest">
              Out of Stock
            </span>
          ) : product.inventory <= 10 ? (
            <span className="text-[10px] font-bold px-2 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded uppercase tracking-widest">
              Only {product.inventory} bars left
            </span>
          ) : null}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {(['1', '6'] as const).map((pack) => {
            const isSelected = selectedPack === pack;
            const price = getPackPrice(product.price, product.price6, pack);
            let discount = '';
            if (pack === '6') discount = 'SAVE 15%'; // mock discount string for UI

            const maxForPack = Math.floor(product.inventory / Number(pack));
            const isPackOutOfStock = maxForPack <= 0;

            return (
              <button
                key={pack}
                disabled={isPackOutOfStock}
                onClick={() => {
                  setSelectedPack(pack);

                  if (quantity > maxForPack && maxForPack > 0) {
                    setQuantity(maxForPack);
                  }
                }}
                className={cn(
                  'flex flex-col items-center justify-center p-4 rounded-lg group transition-all border relative overflow-hidden',
                  isSelected
                    ? 'border-[#c41e5c] bg-[#c41e5c]/5'
                    : 'border-[#594045] hover:border-[#ffb1c1]',
                  isPackOutOfStock && 'opacity-50 cursor-not-allowed border-[#343539] hover:border-[#343539]'
                )}
              >
                <span className={cn(
                  'text-[10px] font-bold uppercase',
                  isSelected ? 'text-[#ffb1c1]' : 'text-[#e1bec3] group-hover:text-[#ffb1c1]',
                  isPackOutOfStock && 'text-[#594045] group-hover:text-[#594045]'
                )}>
                  {pack === '1' ? 'SINGLE BAR' : 'PACK OF 6'}
                </span>
                <span className={cn(
                  "text-lg font-bold mt-1",
                  isPackOutOfStock ? "text-[#594045]" : "text-[#e3e2e7]"
                )}>₹{price}</span>
                <span className={cn(
                  'text-[10px] px-2 py-0.5 rounded-full mt-2 font-bold transition-colors',
                  isSelected
                    ? 'bg-[#c41e5c]/20 text-[#ffb1c1]'
                    : 'bg-[#c41e5c]/10 text-[#c41e5c] group-hover:bg-[#c41e5c]/20',
                  isPackOutOfStock && 'bg-[#343539] text-[#594045] group-hover:bg-[#343539]',
                  !discount && 'opacity-0' // hide if no discount
                )}>
                  {isPackOutOfStock ? 'UNAVAILABLE' : discount || 'NONE'}
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
              disabled={outOfStock}
              className={cn("transition-colors", outOfStock ? "text-[#594045] cursor-not-allowed" : "text-[#e1bec3] hover:text-[#ffb1c1]")}
              aria-label="Decrease quantity"
            >
              <Minus size={18} />
            </button>
            <input
              className="w-12 bg-transparent border-none text-center text-[#e3e2e7] focus:ring-0 font-bold"
              readOnly
              type="text"
              value={outOfStock ? 0 : quantity}
              aria-label="Quantity"
            />
            <button
              onClick={handleIncrease}
              disabled={outOfStock || quantity >= maxQuantity}
              className={cn("transition-colors", (outOfStock || quantity >= maxQuantity) ? "text-[#594045] cursor-not-allowed" : "text-[#e1bec3] hover:text-[#ffb1c1]")}
              aria-label="Increase quantity"
            >
              <Plus size={18} />
            </button>
          </div>
          <button
            disabled={outOfStock}
            className={cn(
              'flex-1 text-white',
              'font-display-hero text-headline-md uppercase',
              'flex items-center justify-center gap-3 rounded-lg h-14 transition-all',
              outOfStock 
                ? 'bg-[#343539] text-[#594045] cursor-not-allowed' 
                : 'bg-[#c41e5c] hover:shadow-[0_0_20px_rgba(196,30,92,0.5)] active:scale-[0.98]'
            )}
            onClick={() => {
              addItem(product.id, selectedPack, quantity, {
                name: product.name,
                price: product.price,
                image: product.image,
                imageAlt: product.imageAlt,
                badges: product.badges,
                inventory: product.inventory
              });

              trackAddToCart({
                currency: 'INR',
                value: displayPrice * quantity,
                items: [
                  {
                    id: product.id,
                    name: product.name,
                    price: displayPrice,
                    quantity,
                    brand: 'PROTIBAE',
                    category: product.category,
                    variant: selectedPack === '1' ? 'Single Bar' : 'Pack of 6',
                  },
                ],
              });
            }}
          >
            {outOfStock ? 'Out of Stock' : 'Add To Cart'} <ShoppingBag size={24} />
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
