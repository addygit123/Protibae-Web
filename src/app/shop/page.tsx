import type { Metadata } from 'next';
import { Zap, Dumbbell } from 'lucide-react';
import { Suspense } from 'react';
import { ProductCard } from '@/components/shared/ProductCard';
import { ShopFiltersBar } from '@/components/shared/ShopFiltersBar';
import { SectionReveal } from '@/components/sections/SectionReveal';
import { getProducts, type Product } from '@/config/products';
import { generatePageMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  generateBreadcrumbJsonLd,
  generateWebPageJsonLd,
  generateItemListJsonLd,
} from '@/lib/jsonld';

export const metadata: Metadata = generatePageMetadata({
  title: 'Shop All',
  description:
    'Premium protein bars engineered for performance. High protein, clean ingredients, and zero compromise on taste. Shop the full PROTIBAE range.',
  path: '/shop',
  keywords: ['shop protein bars', 'buy protein bars India', 'performance nutrition shop'],
});

// ─── Filtering & Sorting (pure functions, no side effects) ────────────────────

type Category = Product['category'] | 'all';
type SortKey  = 'best-sellers' | 'price-asc' | 'price-desc' | 'newest';

function filterProducts(products: Product[], category: Category): Product[] {
  if (category === 'all') return products;
  return products.filter((p) => p.category === category);
}

