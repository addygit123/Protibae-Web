import Image from 'next/image';
import { Zap, Heart, Leaf, Dumbbell } from 'lucide-react';
import { BenefitsAnimations } from './BenefitsAnimations';

/**
 * BenefitsSection — Server Component
 * Stitch: "BUILT DIFFERENT. FOR A DIFFERENT YOU." bento grid section.
 * Dark surface-container-lowest bg (#0d0e12).
 * 4-column bento: 2×2 large card + 2 small + 1 wide CTA card.
 */
export function BenefitsSection() {
  return (
    <section
      className="py-[120px] px-6 bg-[#0d0e12]"
      aria-labelledby="benefits-heading"
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Heading */}
        <div className="text-center mb-20 space-y-4">
          <h2
            id="benefits-heading"
            className="text-headline-lg uppercase"
          >
            BUILT DIFFERENT.{' '}
            <em className="text-[#c41e5c] not-italic">FOR A DIFFERENT YOU.</em>
          </h2>
          <p className="text-body-lg text-[#e1bec3] max-w-2xl mx-auto">
            Honest performance nutrition made from real ingredients to power
            your daily grind without the junk.
          </p>
        </div>

        {/* Bento Grid */}
        <BenefitsAnimations>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Large card — 2×2 */}
            <div className="col-span-1 md:col-span-2 row-span-2 bg-[#1a1b1f] border border-[#594045]/30 p-10 flex flex-col justify-between group hover:border-[#c41e5c]/50 transition-all duration-300">
              <div className="space-y-4">
                <Zap
                  size={48}
                  className="text-[#c41e5c] fill-[#c41e5c]"
                  aria-hidden="true"
                />
                <h3 className="text-headline-md uppercase">
                  13G HIGH PROTEIN CORE
                </h3>
                <p className="text-body-md text-[#e1bec3]">
                  Powered by premium whey and plant-based blends for maximum
                  bioavailability and muscle recovery.
                </p>
              </div>
              <div className="mt-8 relative w-full h-64 overflow-hidden">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmQ6ZgAs5aVYM8UoGsfRxqfPNkBkK0gW-CypByHIe7-IQEF2hnmyhXcQ7TTaMRHi9_ddt1hL4gCcyhS64GgA1gOHCaEqtWTgYQbU1bp50R_nspBKhj4xufXrjw42iDZMZ_YnpeNh_8LUbwyWzr-BNoII-oTkMmHzkiJ5pHyTZMEfw1tbcpn6AIFHKJC1urAK5n8SGCg174e1234PJZ_6sOXZMspg_SBlaryzZ8Zs4gukLpM-QtLUM6EiNWPff3885q1UjqmSGcve0"
                  alt="PROTIBAE protein bar broken in half showing dense texture and protein crisps"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Small card 1 */}
            <div className="bg-[#292a2e] border border-[#594045]/30 p-8 flex flex-col items-center text-center space-y-4 hover:bg-[#343539] transition-colors duration-300">
              <Heart
                size={40}
                className="text-[#c41e5c] fill-[#c41e5c]"
                aria-hidden="true"
              />
              <h4 className="font-body text-label-bold text-[18px] uppercase tracking-wider">
                ZERO ADDED SUGAR
              </h4>
              <p className="text-label-sm text-[#e1bec3]">
                Naturally sweetened with stevia and monk fruit. No hidden
                syrups or chemicals.
              </p>
            </div>

            {/* Small card 2 */}
            <div className="bg-[#292a2e] border border-[#594045]/30 p-8 flex flex-col items-center text-center space-y-4 hover:bg-[#343539] transition-colors duration-300">
              <Leaf
                size={40}
                className="text-[#c41e5c] fill-[#c41e5c]"
                aria-hidden="true"
              />
              <h4 className="font-body text-label-bold text-[18px] uppercase tracking-wider">
                REAL INGREDIENTS
              </h4>
              <p className="text-label-sm text-[#e1bec3]">
                Bajra crunch, almond meal, and cocoa solids. No palm oil or
                fillers.
              </p>
            </div>

            {/* Wide CTA card — spans 2 cols */}
            <div className="md:col-span-2 bg-[#c41e5c] text-white p-10 flex items-center justify-between overflow-hidden relative group">
              <div className="relative z-10 space-y-4 max-w-[60%]">
                <h3 className="text-headline-md uppercase">
                  EVERY VERSION OF YOU.
                </h3>
                <p className="text-body-md opacity-90">
                  From the early morning sets to the midnight oil—Protibae is
                  the fuel that keeps you pushing.
                </p>
              </div>
              <Dumbbell
                size={120}
                className="absolute -right-4 -bottom-4 opacity-20 group-hover:scale-110 transition-transform duration-500 text-white"
                aria-hidden="true"
              />
            </div>
          </div>
        </BenefitsAnimations>
      </div>
    </section>
  );
}
