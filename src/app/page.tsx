import type { Metadata } from 'next';
import { HeroSection } from '@/components/sections/HeroSection';
import { BenefitsSection } from '@/components/sections/BenefitsSection';
import { ComparisonSection } from '@/components/sections/ComparisonSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `${siteConfig.name} | ${siteConfig.tagline}`,
  description: siteConfig.description,
};

/**
 * Home Page — Server Component
 * Landing page sections assembled in order matching Stitch design.
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <ComparisonSection />
      <TestimonialsSection />
      {/* Newsletter & Footer — next milestone */}
    </>
  );
}
