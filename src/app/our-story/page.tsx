import { Leaf, Dumbbell, Activity, Sprout, Heart, ArrowRight, Zap, Star, Trophy } from 'lucide-react';
import Image from 'next/image';

export const metadata = {
  title: 'Our Story',
  description: 'Elevating performance through uncompromising nutrition. Built for the ambitious.',
};

export default function OurStoryPage() {
  return (
    <>
      {/* Hero Story Section */}
      <section className="relative min-h-[921px] flex flex-col justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent z-10"></div>
          <img 
            className="w-full h-full object-cover" 
            alt="A moody, high-contrast professional studio photograph of a muscular athlete training" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0dloCQf02wrYlxI39QNVD69lw6ZZznKZupBYdSkSf6tr3eJkgxUbghoFh-7cszdvcATsrkn5Au-VXHlVmrolsJjkDcz87rKDlBIssGTKKeqATjhG559S_nmx_lvQ9467hTjqn_ojbBNOwkZ9TpjDXfS-wYD82267LV87KWpIGOhLPE9lcAbjjZOD9nxn8cAMM5ZaiCetNtenakp1DV61ZZVrDDnRyXbeHobIH7Oda9K_WIGyGjbm21JUjIhptrh5qO-cVC0hDTW0"
          />
        </div>
        <div className="relative z-20 max-w-container-max mx-auto px-gutter w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="flex flex-col">
              <span className="font-display text-headline-lg md:text-display-hero text-on-background">OUR STORY.</span>
              <span className="font-display text-headline-lg md:text-display-hero text-primary-container -mt-4 md:-mt-8">OUR PURPOSE.</span>
            </h1>
            <div className="inline-block px-4 py-2 bg-primary-container text-on-primary-container font-display text-headline-md italic transform -skew-x-12 glow-primary">
              YOU VS YOU. EVERY DAY.
            </div>
            <p className="font-body text-body-lg text-on-surface-variant max-w-lg">
              PROTIBAE wasn&apos;t just another protein bar idea. It was born out of a simple frustration—either snacks were tasty but unhealthy, or healthy but tasted like compromise. We knew you deserved better.
            </p>
            <div className="flex gap-4 pt-4">
              <button className="px-8 py-4 bg-primary-container text-on-primary-container font-label-bold uppercase tracking-widest glow-primary hover:bg-[#ffb1c1] transition-all duration-300">EXPLORE PRODUCTS</button>
              <button className="px-8 py-4 border-2 border-white text-white font-label-bold uppercase tracking-widest hover:bg-white/10 transition-all duration-300">LEARN MORE</button>
            </div>
          </div>
          <div className="hidden md:flex justify-center relative">
            <div className="absolute inset-0 bg-[#ffb1c1]/10 blur-[120px] rounded-full animate-pulse"></div>
            <img 
              className="relative z-10 w-4/5 animate-floating" 
              alt="A premium 3D render of a PROTIBAE Choco Peanut protein bar floating in mid-air" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBYmgGqJxHP2I-qDn9pGKWCHVfWMK-hYclw0-uAAWyUGL3_6naH-BKedyf_LnOef69iiCTRqaB4z91cwUDY0qj5jpoiwRO2NtFQ5-vcxFwYTCl12L8HkFmeMzh3CMP5W4hdBGi1vDgPkfosA8TrDag1v9T95yuJhEebzqBQ07EZb15HB15p773Fm6ajZPiebS1GcA9IBYTaW1g6b8AX5z6jdT2GdfOVq7O4tiJ-33trbtg-VQp3h4JZvrWr7UAOoQdGQ_ttl7i98I"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-section-desktop bg-surface-container-lowest relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#ffb1c1]/5 blur-3xl -z-0"></div>
        <div className="max-w-container-max mx-auto px-gutter relative z-10">
          <div className="text-center mb-20">
            <h2 className="font-display text-headline-lg text-on-background mb-4">
              SO WE BUILT <span className="text-primary-container">PROTIBAE.</span>
            </h2>
            <p className="font-body text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              A bar that&apos;s clean, packed with protein, powered by real ingredients, and tastes insanely good—so you never have to choose between health and flavor again.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Clean Ingredients */}
            <div className="group p-8 bg-surface-container-low border border-outline-variant/30 hover:border-[#ffb1c1]/50 transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-[#ffb1c1]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Leaf className="text-[#ffb1c1]" size={32} />
              </div>
              <h3 className="font-display text-headline-md mb-2">CLEAN INGREDIENTS</h3>
              <p className="text-label-sm text-on-surface-variant">No fillers. No palm oil. Just real nutrition.</p>
            </div>
            {/* High Protein */}
            <div className="group p-8 bg-surface-container-low border border-outline-variant/30 hover:border-[#ffb1c1]/50 transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-[#ffb1c1]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Dumbbell className="text-[#ffb1c1]" size={32} />
              </div>
              <h3 className="font-display text-headline-md mb-2">HIGH PROTEIN</h3>
              <p className="text-label-sm text-on-surface-variant">Fuel your every rep, set and goal.</p>
            </div>
            {/* Low Sugar */}
            <div className="group p-8 bg-surface-container-low border border-outline-variant/30 hover:border-[#ffb1c1]/50 transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-[#ffb1c1]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Activity className="text-[#ffb1c1]" size={32} />
              </div>
              <h3 className="font-display text-headline-md mb-2">LOW SUGAR</h3>
              <p className="text-label-sm text-on-surface-variant">&lt;0.5g added sugar. Nothing artificial.</p>
            </div>
            {/* Bajra Power */}
            <div className="group p-8 bg-surface-container-low border border-outline-variant/30 hover:border-[#ffb1c1]/50 transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-[#ffb1c1]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sprout className="text-[#ffb1c1]" size={32} />
              </div>
              <h3 className="font-display text-headline-md mb-2">MADE WITH BAJRA</h3>
              <p className="text-label-sm text-on-surface-variant">Ancient grain. Modern performance nutrition.</p>
            </div>
            {/* Built for Life */}
            <div className="group p-8 bg-surface-container-low border border-outline-variant/30 hover:border-[#ffb1c1]/50 transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-[#ffb1c1]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Heart className="text-[#ffb1c1]" size={32} />
              </div>
              <h3 className="font-display text-headline-md mb-2">BUILT FOR REAL LIFE</h3>
              <p className="text-label-sm text-on-surface-variant">Your hustle. Your fuel. For every version of you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Manifesto Section */}
      <section className="relative h-[800px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            className="w-full h-full object-cover grayscale opacity-60" 
            alt="A wide-angle landscape shot of a rugged mountain range at dawn." 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4jztYl914wYD-xZ0bNC1KZslwc0i3ZIXKHjUiYGq31GyUSUrw5WwYL3j99xHoAocEsNaki2CIaMlEAZdOudTQQu_IOxgVnYwc9VqYk6gdZ8xG6GJgzu7NXfc-Teaj6CU3D5PJ-yvsEMzu_51ikYK-PziG5WmUOda8b5nJYgcy4pTpjiccqFzuSlRg1tLHdhmN1zjvPoH8fHphuRCwnkWS0zx_2dBEOjXPSY8ma94ultazCGGh6wwlqeyzK41ocLb8hGHNb0dTT7U"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background"></div>
        </div>
        <div className="relative z-10 max-w-container-max mx-auto px-gutter grid grid-cols-1 md:grid-cols-2">
          <div className="bg-surface-container/80 backdrop-blur-md p-12 border-l-4 border-[#ffb1c1]">
            <h2 className="font-display text-headline-lg text-[#ffb1c1] mb-6">THE MANIFESTO</h2>
            <div className="space-y-6 font-body text-body-lg text-on-surface leading-relaxed italic">
              <p>&quot;We don&apos;t believe in short-cuts. We believe in the grind, the sweat, and the small victories that compound over time.&quot;</p>
              <p>&quot;Nutrition shouldn&apos;t be a chore or a compromise. It should be the spark that keeps you going when the world tells you to stop.&quot;</p>
              <p>&quot;Whether you are hitting a personal best or just surviving a long Monday, we are here to fuel the best version of you.&quot;</p>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-outline-variant"></div>
              <div className="font-display text-headline-md text-on-surface-variant">PROTIBAE PERFORMANCE</div>
            </div>
          </div>
        </div>
      </section>

      {/* Ingredient Spotlight (Bento Grid) */}
      <section className="py-section-desktop">
        <div className="max-w-container-max mx-auto px-gutter">
          <h2 className="font-display text-headline-lg mb-12 text-center">
            WHY WE&apos;RE <span className="text-primary-container">DIFFERENT</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
            <div className="md:col-span-8 md:row-span-1 bg-surface-container rounded-xl overflow-hidden relative group">
              <img 
                className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700" 
                alt="A top-down macro shot of raw, ancient bajra grains mixed with premium dark chocolate chunks" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjBppK8X2BUse2l2N6uRfPD77BFxqQ1x5qQtuWYeKFuQjBJsErGnO_nHSEoUupGoV-l4ggM9OY-hKj2weRzFd-ufrpc1ZVOxjj41c9z-X-b67S6RnY-XdPcRw6GkgKXKjNzGHGGNOc1Nwjl4Qrzz5BS2v_RQRRi6WWPRG76l0hZLMkjkagzSUT_ck9hwhg4qkNaDY-Fqjwdy2eGZKr11zFpwFl8AwDDP7orCU8Rewc55dLwZlr2q2FW-gU22qUXPd7Tz4C0lXC1ns"
              />
              <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
                <h4 className="font-display text-headline-md text-[#ffb1c1]">ANCIENT GRAINS</h4>
                <p className="font-body text-body-md text-on-surface-variant max-w-md">
                  We use Bajra as our foundation—an ancient, nutrient-dense super-grain that provides sustained energy without the crash.
                </p>
              </div>
            </div>
            
            <div className="md:col-span-4 md:row-span-2 bg-primary-container rounded-xl p-8 flex flex-col justify-center text-on-primary-container overflow-hidden relative">
              <div className="absolute -right-20 -bottom-20 opacity-10">
                <Zap size={300} strokeWidth={1} fill="currentColor" />
              </div>
              <h4 className="font-display text-headline-lg mb-4">THE STATS</h4>
              <ul className="space-y-6">
                <li className="border-b border-on-primary-container/20 pb-4">
                  <span className="block font-display text-headline-lg">13G</span>
                  <span className="font-label-bold uppercase tracking-widest opacity-80 text-sm">PREMIUM WHEY PROTEIN</span>
                </li>
                <li className="border-b border-on-primary-container/20 pb-4">
                  <span className="block font-display text-headline-lg">&lt;0.5G</span>
                  <span className="font-label-bold uppercase tracking-widest opacity-80 text-sm">ADDED SUGAR</span>
                </li>
                <li className="pb-4">
                  <span className="block font-display text-headline-lg">100%</span>
                  <span className="font-label-bold uppercase tracking-widest opacity-80 text-sm">CLEAN LABEL</span>
                </li>
              </ul>
            </div>
            
            <div className="md:col-span-4 md:row-span-1 bg-surface-container rounded-xl flex flex-col items-center justify-center p-8 text-center border border-outline-variant/30">
              <Trophy className="text-[#ffb1c1] mb-4" size={48} strokeWidth={1.5} />
              <h4 className="font-display text-headline-md mb-2">GOLD STANDARD</h4>
              <p className="font-body text-body-md text-on-surface-variant">Triple-tested for purity and performance nutrition standards.</p>
            </div>
            
            <div className="md:col-span-4 md:row-span-1 bg-surface-container rounded-xl overflow-hidden group">
              <div className="p-8 h-full flex flex-col justify-center">
                <h4 className="font-display text-headline-md text-on-background mb-2">ZERO COMPROMISE</h4>
                <p className="font-body text-body-md text-on-surface-variant">We spent 18 months in the lab to perfect the texture. No more chalky aftertaste, just pure indulgence.</p>
                <a className="mt-4 text-[#ffb1c1] font-label-bold uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all" href="#">
                  OUR PROCESS <ArrowRight size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Brand Bar */}
      <div className="bg-primary-container w-full py-6 overflow-hidden whitespace-nowrap border-y border-white/10">
        <div className="flex animate-marquee items-center gap-12">
          <span className="font-display text-headline-md text-on-primary-container">REAL INGREDIENTS</span>
          <Zap className="text-on-primary-container" size={32} fill="currentColor" />
          <span className="font-display text-headline-md text-on-primary-container">REAL RESULTS</span>
          <Heart className="text-on-primary-container" size={32} fill="currentColor" />
          <span className="font-display text-headline-md text-on-primary-container">REAL YOU</span>
          <Star className="text-on-primary-container" size={32} fill="currentColor" />
          <span className="font-display text-headline-md text-on-primary-container">PROTIBAE PERFORMANCE</span>
          <Zap className="text-on-primary-container" size={32} fill="currentColor" />
          <span className="font-display text-headline-md text-on-primary-container">REAL INGREDIENTS</span>
          <Zap className="text-on-primary-container" size={32} fill="currentColor" />
          <span className="font-display text-headline-md text-on-primary-container">REAL RESULTS</span>
          <Heart className="text-on-primary-container" size={32} fill="currentColor" />
          <span className="font-display text-headline-md text-on-primary-container">REAL YOU</span>
        </div>
      </div>
    </>
  );
}
