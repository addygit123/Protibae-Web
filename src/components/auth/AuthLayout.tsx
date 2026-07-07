'use client';

import { ReactNode, useEffect } from 'react';
import { Star } from 'lucide-react';
import Link from 'next/link';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  // Simple parallax effect for the background image, as specified in HTML script
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      const image = document.getElementById('auth-bg-image');
      if (image) {
        image.style.transform = `scale(1.05) translate(${(x - 0.5) * 20}px, ${(y - 0.5) * 20}px)`;
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <main className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-[#0d0e12] text-[#e3e2e7]">
      {/* Branding Overlay (Desktop Only) */}
      <div className="absolute top-10 left-10 z-50 pointer-events-none md:block hidden">
        <Link href="/">
          <h1 className="font-display-hero text-headline-md text-on-background tracking-tighter italic">PROTIBAE</h1>
        </Link>
      </div>

      {/* Left Column: Visual/Product Branding */}
      <section className="relative w-full md:w-1/2 min-h-[409px] md:min-h-screen overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent z-10" />
        
        {/* Background Image with slight scale animation on hover */}
        <div 
          id="auth-bg-image"
          className="absolute inset-0 bg-cover bg-center scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out" 
          style={{ 
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDRolBGvmsGiPpZneqmbxJBPfVzELmccjUN2gb3WFcms_Ff_KnK2_Ok2BZ67pm1NSH7cWY5Q-yFj8NdIo2zDCxKPBgyUrrnYGTf5cuUZlym_43mEPYSOajSoOn7PrUjNfylHdKrSNiPxn40wF8SlyDy2H3DsUGqLBrB2cd4yrzprbjRXKSArzTty_jul4h9BeUv4PPcFgMmV82m3o06NvN6QgHRKkqwzdsDspWMDKiZbFHeTGnfctrdKLFcimA4TPy3Hsil4xoUZwg')" 
          }}
        />

        {/* Mobile Branding */}
        <div className="absolute top-8 left-8 z-20 md:hidden">
          <Link href="/">
            <h1 className="font-display-hero text-headline-md text-on-background tracking-tighter italic">PROTIBAE</h1>
          </Link>
        </div>

        <div className="absolute bottom-12 left-12 z-20 max-w-md hidden md:block">
          <p className="font-label-bold text-primary uppercase tracking-[0.2em] mb-4">Uncompromising Nutrition</p>
          <h2 className="font-display-hero text-headline-lg leading-tight mb-6">FUEL THE <br/>BEAST WITHIN.</h2>
          <div className="flex items-center gap-4 text-on-surface-variant">
            <div className="flex">
              <Star className="w-5 h-5 fill-primary text-primary" />
              <Star className="w-5 h-5 fill-primary text-primary" />
              <Star className="w-5 h-5 fill-primary text-primary" />
              <Star className="w-5 h-5 fill-primary text-primary" />
              <Star className="w-5 h-5 fill-primary text-primary" />
            </div>
            <span className="font-label-bold text-label-bold">50,000+ ELITE ATHLETES FUELED</span>
          </div>
        </div>
      </section>

      {/* Right Column: Authentication Forms */}
      <section className="w-full md:w-1/2 bg-surface flex items-center justify-center p-gutter relative overflow-y-auto min-h-[500px]">
        {children}

        {/* Footer Small */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full text-center px-gutter">
          <p className="text-[10px] uppercase tracking-widest text-outline-variant/60 font-label-bold">
            © 2024 PROTIBAE PERFORMANCE NUTRITION. FUEL YOUR AMBITION.
          </p>
        </div>
      </section>
    </main>
  );
}
