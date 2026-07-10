import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product, ProductBadge } from '@/config/products';

// ─── Badge Variant Styles ─────────────────────────────────────────────────────
const badgeStyles: Record<ProductBadge['variant'], string> = {
  primary:   'bg-[#c41e5c] text-white',
  secondary: 'bg-[#454747] text-[#c6c6c7]',
  accent:    'bg-black/60 backdrop-blur-md text-[#ffb1c1] border border-[#ffb1c1]/20',
  inverse:   'bg-[#b81154] text-white',
};

interface ProductCardProps {
  product: Product;
  /** When true, the Quick Add button renders. Passed from client shell. */
  className?: string;
}

/**
 * ProductCard — Server Component
 * Matches Stitch Shop All card exactly:
 *  - 4/5 aspect-ratio image with badge overlay + hover scale
 *  - Ghost cart button appearing on group-hover (handled via Tailwind group)
 *  - Pink price, headline-md name, line-clamp description
 *  - "Quick View" link at bottom
 */
export function ProductCard({ product, className }: ProductCardProps) {
  const isComingSoon = product.isComingSoon || product.slug === '#';
  
  const CardContent = (
    <article
      className={cn(
        'group relative flex flex-col h-full',
        'bg-[#0d0e12] border border-[#594045]/20',
        'transition-all duration-500 overflow-hidden',
        !isComingSoon && 'hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(196,30,92,0.2)] cursor-pointer',
        className,
      )}
      aria-label={`Product: ${product.name}`}
    >
      {/* ── Image Block ──────────────────────────────────────────── */}
      <div className="aspect-[4/5] overflow-hidden relative bg-[#1e1f23]">
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {product.badges.map((badge) => (
            <span
              key={badge.label}
              className={cn(
                'text-[10px] font-bold tracking-tight px-3 py-1 uppercase rounded-full',
                badgeStyles[badge.variant],
              )}
            >
              {badge.label}
            </span>
          ))}
          {product.inventory === 0 ? (
            <span className="text-[10px] font-bold tracking-tight px-3 py-1 uppercase rounded-full bg-red-500 text-white shadow-sm border border-red-400">
              Out of Stock
            </span>
          ) : product.inventory <= 10 ? (
            <span className="text-[10px] font-bold tracking-tight px-3 py-1 uppercase rounded-full bg-orange-500 text-white shadow-sm border border-orange-400">
              Only {product.inventory} left
            </span>
          ) : null}
        </div>

        {/* Product Image */}
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Quick Add to Cart — appears on hover */}
        <button
          disabled={product.inventory === 0}
          aria-label={`Quick add ${product.name} to cart`}
          className={cn(
            'absolute bottom-4 right-4 z-10',
            'w-12 h-12 rounded-full',
            'flex items-center justify-center',
            'opacity-0 translate-y-4',
            'group-hover:opacity-100 group-hover:translate-y-0',
            'transition-all duration-300',
            product.inventory === 0 
              ? 'bg-[#343539] text-[#594045] cursor-not-allowed'
              : 'bg-white text-black active:scale-90'
          )}
        >
          <ShoppingCart size={18} strokeWidth={2} />
        </button>
      </div>

      {/* ── Content Block ─────────────────────────────────────────── */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Name + Price */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-headline-md text-[#e3e2e7] tracking-tight leading-none group-hover:text-[#ffb1c1] transition-colors duration-300">
            {product.name}
          </h3>
          <span className="text-label-bold text-[#ffb1c1] shrink-0 ml-2">
            ₹{product.price}/bar
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-[#e1bec3] text-body-md line-clamp-2 mb-4">
          {product.description}
        </p>

        {/* Footer: Pack info + Quick View */}
        <div className="mt-auto pt-4 border-t border-[#594045]/10 flex justify-between items-center">
          <span className="text-xs text-label-bold uppercase tracking-widest text-[#e1bec3]">
            {product.packInfo}
          </span>
          {!isComingSoon && (
            <span className="text-[#ffb1c1] text-xs font-bold uppercase tracking-widest border-b border-[#ffb1c1]/50 group-hover:border-[#ffb1c1] transition-all">
              Quick View
            </span>
          )}
        </div>
      </div>
    </article>
  );

  if (isComingSoon) {
    return CardContent;
  }

  return (
    <Link 
      href={`/shop/${product.slug}`} 
      className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-[#c41e5c] rounded-lg"
    >
      {CardContent}
    </Link>
  );
}
