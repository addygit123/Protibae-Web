import Image from 'next/image';
import { Check, X } from 'lucide-react';
import { SectionReveal } from './SectionReveal';

interface ComparisonRow {
  feature: string;
  protibae: string;
  typical: string;
}

const rows: ComparisonRow[] = [
  { feature: 'PROTEIN',  protibae: '13G PREMIUM',    typical: '5-8G SOY FILLER' },
  { feature: 'SUGAR',    protibae: '<0.5G',           typical: '15-20G SYRUP'    },
  { feature: 'OIL TYPE', protibae: 'ALMOND BUTTER',  typical: 'PALM/VEG OIL'    },
  { feature: 'TASTE',    protibae: 'GOURMET CHOC',   typical: 'CHALKY/WAXY'     },
];

/**
 * ComparisonSection — Server Component
 * Stitch: "HOW WE STACK UP" two-column comparison with circular product image.
 */
export function ComparisonSection() {
  return (
    <section
      className="py-[120px] px-6 overflow-hidden"
      aria-labelledby="comparison-heading"
    >
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* ─── Left: Table ─── */}
        <SectionReveal>
          <div className="space-y-10">
            <h2
              id="comparison-heading"
              className="text-headline-lg uppercase leading-none"
            >
              HOW WE{' '}
              <span className="text-[#c41e5c]">STACK UP</span>
            </h2>

            <div className="space-y-6">
              {/* Header Row */}
              <div className="grid grid-cols-3 gap-4 pb-4 border-b border-[#594045]">
                <div className="text-label-bold uppercase opacity-50">FEATURE</div>
                <div className="text-label-bold uppercase text-[#c41e5c]">PROTIBAE</div>
                <div className="text-label-bold uppercase opacity-50">TYPICAL BAR</div>
              </div>

              {/* Data Rows */}
              {rows.map((row) => (
                <div
                  key={row.feature}
                  className="grid grid-cols-3 gap-4 items-center py-3 border-b border-[#594045]/30 last:border-0"
                >
                  <div className="text-body-md font-bold uppercase text-[#e3e2e7]">
                    {row.feature}
                  </div>
                  <div className="text-[#c41e5c] font-bold text-[18px] flex items-center gap-2">
                    <Check size={16} strokeWidth={3} aria-hidden="true" />
                    {row.protibae}
                  </div>
                  <div className="text-[#e1bec3] flex items-center gap-2 text-body-md">
                    <X size={14} className="opacity-50 shrink-0" strokeWidth={2} aria-hidden="true" />
                    {row.typical}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* ─── Right: Circular product image + "NO BULL." badge ─── */}
        <SectionReveal delay={0.2}>
          <div className="relative">
            {/* Circular image with pink glow border */}
            <div
              className="aspect-square bg-[#292a2e] rounded-full overflow-hidden relative border-4 border-[#594045]/30"
              style={{ filter: 'drop-shadow(0 0 15px rgba(196, 30, 92, 0.4))' }}
            >
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUjlUrBsTC7y1d-DcZhYChpVItvy1zTL6a1nrHptkpmsGeqmJrC2IEnGT3_S60MlG-cXMU2ulePRBj4VlNq7G2Euj83N3NZv1bCItHK0eRZWvBWCy7WaMv0sVtoWtulsRCNfnM-yamjCMbMH2wXc9zMOqnz_QmzafweANLDaXVxDuysDOZA1vsyNREYIgl3g4LZSaFf5f86Pl2Vk0fysz2fraiBCoaLxk7toIEOBzvtUzvqdQkSXbGenh4plW3J7WKmyGXLlfiBjo"
                alt="PROTIBAE protein bar cross-section showing almond chunks, peanut butter layers and chocolate coating"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {/* "NO BULL." badge overlay */}
            <div className="absolute -bottom-6 -right-6 bg-[#c41e5c] p-8 shadow-2xl">
              <div className="text-headline-lg leading-none text-white uppercase">
                NO
                <br />
                BULL.
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
