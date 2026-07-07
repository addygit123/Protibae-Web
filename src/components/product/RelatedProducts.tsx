import { ProductCard } from '@/components/shared/ProductCard';
import { SectionReveal } from '@/components/sections/SectionReveal';
import type { Product } from '@/config/products';

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-24 border-t border-[#594045]/30 bg-[#121317]">
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionReveal>
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-[#594045]/30 pb-4">
            <h2 className="text-display-hero text-[#e3e2e7] uppercase leading-none">
              <span className="text-[#c41e5c] italic">Frequently</span> Bought Together
            </h2>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product, i) => (
            <SectionReveal key={product.id} delay={i * 0.1}>
              <ProductCard product={product} />
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
