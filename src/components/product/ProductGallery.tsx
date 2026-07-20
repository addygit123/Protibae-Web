'use client';

import { useState } from 'react';
import { ProductImage } from '@/components/shared/ProductImage';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product } from '@/config/products';

interface ProductGalleryProps {
  product: Product;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const images = product.gallery || [{ src: product.image, alt: product.imageAlt }];
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative group flex flex-col gap-4">
      {/* Main Image Canvas */}
      <div className="bg-[#1a1b1f] rounded-xl aspect-[4/5] md:aspect-square overflow-hidden flex items-center justify-center border border-[#594045]/30 relative">
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 transition-all z-20"
              aria-label="Previous image"
            >
              <ChevronLeft className="text-white" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 transition-all z-20"
              aria-label="Next image"
            >
              <ChevronRight className="text-white" />
            </button>
          </>
        )}

        {/* Main Image */}
        <div className="w-4/5 h-4/5 relative drop-shadow-[0_0_15px_rgba(196,30,92,0.3)]">
          <ProductImage
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain transform group-hover:scale-105 transition-transform duration-700"
            priority
          />
        </div>

        {/* Floating Badges */}
        <div className="absolute bottom-8 left-8 flex flex-col gap-2 z-10">
          {product.badges.map((badge) => (
            <span
              key={badge.label}
              className={cn(
                'text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-sm w-fit',
                badge.variant === 'primary' && 'bg-[#c41e5c] text-white',
                badge.variant === 'secondary' && 'bg-[#454747] text-[#c6c6c7]',
                badge.variant === 'accent' && 'bg-black/60 backdrop-blur-md text-[#ffb1c1] border border-[#ffb1c1]/20',
                badge.variant === 'inverse' && 'bg-[#b81154] text-white'
              )}
            >
              {badge.label}
            </span>
          ))}
        </div>

        {/* Dots (Mobile mainly or secondary view) */}
        {images.length > 1 && (
          <div className="absolute bottom-8 right-8 flex gap-2 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={cn(
                  'w-3 h-3 rounded-full transition-all',
                  idx === currentIndex
                    ? 'bg-[#c41e5c] ring-2 ring-[#ffb1c1] ring-offset-4 ring-offset-[#1a1b1f]'
                    : 'bg-[#594045] hover:bg-[#a8898e]'
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                'relative w-24 h-24 rounded-lg overflow-hidden border-2 shrink-0 transition-all bg-[#1a1b1f]',
                idx === currentIndex
                  ? 'border-[#c41e5c] opacity-100'
                  : 'border-[#594045]/30 opacity-60 hover:opacity-100 hover:border-[#a8898e]'
              )}
            >
              <ProductImage
                src={img.src}
                alt={`Thumbnail ${idx + 1}`}
                fill
                sizes="96px"
                className="object-contain p-2"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
