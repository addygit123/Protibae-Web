'use client';


import { CheckCircle2, Download, ExternalLink, FlaskConical, ShieldCheck, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product } from '@/config/products';

interface ProductLabTestProps {
  product: Product;
}

export function ProductLabTest({ product }: ProductLabTestProps) {
  const { labReport } = product;

  // If lab report is disabled or not configured, don't render this section
  if (!labReport || !labReport.enabled) {
    return null;
  }

  const badges = [
    'Third-Party Tested',
    'Nutritional Analysis',
    'Added Sugar Tested',
    'Protein Analysed',
    'Food Safety Documentation'
  ];

  return (
    <section className="py-24 border-t border-[#594045]/30 bg-[#0d0e12] relative overflow-hidden">
      {/* Subtle crimson glow in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#c41e5c]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Text and Badges Info (Left Side - 7 Columns) */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 bg-[#c41e5c]/10 border border-[#c41e5c]/30 text-[#ffb1c1] rounded-lg">
                  <FlaskConical className="w-6 h-6 animate-pulse" />
                </span>
                <span className="font-label-bold text-label-bold text-[#ffb1c1] tracking-widest uppercase text-xs">
                  Accredited Certification
                </span>
              </div>
              <h2 className="text-headline-lg text-[#e3e2e7] font-display-hero uppercase leading-none mb-6">
                Third-Party <span className="text-[#c41e5c] italic">Lab Tested</span>
              </h2>
              <p className="text-[#e1bec3] text-body-lg max-w-xl leading-relaxed">
                Every batch is independently analysed by an accredited laboratory for nutritional parameters. View the complete laboratory report below.
              </p>
            </div>

            {/* Badges List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {badges.map((badge, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-[#c41e5c] shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </span>
                  <span className="text-[#e3e2e7] font-body text-body-md uppercase tracking-wider text-sm">
                    {badge}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href={labReport.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 h-14 bg-[#c41e5c] hover:bg-[#a01648] text-white font-display-hero text-headline-md uppercase rounded-lg transition-all hover:shadow-[0_0_20px_rgba(196,30,92,0.5)] active:scale-[0.98] group"
              >
                View Full Lab Report
                <ExternalLink className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>

              <a
                href={labReport.pdf}
                download
                className="inline-flex items-center justify-center gap-3 px-8 h-14 bg-transparent border border-[#594045] hover:border-[#ffb1c1] text-[#e3e2e7] hover:text-white font-display-hero text-headline-md uppercase rounded-lg transition-all active:scale-[0.98] group"
              >
                Download PDF
                <Download className="w-5 h-5 transition-transform group-hover:translate-y-0.5" />
              </a>
            </div>
          </div>

          {/* Premium Glassmorphic Card (Right Side - 5 Columns) */}
          <div className="lg:col-span-5">
            <motion.div 
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="bg-[#1a1b1f]/60 backdrop-blur-md border border-[#594045]/30 rounded-xl p-8 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden group"
            >
              {/* Card Accent Border Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#c41e5c]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="flex items-start justify-between border-b border-[#594045]/30 pb-6 mb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#a8898e] block mb-1">
                    LABORATORY
                  </span>
                  <h3 className="text-[#e3e2e7] font-display-hero text-headline-md uppercase">
                    {labReport.laboratory}
                  </h3>
                </div>
                <div className="w-12 h-12 bg-[#ffb1c1]/10 rounded-full flex items-center justify-center text-[#ffb1c1]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#a8898e] block mb-1">
                    STATUS
                  </span>
                  <span className="inline-block px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-widest rounded">
                    Independent Laboratory Analysis
                  </span>
                </div>

                <div className="flex items-center gap-4 bg-[#121317]/50 border border-[#594045]/20 rounded-lg p-4">
                  <FileText className="text-[#c41e5c] shrink-0" size={24} />
                  <div>
                    <span className="text-[#e3e2e7] font-body text-sm font-bold block">
                      Report Available
                    </span>
                    <span className="text-[#a8898e] text-xs font-body">
                      Verified Authenticity
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
