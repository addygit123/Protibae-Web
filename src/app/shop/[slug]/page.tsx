import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductBySlug, getProducts } from '@/config/products';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { ProductIngredients } from '@/components/product/ProductIngredients';
import { ProductReviews } from '@/components/product/ProductReviews';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { SectionReveal } from '@/components/sections/SectionReveal';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: 'Product Not Found | PROTIBAE' };
  }

  return {
    title: `${product.name} | PROTIBAE`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Related products - typically same category or popular items, excluding current
  const allProducts = await getProducts();
  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Main Product Section */}
      <main className="relative pt-[120px] pb-16 overflow-hidden">
        
        {/* Background gradient effect */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-0 right-0 w-1/2 h-[500px] bg-[#c41e5c]/5 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-[1280px] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Gallery (Left Side) */}
            <div className="lg:col-span-7">
              <ProductGallery product={product} />
            </div>

            {/* Product Info & Actions (Right Side) */}
            <div className="lg:col-span-5">
              <ProductInfo product={product} />
            </div>
            
          </div>
        </div>
      </main>

      {/* Ingredients & Nutrition */}
      <ProductIngredients product={product} />

      {/* Community Reviews */}
      <ProductReviews />

      {/* Frequently Bought Together / Related */}
      <RelatedProducts products={relatedProducts} />
      
      {/* Trust Strip (Reused from shop page layout logic conceptually, but implemented directly per PDP design) */}
      <section className="bg-[#0d0e12] border-t border-[#594045]/30 py-16">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          {[
            { icon: 'savings', title: 'Buy More, Save More', body: 'Exclusive discounts unlocked on packs of 12 and 24 bars.' },
            { icon: 'rocket_launch', title: 'Fresh & Fast Delivery', body: 'Shipped directly from our lab within 24 hours of ordering.' },
            { icon: 'sentiment_very_satisfied', title: '100% Satisfaction', body: 'Love the taste or your money back. No questions asked.' },
            { icon: 'feature_search', title: 'Perfect To Share', body: 'Premium packaging designed for gifting and performance.' },
          ].map((item) => (
            <div key={item.title} className="flex gap-4">
              <div className="w-12 h-12 bg-[#c41e5c]/10 flex items-center justify-center text-[#c41e5c] border border-[#c41e5c]/20 shrink-0">
                <span className="material-symbols-outlined text-3xl" aria-hidden="true">{item.icon}</span>
              </div>
              <div>
                <h5 className="font-body text-label-bold uppercase text-sm mb-1 text-[#e3e2e7]">{item.title}</h5>
                <p className="text-xs text-[#e1bec3] leading-relaxed">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
