'use client';

import { ArrowUpRight, Users } from 'lucide-react';
import { siteConfig } from '@/config/site';

const InstagramIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-instagram"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export function SocialInstagramSection() {
  return (
    <section 
      className="py-20 px-6 bg-[#0d0e12] border-t border-[#594045]/20 relative overflow-hidden"
      aria-labelledby="social-heading"
    >
      {/* Glow highlight */}
      <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-[#c41e5c] opacity-10 blur-[80px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        
        {/* Left column info */}
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#c41e5c]/10 border border-[#c41e5c]/30 text-[#ffb1c1] text-xs font-bold uppercase tracking-wider rounded-full">
            <Users size={12} />
            Join the movement
          </div>
          <h2 
            id="social-heading"
            className="text-headline-lg uppercase font-display"
          >
            FOLLOW <span className="text-[#c41e5c] italic">@protibaeofficial</span>
          </h2>
          <p className="text-body-lg text-[#e1bec3]">
            Be part of our fast-growing community. Get daily fitness motivation, clean recipe ideas, and exclusive product drops directly on our Instagram.
          </p>
        </div>
        
        {/* Right CTA */}
        <div className="shrink-0">
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#c41e5c] text-white hover:bg-[#90003e] px-8 py-4 font-display text-headline-sm tracking-wider uppercase transition-all duration-300 shadow-[0_0_20px_rgba(196,30,92,0.25)] hover:shadow-[0_0_30px_rgba(196,30,92,0.4)]"
          >
            <InstagramIcon size={20} />
            FOLLOW ON INSTAGRAM
            <ArrowUpRight size={16} />
          </a>
        </div>

      </div>
    </section>
  );
}
