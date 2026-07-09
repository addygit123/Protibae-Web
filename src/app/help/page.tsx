"use client";

import { Search, Truck, RefreshCw, ShieldCheck, ArrowRight, ChevronDown, Zap, Mail, Phone } from 'lucide-react';
import { useState } from 'react';
import { submitSupportTicket } from './actions';

export default function HelpPage() {
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState('loading');

    const formData = new FormData(e.currentTarget);
    const result = await submitSupportTicket(formData);

    if (result.success) {
      setFormState('success');
      setTimeout(() => {
        setFormState('idle');
        (e.target as HTMLFormElement).reset();
      }, 3000);
    } else {
      alert(result.error);
      setFormState('idle');
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        details > summary::-webkit-details-marker {
            display: none;
        }
      `}} />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="relative z-10 max-w-container-max mx-auto px-gutter text-center">
          <span className="font-label-bold text-label-bold text-[#ffb1c1] tracking-widest uppercase mb-4 block">
            How can we fuel your journey?
          </span>
          <h1 className="font-display text-display-hero md:text-[120px] uppercase italic leading-none mb-8">
            SUPPORT HUB
          </h1>
          <div className="max-w-2xl mx-auto relative group">
            <input 
              className="w-full bg-surface-container-high border-2 border-outline-variant/30 px-6 py-5 rounded-none font-label-bold uppercase tracking-wider focus:border-[#c41e5c] focus:ring-0 transition-all text-on-surface placeholder:text-on-surface-variant/50 outline-none" 
              placeholder="SEARCH FOR TOPICS, SHIPPING, OR NUTRITION..." 
              type="text"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ffb1c1]">
              <Search size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* Quick Links Bento Grid */}
      <section className="py-section-desktop px-gutter max-w-container-max mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2 bg-[#1e1f23]/70 backdrop-blur-md border border-[#594045]/30 p-8 flex flex-col justify-between group hover:border-[#ffb1c1] transition-all duration-500">
            <div>
              <Truck className="text-[#ffb1c1] mb-6" size={40} strokeWidth={1.5} />
              <h3 className="font-display text-headline-md mb-2">TRACK ORDER</h3>
              <p className="text-on-surface-variant font-body text-body-md">Real-time updates on your high-protein fuel delivery.</p>
            </div>
            <a className="mt-8 font-label-bold text-[#ffb1c1] flex items-center gap-2 group-hover:translate-x-2 transition-transform" href="#">
              GO TO TRACKING <ArrowRight size={18} />
            </a>
          </div>
          <div className="bg-[#1e1f23]/70 backdrop-blur-md border border-[#594045]/30 p-8 group hover:border-[#ffb1c1] transition-all duration-500">
            <RefreshCw className="text-[#ffb1c1] mb-6" size={40} strokeWidth={1.5} />
            <h3 className="font-display text-headline-md mb-2">RETURNS</h3>
            <p className="text-on-surface-variant font-body text-body-md">Easy returns policy for unopened bars.</p>
          </div>
          <div className="bg-[#1e1f23]/70 backdrop-blur-md border border-[#594045]/30 p-8 group hover:border-[#ffb1c1] transition-all duration-500">
            <ShieldCheck className="text-[#ffb1c1] mb-6" size={40} strokeWidth={1.5} />
            <h3 className="font-display text-headline-md mb-2">QUALITY</h3>
            <p className="text-on-surface-variant font-body text-body-md">Learn about our protein sourcing.</p>
          </div>
        </div>
      </section>

      {/* Main Content Area: FAQ & Contact Form Split */}
      <section className="py-section-desktop border-t border-outline-variant/20">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Left: FAQ Accordion */}
            <div className="lg:col-span-7">
              <h2 className="font-display text-headline-lg mb-12 italic">FREQUENTLY ASKED</h2>
              <div className="space-y-4">
                {/* FAQ Category: Shipping */}
                <div className="mb-12">
                  <h4 className="font-label-bold text-[#ffb1c1] uppercase tracking-widest mb-6 flex items-center gap-3">
                    <span className="w-8 h-[1px] bg-[#ffb1c1]"></span> SHIPPING &amp; DELIVERY
                  </h4>
                  <div className="space-y-4">
                    <details className="group bg-surface-container-low border border-outline-variant/30 transition-all duration-300">
                      <summary className="list-none p-6 flex justify-between items-center cursor-pointer font-label-bold uppercase tracking-wider text-on-surface group-open:bg-surface-container-high transition-colors">
                        How long does domestic shipping take?
                        <ChevronDown className="transition-transform duration-300 group-open:rotate-180" size={24} />
                      </summary>
                      <div className="p-6 pt-0 text-on-surface-variant font-body text-body-md leading-relaxed border-t border-outline-variant/10 mt-4">
                        Orders placed before 2 PM EST are processed the same day. Standard shipping typically takes 3-5 business days depending on your location within the continental US. Accelerated 2-day shipping is available at checkout.
                      </div>
                    </details>
                    <details className="group bg-surface-container-low border border-outline-variant/30 transition-all duration-300">
                      <summary className="list-none p-6 flex justify-between items-center cursor-pointer font-label-bold uppercase tracking-wider text-on-surface group-open:bg-surface-container-high transition-colors">
                        Do you ship internationally?
                        <ChevronDown className="transition-transform duration-300 group-open:rotate-180" size={24} />
                      </summary>
                      <div className="p-6 pt-0 text-on-surface-variant font-body text-body-md leading-relaxed border-t border-outline-variant/10 mt-4">
                        Currently, we only ship within North America (USA, Canada, Mexico). We are working on expanding our global fulfillment network to bring PROTIBAE to athletes worldwide soon.
                      </div>
                    </details>
                  </div>
                </div>

                {/* FAQ Category: Product */}
                <div className="mb-12">
                  <h4 className="font-label-bold text-[#ffb1c1] uppercase tracking-widest mb-6 flex items-center gap-3">
                    <span className="w-8 h-[1px] bg-[#ffb1c1]"></span> PRODUCT &amp; NUTRITION
                  </h4>
                  <div className="space-y-4">
                    <details className="group bg-surface-container-low border border-outline-variant/30 transition-all duration-300">
                      <summary className="list-none p-6 flex justify-between items-center cursor-pointer font-label-bold uppercase tracking-wider text-on-surface group-open:bg-surface-container-high transition-colors">
                        Are PROTIBAE bars keto-friendly?
                        <ChevronDown className="transition-transform duration-300 group-open:rotate-180" size={24} />
                      </summary>
                      <div className="p-6 pt-0 text-on-surface-variant font-body text-body-md leading-relaxed border-t border-outline-variant/10 mt-4">
                        Yes! Most of our bars contain less than 4g net carbs per serving. We use high-quality fats and fibers to keep you in ketosis while providing premium protein fuel.
                      </div>
                    </details>
                    <details className="group bg-surface-container-low border border-outline-variant/30 transition-all duration-300">
                      <summary className="list-none p-6 flex justify-between items-center cursor-pointer font-label-bold uppercase tracking-wider text-on-surface group-open:bg-surface-container-high transition-colors">
                        Where can I find the full ingredient list?
                        <ChevronDown className="transition-transform duration-300 group-open:rotate-180" size={24} />
                      </summary>
                      <div className="p-6 pt-0 text-on-surface-variant font-body text-body-md leading-relaxed border-t border-outline-variant/10 mt-4">
                        Full nutritional panels and ingredient lists are available on every product page under the &quot;Nutrition&quot; tab. We believe in 100% transparency.
                      </div>
                    </details>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-5">
              <div className="sticky top-32 bg-[#1e1f23]/70 backdrop-blur-md border border-[#594045]/30 p-10 hover:shadow-[0_0_20px_rgba(196,30,92,0.2)] transition-all duration-500">
                <h2 className="font-display text-headline-md mb-2">DIRECT CONTACT</h2>
                <p className="text-on-surface-variant font-body text-body-md mb-8">Our performance support team responds within 12 hours.</p>
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="font-label-bold text-label-sm text-on-surface-variant uppercase tracking-wider">FIRST NAME</label>
                      <input name="firstName" required className="w-full bg-surface-container border-outline-variant/20 focus:border-[#c41e5c] focus:ring-0 text-on-surface transition-all outline-none px-4 py-2" type="text"/>
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-bold text-label-sm text-on-surface-variant uppercase tracking-wider">LAST NAME</label>
                      <input name="lastName" required className="w-full bg-surface-container border-outline-variant/20 focus:border-[#c41e5c] focus:ring-0 text-on-surface transition-all outline-none px-4 py-2" type="text"/>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-bold text-label-sm text-on-surface-variant uppercase tracking-wider">EMAIL ADDRESS</label>
                    <input name="email" required className="w-full bg-surface-container border-outline-variant/20 focus:border-[#c41e5c] focus:ring-0 text-on-surface transition-all outline-none px-4 py-2" type="email"/>
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-bold text-label-sm text-on-surface-variant uppercase tracking-wider">ISSUE TYPE</label>
                    <select name="issueType" className="w-full bg-surface-container border-outline-variant/20 focus:border-[#c41e5c] focus:ring-0 text-on-surface transition-all outline-none px-4 py-2">
                      <option>ORDER INQUIRY</option>
                      <option>PRODUCT FEEDBACK</option>
                      <option>WHOLESALE REQUEST</option>
                      <option>MARKETING / PRESS</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-bold text-label-sm text-on-surface-variant uppercase tracking-wider">MESSAGE</label>
                    <textarea name="message" required className="w-full bg-surface-container border-outline-variant/20 focus:border-[#c41e5c] focus:ring-0 text-on-surface transition-all outline-none px-4 py-2" rows={4}></textarea>
                  </div>
                  <button 
                    disabled={formState !== 'idle'}
                    className={`w-full font-display text-headline-md py-4 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 ${
                      formState === 'success' ? 'bg-green-600 text-white' : 'bg-[#c41e5c] text-white'
                    }`} 
                    type="submit"
                  >
                    {formState === 'idle' && (
                      <>SEND MESSAGE <Zap size={24} fill="currentColor" /></>
                    )}
                    {formState === 'loading' && (
                      <><RefreshCw className="animate-spin" size={24} /> SENDING...</>
                    )}
                    {formState === 'success' && 'MESSAGE SENT!'}
                  </button>
                </form>

                <div className="mt-10 pt-10 border-t border-outline-variant/20 flex flex-col gap-4">
                  <div className="flex items-center gap-4 group">
                    <Mail className="text-[#ffb1c1]" size={24} />
                    <span className="font-label-bold text-on-surface group-hover:text-[#ffb1c1] transition-colors">SUPPORT@PROTIBAE.COM</span>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <Phone className="text-[#ffb1c1]" size={24} />
                    <span className="font-label-bold text-on-surface group-hover:text-[#ffb1c1] transition-colors">1-800-FUEL-PBX</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Policies Section */}
      <section className="py-section-desktop bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="text-center mb-16">
            <h2 className="font-display text-headline-lg italic">POLICIES</h2>
            <p className="text-on-surface-variant font-body text-body-lg">Full transparency on how we operate.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <h5 className="font-display text-headline-md border-b-2 border-[#ffb1c1] w-fit pb-1">SHIPPING POLICY</h5>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Orders are processed Monday through Friday. We offer several shipping options including Economy, Priority, and Next Day Air. Tracking numbers are provided via email once the shipping label is generated. We are not responsible for lost or stolen packages once they are marked as delivered by the carrier.
              </p>
              <a className="inline-block font-label-bold text-[#ffb1c1] hover:underline uppercase tracking-widest text-xs" href="#">Read Full Policy</a>
            </div>
            <div className="space-y-4">
              <h5 className="font-display text-headline-md border-b-2 border-[#ffb1c1] w-fit pb-1">RETURNS &amp; REFUNDS</h5>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Due to the food-based nature of our products, we cannot accept returns for opened items. If you receive a damaged package or the wrong product, please contact us within 48 hours with photographic evidence. Approved refunds will be processed to your original payment method within 7-10 business days.
              </p>
              <a className="inline-block font-label-bold text-[#ffb1c1] hover:underline uppercase tracking-widest text-xs" href="#">Read Full Policy</a>
            </div>
            <div className="space-y-4">
              <h5 className="font-display text-headline-md border-b-2 border-[#ffb1c1] w-fit pb-1">PRIVACY &amp; SECURITY</h5>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                We take your data security seriously. PROTIBAE uses enterprise-grade SSL encryption for all transactions. Your information is never sold to third parties. We only use your data to improve your shopping experience and provide personalized nutrition recommendations via our newsletter.
              </p>
              <a className="inline-block font-label-bold text-[#ffb1c1] hover:underline uppercase tracking-widest text-xs" href="#">Read Full Policy</a>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Brand Element */}
      <section className="h-[400px] relative w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            className="w-full h-full object-cover grayscale contrast-125 opacity-50" 
            alt="A powerful, cinematic high-contrast close-up of a premium chocolate protein bar" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDknGbGH7GYoHdBkwuPOHq8Bv2T8pjJHHkUumybez6IFKfEpTT8xhOxfnHtxFDt9t3BIJHqk0sPZrobDsG7JT2nT7llnvkReePkyWQcF4ln2Y46eaOtDq8ej7hITKErBBwrU6qHDRMIz9isbrXwkiAPDI8UdJNDfipQwpiC-rwhzj2b-DXxpqxkJNbReEDxWBZBnkkoV_Dgh59jy-xcSfLcgAEsXQvXvEOE-uXOZ8st3pZ1PLNR6yA5SzdbY1JyvwwDydR1zwHsiPo"
          />
        </div>
        <div className="relative z-10 text-center">
          <h2 className="font-display text-headline-lg md:text-[140px] italic leading-none opacity-20 select-none">UNCOMPROMISING NUTRITION</h2>
        </div>
      </section>
    </>
  );
}
