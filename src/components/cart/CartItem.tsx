'use client';

import { ProductImage } from '@/components/shared/ProductImage';
import { Trash2 } from 'lucide-react';
import { useCartStore, getPackPrice } from '@/lib/store/cart';
import type { CartItem as CartItemType } from '@/lib/store/cart';
import { cn } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const product = item.product;

  if (!product) return null;

  const price = getPackPrice(product.price, product.price6, item.packSize);
  const total = price * item.quantity;
  const originalPrice = Math.round(price * 1.2); // Mocking original price for UI
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

  const proteinBadge = product.badges.find(b => b.label.includes('Protein'))?.label || '13g Protein';
  const sugarBadge = product.badges.find(b => b.label.includes('Sugar'))?.label || '<0.5g Added Sugar';

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center pb-8 border-b border-[#594045]/20 group">
      
      {/* Product Info (Col span 3) */}
      <div className="md:col-span-3 flex items-center space-x-6">
        <div className="relative w-28 h-28 bg-[#1e1f23] rounded-lg overflow-hidden flex-shrink-0">
          <ProductImage
            src={product.image}
            alt={product.imageAlt}
            fill
            sizes="112px"
            className="object-contain p-2"
          />
        </div>
        <div>
          <h3 className="font-display-hero text-2xl uppercase tracking-tight text-[#e3e2e7]">{product.name}</h3>
          <p className="text-[#c41e5c] font-label-bold text-label-bold text-sm">
            {item.packSize === '1' ? 'Single Bar' : `Pack of ${item.packSize} Bars`}
          </p>
          <div className="flex space-x-3 mt-1">
            <span className="text-[10px] px-2 py-0.5 border border-[#594045] rounded text-[#e1bec3]">{proteinBadge}</span>
            <span className="text-[10px] px-2 py-0.5 border border-[#594045] rounded text-[#e1bec3]">{sugarBadge}</span>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="flex justify-between md:block md:text-right">
        <span className="md:hidden font-label-bold text-label-bold text-[#e1bec3]">PRICE:</span>
        <div>
          <div className="text-xl font-bold text-[#e3e2e7]">₹{price}</div>
          <div className="text-xs text-[#e1bec3] line-through">₹{originalPrice}</div>
          <div className="text-[10px] font-bold text-[#c41e5c] uppercase tracking-widest mt-1">SAVE {discount}%</div>
        </div>
      </div>

      {/* Quantity & Actions */}
      <div className="flex justify-between items-center md:flex-col md:space-y-2">
        <span className="md:hidden font-label-bold text-label-bold text-[#e1bec3]">QTY:</span>
        <div className="flex items-center bg-[#1e1f23] rounded border border-[#594045]/30">
          <button 
            className="px-3 py-1 hover:text-[#ffb1c1] transition-colors text-[#e3e2e7]"
            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
            aria-label="Decrease quantity"
          >-</button>
          <span className="px-3 py-1 font-bold text-[#e3e2e7]">{item.quantity}</span>
          <button 
            className={cn(
              "px-3 py-1 transition-colors",
              item.quantity >= Math.floor(product.inventory / Number(item.packSize))
                ? "text-[#594045] cursor-not-allowed"
                : "text-[#e3e2e7] hover:text-[#ffb1c1]"
            )}
            onClick={() => updateQuantity(item.id, Math.min(Math.floor(product.inventory / Number(item.packSize)), item.quantity + 1))}
            disabled={item.quantity >= Math.floor(product.inventory / Number(item.packSize))}
            aria-label="Increase quantity"
          >+</button>
        </div>
        {item.quantity > Math.floor(product.inventory / Number(item.packSize)) && (
           <span className="text-[10px] text-orange-400 font-bold uppercase block mt-1">
             Only {product.inventory} bars left
           </span>
        )}
        <button 
          className="flex items-center text-[10px] text-[#e1bec3] hover:text-[#ffb4ab] transition-colors"
          onClick={() => removeItem(item.id)}
        >
          <Trash2 size={14} className="mr-1" /> REMOVE
        </button>
      </div>

      {/* Total */}
      <div className="flex justify-between md:block md:text-right">
        <span className="md:hidden font-label-bold text-label-bold text-[#e1bec3]">TOTAL:</span>
        <div className="text-xl font-bold text-[#e3e2e7]">₹{total}</div>
      </div>

    </div>
  );
}
