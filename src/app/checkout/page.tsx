import { Lock } from 'lucide-react';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { CheckoutSummary } from '@/components/checkout/CheckoutSummary';
import { SectionReveal } from '@/components/sections/SectionReveal';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Secure Checkout',
  description: 'Complete your PROTIBAE order securely. Fast delivery, 100% satisfaction guarantee.',
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login?callbackUrl=/checkout');
  }
  return (
    <div className="min-h-screen bg-[#121317] flex flex-col">
      <main className="flex-grow max-w-[1280px] w-full mx-auto px-6 py-12">
        <SectionReveal>
          <div className="mb-12">
            <h1 className="font-display text-headline-lg uppercase tracking-tight text-white mb-2">SECURE CHECKOUT</h1>
            <div className="flex items-center gap-2">
              <Lock className="text-[#c41e5c]" size={16} fill="currentColor" />
              <p className="font-body text-[#e1bec3] uppercase tracking-widest text-sm">
                Encrypted Connection & Secured Payment Gateway
              </p>
            </div>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Multi-step Form Accordion */}
          <div className="lg:col-span-8">
            <SectionReveal delay={0.1}>
              <CheckoutForm />
            </SectionReveal>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4">
            <SectionReveal delay={0.2}>
              <CheckoutSummary />
            </SectionReveal>
          </div>
        </div>
      </main>
    </div>
  );
}
