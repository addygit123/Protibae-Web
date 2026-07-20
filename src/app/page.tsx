import type { Metadata } from 'next';
import { HeroSection } from '@/components/sections/HeroSection';
import { BenefitsSection } from '@/components/sections/BenefitsSection';
import { ComparisonSection } from '@/components/sections/ComparisonSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateBreadcrumbJsonLd, generateWebPageJsonLd } from '@/lib/jsonld';
import { siteConfig } from '@/config/site';

// Homepage uses the default siteConfig values — no override needed for title/desc.
// We use generatePageMetadata only if customising. Here we use explicit metadata
// to avoid wrapping the root title through the template on the homepage.
export const metadata: Metadata = {
  title: siteConfig.defaultTitle,
  description: siteConfig.description,
  keywords: siteConfig.keywords as unknown as string[],
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — ${siteConfig.tagline}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

/**
 * Home Page — Server Component
 * Landing page sections assembled in order matching Stitch design.
 * Organization & WebSite JSON-LD injected in root layout.
 * Additional homepage-specific JSON-LD added here.
 */
export default function HomePage() {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([]);
  const webPageJsonLd = generateWebPageJsonLd({
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    path: '/',
  });

  return (
    <>
      {/* Page-level JSON-LD */}
      <JsonLd id="jsonld-homepage-breadcrumb" data={breadcrumbJsonLd} />
      <JsonLd id="jsonld-homepage-webpage" data={webPageJsonLd} />

      <HeroSection />
      <BenefitsSection />
      <ComparisonSection />
      <TestimonialsSection />
      {/* Newsletter & Footer — next milestone */}
    </>
  );
}