function sortProducts(products: Product[], sort: SortKey): Product[] {
  const copy = [...products];
  switch (sort) {
    case 'price-asc':  return copy.sort((a, b) => a.price - b.price);
    case 'price-desc': return copy.sort((a, b) => b.price - a.price);
    case 'newest':     return copy.reverse(); // newest = last in array for now
    default:           return copy; // best-sellers = original order
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface ShopPageProps {
  searchParams: Promise<{ category?: string; sort?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const category = (params.category as Category) ?? 'all';
  const sort = (params.sort as SortKey) ?? 'best-sellers';

  const products = await getProducts();
  const filtered = filterProducts(products, category);
  const sorted   = sortProducts(filtered, sort);

  const categoryLabel =
    category === 'all'
      ? 'All Collections'
      : category === 'protein-bars'
      ? 'Protein Bars'
      : category === 'nuts-seeds'
      ? 'Nuts & Seeds'
      : 'Combos';

  // ── Structured Data ────────────────────────────────────────────────────────
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Shop', href: '/shop' },
  ]);
  const webPageJsonLd = generateWebPageJsonLd({
    title: 'Shop All | PROTIBAE',
    description: 'Premium protein bars engineered for performance. High protein, clean ingredients, and zero compromise on taste.',
    path: '/shop',
  });
  const itemListJsonLd = generateItemListJsonLd(
    sorted.map((p) => ({ name: p.name, slug: p.slug, image: p.image, price: p.price })),
    'PROTIBAE Product Catalogue'
  );

  return (
    <div className="min-h-screen">
      {/* Structured Data */}
      <JsonLd id="jsonld-breadcrumb" data={breadcrumbJsonLd} />
      <JsonLd id="jsonld-webpage" data={webPageJsonLd} />
      <JsonLd id="jsonld-itemlist" data={itemListJsonLd} />
      {/* ── Shop Hero ────────────────────────────────────────────── */}
      <section
        className="pt-[120px] pb-12 px-6 max-w-[1280px] mx-auto overflow-hidden"
        aria-labelledby="shop-heading"
      >
        <SectionReveal>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-4 border-[#c41e5c] pl-6">
              <div>
                <h1
                  id="shop-heading"
                  className="text-headline-lg-mobile md:text-display-hero text-[#e3e2e7] leading-none uppercase"
                >
                  SHOP OUR BARS
                </h1>
                <p className="text-body-lg text-[#e1bec3] mt-4 max-w-lg">
                  Premium nutrition engineered for performance. High protein,
                  clean ingredients, and zero compromise on taste.
                </p>
              </div>

              {/* Icon badges */}
              <div className="flex gap-4 shrink-0" aria-hidden="true">
                <div className="flex flex-col items-center">
                  <Zap size={24} className="text-[#c41e5c] fill-[#c41e5c] mb-1" />
                  <span className="font-body text-[10px] tracking-widest uppercase text-[#e1bec3]">
                    Energy
                  </span>
                </div>
                <div className="flex flex-col items-center border-l border-[#594045]/30 pl-4">
                  <Dumbbell size={24} className="text-[#c41e5c] mb-1" />
                  <span className="font-body text-[10px] tracking-widest uppercase text-[#e1bec3]">
                    Recovery
                  </span>
                </div>
              </div>
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* ── Sticky Filters Bar ───────────────────────────────────── */}
      <Suspense fallback={<div className="h-[57px] bg-[#121317] border-y border-[#594045]/30 mb-12" />}>
        <ShopFiltersBar />
      </Suspense>

      {/* ── Product Grid ─────────────────────────────────────────── */}
      <section
        className="px-6 max-w-[1280px] mx-auto mb-[120px]"
        aria-label={`Products — ${categoryLabel}`}
      >
        {sorted.length > 0 ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12"
            role="list"
          >
            {sorted.map((product, i) => (
              <div key={product.id} role="listitem">
                <SectionReveal delay={i * 0.06}>
                  <ProductCard product={product} />
                </SectionReveal>
              </div>
            ))}

            {/* "More Flavors Coming Soon" placeholder — shown only in 'all' view */}
            {category === 'all' && (
              <div
                role="listitem"
                className="relative flex flex-col items-center justify-center border border-[#c41e5c]/20 p-8 group bg-[#1a1b1f]/30 min-h-[400px] overflow-hidden rounded-lg animate-floating cursor-default"
              >
                {/* Soft animated glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#c41e5c]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#c41e5c]/20 blur-[50px] rounded-full"></div>

                <Zap
                  size={64}
                  className="text-[#c41e5c] mb-4 relative z-10 drop-shadow-[0_0_15px_rgba(196,30,92,0.5)]"
                  aria-hidden="true"
                />
                <h3 className="text-headline-md text-[#e3e2e7] text-center tracking-widest uppercase relative z-10">
                  MORE FLAVORS
                  <br />
                  COMING SOON
                </h3>
                <p className="text-sm text-[#e1bec3] text-center mt-2 max-w-[200px] relative z-10">
                  Stay tuned. Big things are cooking.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-32 text-center gap-6">
            <Zap size={64} className="text-[#594045]" aria-hidden="true" />
            <h2 className="text-headline-md text-[#e1bec3] uppercase">
              No products found
            </h2>
            <p className="text-body-md text-[#a8898e]">
              Try selecting a different category.
            </p>
          </div>
        )}
      </section>

      {/* ── Trust Strip ──────────────────────────────────────────── */}
      <section
        className="bg-[#1a1b1f] py-[120px] border-t border-[#594045]/20 overflow-hidden relative"
        aria-labelledby="trust-heading"
      >
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* CTA copy */}
          <SectionReveal>
            <h2
              id="trust-heading"
              className="text-headline-lg text-[#e3e2e7] leading-none mb-6 uppercase"
            >
              FUEL YOUR AMBITION
            </h2>
            <p className="text-body-lg text-[#e1bec3] mb-8 max-w-md">
              Join the PROTIBAE community for early access to drops, exclusive
              nutrition plans, and 15% off your first order.
            </p>
          </SectionReveal>

          {/* Trust badges */}
          <SectionReveal delay={0.15}>
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: '🌿', title: '100% NATURAL',    body: 'No artificial sweeteners or cheap fillers. Only the good stuff.' },
                { icon: '🚚', title: 'FAST DELIVERY',   body: 'Fresh bars delivered to your doorstep within 48 hours.' },
                { icon: '🔬', title: 'LAB TESTED',      body: 'Every batch is tested for purity and protein content accuracy.' },
                { icon: '⭐', title: 'PREMIUM QUALITY', body: 'Sourced from the finest local and international suppliers.' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-6 bg-[#0d0e12] border border-[#594045]/10 rounded-sm flex flex-col items-center text-center"
                >
                  <span className="text-2xl mb-3" aria-hidden="true">{item.icon}</span>
                  <h4 className="font-body text-label-bold text-xs tracking-widest uppercase text-[#e3e2e7] mb-2">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-[#e1bec3] leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>

        {/* Background decoration */}
        <div className="absolute -bottom-24 -right-24 opacity-[0.03] pointer-events-none select-none" aria-hidden="true">
          <Zap size={400} className="text-[#c41e5c]" />
        </div>
      </section>
    </div>
  );
}
