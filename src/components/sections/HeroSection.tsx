import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Zap, Leaf } from 'lucide-react';
import { HeroAnimations } from './HeroAnimations';

/**
 * HeroSection — Server Component (static content, images, layout)
 * Animations delegated to HeroAnimations client boundary.
 *
 * Matches Stitch Landing Page Hero exactly:
 * - Left: overline, display headline, body, CTA, stat badges
 * - Right: product image with floating animation + radial glow
 */
export function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden py-24 px-gutter"
      aria-label="Hero — PROTIBAE Performance Nutrition"
    >
      {/* Full Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <Image
          src="/protibae-hero-bg.png"
          alt="Hero Background"
          fill
          priority
          className="object-cover opacity-50"
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      </div>

      <div className="container-max w-full relative z-10">
        <div className="max-w-2xl">
          <HeroAnimations>
            {/* Promo offer badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#c41e5c]/15 border border-[#c41e5c]/40 text-[#ffb1c1] text-xs font-bold uppercase tracking-wider rounded-full mb-6 max-w-max shadow-[0_0_15px_rgba(196,30,92,0.15)] animate-pulse">
              🎁 FREE DELIVERY WITH PACK OF 6 FOR ₹399
            </div>

            {/* Overline */}
            <span className="block text-[#c41e5c] text-label-bold tracking-[0.2em] uppercase">
              PEANUTS. PROTEIN. PURPOSE.
            </span>

            {/* H1 */}
            <h1 className="text-display-hero uppercase leading-none mt-2">
              PURE{' '}
              <em className="text-[#c41e5c] not-italic">PROTEIN</em>
              <br />
              CLEAN INGREDIENTS
              <br />
              <span className="glow-text-primary">BOLD FLAVOR</span>
            </h1>

            {/* Body */}
            <p className="text-body-lg text-[#e1bec3] max-w-lg mt-4">
              PROTIBAE wasn&apos;t just another protein bar idea. It was born out
              of a simple frustration—snacks were either tasty but unhealthy, or
              healthy but tasted like compromise. We knew you deserved better. Get our
              signature Choco Peanut pack of 6 for just ₹399 with free nationwide delivery.
            </p>

            {/* CTA */}
            <div className="flex flex-wrap gap-6 pt-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#c41e5c] text-white font-display text-headline-md px-10 py-4 uppercase tracking-wider hover:bg-[#90003e] transition-all duration-300 glow-primary"
              >
                SHOP NOW
                <ArrowRight size={20} strokeWidth={2} aria-hidden="true" />
              </Link>
            </div>

            {/* Stat Badges */}
            <div className="flex gap-8 border-t border-[#594045]/30 pt-8 mt-12">
              <div className="flex items-center gap-3">
                <Zap
                  size={24}
                  className="text-[#c41e5c] fill-[#c41e5c]"
                  aria-hidden="true"
                />
                <div>
                  <div className="text-label-bold text-white uppercase">
                    13G PROTEIN
                  </div>
                  <div className="text-label-sm text-[#e1bec3]">
                    Fuel your hustle
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Leaf
                  size={24}
                  className="text-[#c41e5c] fill-[#c41e5c]"
                  aria-hidden="true"
                />
                <div>
                  <div className="text-label-bold text-white uppercase">
                    &lt;0.5G SUGAR
                  </div>
                  <div className="text-label-sm text-[#e1bec3]">
                    No crash involved
                  </div>
                </div>
              </div>
            </div>
          </HeroAnimations>
        </div>
      </div>
    </section>
  );
}
