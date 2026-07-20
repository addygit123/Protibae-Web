import { Zap, Dumbbell, Trophy, Check, ShoppingCart, Share2, MessageSquare, Globe, Mail, MessageCircle } from 'lucide-react';
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Rewards & Loyalty',
  description: 'Track your progress, earn performance points, and unlock premium PROTIBAE nutrition rewards. Join the loyalty programme today.',
  path: '/rewards',
  keywords: ['PROTIBAE rewards', 'loyalty programme', 'performance points', 'nutrition rewards'],
});

export default function RewardsPage() {
  return (
    <>
      {/* Hero Section: Points Balance */}
      <section className="relative py-section-desktop overflow-hidden">
        <div className="max-w-container-max mx-auto px-gutter relative z-10 flex flex-col items-center text-center">
          <div className="inline-block border border-[#c41e5c] px-4 py-1 mb-6">
            <span className="font-label-bold text-label-bold tracking-widest text-[#ffb1c1] uppercase">
              PERFORMANCE STATUS: ELITE
            </span>
          </div>
          <h1 className="font-display text-display-hero mb-4 italic uppercase">
            YOUR REWARDS <span className="text-[#ffb1c1] glow-text-primary">DASHBOARD</span>
          </h1>
          <p className="font-body text-body-lg text-on-surface-variant max-w-2xl mb-12">
            Track your progress, earn performance points, and unlock premium nutrition rewards. Every calorie is fuel; every purchase is progress.
          </p>
          
          {/* Points Card */}
          <div className="bg-[#1e1f23]/70 backdrop-blur-md p-12 rounded-lg border border-[#c41e5c]/40 flex flex-col md:flex-row items-center gap-12 w-full max-w-4xl shadow-[0_20px_50px_rgba(196,30,92,0.15)]">
            <div className="flex flex-col items-center md:items-start flex-1">
              <span className="font-label-bold text-label-sm text-on-surface-variant uppercase mb-2">
                Available Balance
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-[84px] leading-none text-white">4,850</span>
                <span className="font-display text-headline-md text-[#ffb1c1]">PTS</span>
              </div>
              <p className="text-on-surface-variant mt-4">
                You&apos;re <span className="text-white font-bold">1,150 points</span> away from your next $25 reward.
              </p>
            </div>
            
            <div className="w-px h-24 bg-outline-variant/30 hidden md:block"></div>
            
            <div className="flex flex-col items-center md:items-start flex-1 w-full">
              <div className="flex justify-between w-full mb-2">
                <span className="font-label-bold text-label-sm text-white uppercase">Pro Tier Progress</span>
                <span className="font-label-bold text-label-sm text-[#ffb1c1] uppercase">80%</span>
              </div>
              <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#c41e5c] transition-all duration-1000 ease-out" 
                  style={{ width: '80%' }}
                ></div>
              </div>
              <button className="mt-8 bg-gradient-to-br from-[#c41e5c] to-[#66002a] text-white font-display text-headline-md px-10 py-3 uppercase tracking-wider hover:scale-105 transition-transform shadow-[0_0_20px_rgba(196,30,92,0.4)]">
                REDEEM POINTS
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tier Bento Grid */}
      <section className="py-section-desktop bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto px-gutter">
          <h2 className="font-display text-headline-lg mb-12 italic">
            LOYALTY <span className="text-[#ffb1c1]">TIERS</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tier 1 */}
            <div className="group bg-surface-container border border-outline-variant/20 p-8 flex flex-col transition-all hover:border-[#ffb1c1]/50 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 font-display text-[120px] text-white/5 opacity-10 group-hover:opacity-20 transition-opacity">01</div>
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <Zap className="text-[#ffb1c1]" size={40} strokeWidth={1.5} />
                <h3 className="font-display text-headline-md">RECRUIT</h3>
              </div>
              <p className="text-on-surface-variant mb-8 font-body text-body-md relative z-10">
                Entry level status. Earn 1 point for every ₹1 spent. Access to seasonal sales.
              </p>
              <ul className="space-y-3 mt-auto relative z-10">
                <li className="flex items-center gap-2 text-label-bold">
                  <Check className="text-[#ffb1c1]" size={16} strokeWidth={2} /> 1x Points Earning
                </li>
                <li className="flex items-center gap-2 text-label-bold">
                  <Check className="text-[#ffb1c1]" size={16} strokeWidth={2} /> Birthday Bonus
                </li>
              </ul>
            </div>
            
            {/* Tier 2 */}
            <div className="group bg-surface-container border-2 border-[#c41e5c] p-8 flex flex-col transition-all hover:scale-[1.02] relative overflow-hidden shadow-[0_0_30px_rgba(196,30,92,0.2)]">
              <div className="absolute -right-8 -top-8 font-display text-[120px] text-[#ffb1c1]/5 opacity-10">02</div>
              <div className="bg-[#c41e5c] absolute top-0 left-0 px-4 py-1 z-10">
                <span className="font-label-bold text-[10px] text-white uppercase tracking-tighter">MOST POPULAR</span>
              </div>
              <div className="flex items-center gap-4 mb-6 mt-4 relative z-10">
                <Dumbbell className="text-[#ffb1c1]" size={40} strokeWidth={1.5} />
                <h3 className="font-display text-headline-md">PRO ATHLETE</h3>
              </div>
              <p className="text-on-surface-variant mb-8 font-body text-body-md relative z-10">
                Active performer level. Earn 1.5 points for every ₹1 spent. Early access to new drops.
              </p>
              <ul className="space-y-3 mt-auto relative z-10">
                <li className="flex items-center gap-2 text-label-bold">
                  <Check className="text-[#ffb1c1]" size={16} strokeWidth={2} /> 1.5x Points Earning
                </li>
                <li className="flex items-center gap-2 text-label-bold">
                  <Check className="text-[#ffb1c1]" size={16} strokeWidth={2} /> Free Shipping (Orders ₹500+)
                </li>
                <li className="flex items-center gap-2 text-label-bold text-[#ffb1c1]">
                  <Check size={16} strokeWidth={2} /> Priority Customer Support
                </li>
              </ul>
            </div>
            
            {/* Tier 3 */}
            <div className="group bg-surface-container border border-outline-variant/20 p-8 flex flex-col transition-all hover:border-[#ffb1c1]/50 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 font-display text-[120px] text-white/5 opacity-10 group-hover:opacity-20 transition-opacity">03</div>
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <Trophy className="text-[#ffb1c1]" size={40} strokeWidth={1.5} />
                <h3 className="font-display text-headline-md">ELITE PERFORMER</h3>
              </div>
              <p className="text-on-surface-variant mb-8 font-body text-body-md relative z-10">
                Apex status. Earn 2 points for every ₹1 spent. Exclusive flavor testing &amp; private events.
              </p>
              <ul className="space-y-3 mt-auto relative z-10">
                <li className="flex items-center gap-2 text-label-bold">
                  <Check className="text-[#ffb1c1]" size={16} strokeWidth={2} /> 2x Points Earning
                </li>
                <li className="flex items-center gap-2 text-label-bold">
                  <Check className="text-[#ffb1c1]" size={16} strokeWidth={2} /> Annual Anniversary Gift
                </li>
                <li className="flex items-center gap-2 text-label-bold">
                  <Check className="text-[#ffb1c1]" size={16} strokeWidth={2} /> Dedicated Performance Coach
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Ways to Earn */}
      <section className="py-section-desktop">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="text-center mb-16">
            <h2 className="font-display text-headline-lg italic">
              ACCELERATE <span className="text-[#ffb1c1]">GROWTH</span>
            </h2>
            <p className="text-on-surface-variant font-body text-body-lg">
              Unlock points faster through specialized performance actions.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-gutter">
            <div className="bg-surface-container-high p-6 text-center group cursor-pointer hover:bg-[#c41e5c] transition-all">
              <ShoppingCart className="text-[#ffb1c1] group-hover:text-white mb-4 mx-auto" size={40} strokeWidth={1.5} />
              <h4 className="font-display text-headline-md leading-tight group-hover:text-white">MAKE A PURCHASE</h4>
              <p className="text-label-bold text-[#ffb1c1] group-hover:text-white/80 mt-2">1 PT PER $1</p>
            </div>
            <div className="bg-surface-container-high p-6 text-center group cursor-pointer hover:bg-[#c41e5c] transition-all">
              <Share2 className="text-[#ffb1c1] group-hover:text-white mb-4 mx-auto" size={40} strokeWidth={1.5} />
              <h4 className="font-display text-headline-md leading-tight group-hover:text-white">REFER A FRIEND</h4>
              <p className="text-label-bold text-[#ffb1c1] group-hover:text-white/80 mt-2">500 PTS</p>
            </div>
            <div className="bg-surface-container-high p-6 text-center group cursor-pointer hover:bg-[#c41e5c] transition-all">
              <MessageSquare className="text-[#ffb1c1] group-hover:text-white mb-4 mx-auto" size={40} strokeWidth={1.5} />
              <h4 className="font-display text-headline-md leading-tight group-hover:text-white">LEAVE A REVIEW</h4>
              <p className="text-label-bold text-[#ffb1c1] group-hover:text-white/80 mt-2">100 PTS</p>
            </div>
            <div className="bg-surface-container-high p-6 text-center group cursor-pointer hover:bg-[#c41e5c] transition-all">
              <Globe className="text-[#ffb1c1] group-hover:text-white mb-4 mx-auto" size={40} strokeWidth={1.5} />
              <h4 className="font-display text-headline-md leading-tight group-hover:text-white">FOLLOW ON SOCIAL</h4>
              <p className="text-label-bold text-[#ffb1c1] group-hover:text-white/80 mt-2">50 PTS</p>
            </div>
          </div>
        </div>
      </section>

      {/* Redemption Shop */}
      <section className="py-section-desktop bg-surface-container-low border-y border-outline-variant/20">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="font-display text-headline-lg italic">
                REDEEM <span className="text-[#ffb1c1]">FUEL</span>
              </h2>
              <p className="text-on-surface-variant font-body text-body-lg">
                Trade your performance points for the gear and nutrition you need.
              </p>
            </div>
            <div className="flex gap-4">
              <button className="bg-surface-container-highest px-6 py-2 font-display text-label-bold tracking-widest text-[#ffb1c1] border border-[#c41e5c]/30">ALL</button>
              <button className="bg-transparent px-6 py-2 font-display text-label-bold tracking-widest text-on-surface-variant hover:text-[#ffb1c1] transition-colors">VOUCHERS</button>
              <button className="bg-transparent px-6 py-2 font-display text-label-bold tracking-widest text-on-surface-variant hover:text-[#ffb1c1] transition-colors">MERCH</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
            {/* Reward Item 1 */}
            <div className="bg-surface-container border border-outline-variant/30 overflow-hidden group">
              <div className="h-64 relative overflow-hidden bg-surface-container-highest">
                <img 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  alt="A premium high-resolution studio shot of a Protibae branded $10 discount voucher card" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqNG5oMTMQJZDUIgfHQZQQMhHIquv5N_duMfQop4pAi8GjOIwn6QS7VyDalPpKkLdd_86Bwkon2AD08xyrvztGLz2ACOJyhTdPPFRqYjIRuauOPBQqoSmspJ9ATkqZ5pBrFxEuEhkuqMIFc2QvavfSTjf4y2gvBxPP5EZcsVhbiLlgOLSchg9zDdowa-FEfOeEnZcM3EJ8Iuf7kn_u0P_0oMmoms1_ChFkSopWoH2xbqJMd1f-7KuKYJKKBpqnH7GPTv8A8gsGU70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="font-display text-headline-md text-white">$10 OFF</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-label-bold text-label-sm text-on-surface-variant">VOUCHER</span>
                  <span className="font-display text-[#ffb1c1]">1,000 PTS</span>
                </div>
                <button className="w-full py-3 bg-[#c41e5c] text-white font-display text-label-bold tracking-widest uppercase hover:brightness-110 transition-all">
                  REDEEM NOW
                </button>
              </div>
            </div>
            {/* Reward Item 2 */}
            <div className="bg-surface-container border border-outline-variant/30 overflow-hidden group">
              <div className="h-64 relative overflow-hidden bg-surface-container-highest">
                <img 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  alt="A matte black performance shaker bottle with a subtle crimson Protibae logo" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVV01YQ_N0px7ILX8XTCctj-Rkc2NzgPL7IIFK6Ww0jSEGvV63mRXnG6CvyNzios2jHeD3H0QzgbBRPXPJrm94NVx0MyJUkhyxbow10S9-ofB7joiFlePmE00B5lB2-FeEHsWqfrd57C0nak9EjK2EneT57oxaVVG76DRaeZhuafl5XN_GS0U9CikN0TM1UTh9wE2e2UHSBRR_5C5LiLwoCmfLAolU1URXgCZQXJkIvullU2Ig8WjR0sWrLCggJO9fsDRbUPtci-Q"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="font-display text-headline-md text-white">PRO SHAKER</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-label-bold text-label-sm text-on-surface-variant">EQUIPMENT</span>
                  <span className="font-display text-[#ffb1c1]">2,500 PTS</span>
                </div>
                <button className="w-full py-3 border border-[#c41e5c] text-[#ffb1c1] font-display text-label-bold tracking-widest uppercase hover:bg-[#c41e5c] hover:text-white transition-all">
                  REDEEM NOW
                </button>
              </div>
            </div>
            {/* Reward Item 3 */}
            <div className="bg-surface-container border border-outline-variant/30 overflow-hidden group">
              <div className="h-64 relative overflow-hidden bg-surface-container-highest">
                <img 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  alt="A variety pack of Protibae high-protein bars in vibrant packaging" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtEM5ifxU6XNKlK80bpYVI6PdZLBGtIemYHEjsShmCHv8g7YN6MRgwIOFU-DefOzIboqFUmsQ52cgt037m5p4YmY3epKuEbLKa719xKQtAM0w93VoU8KdjHWzaPlkAPty48Pt34hYJhVb6S9jLAagUUtsrR-laf7WuYWulLiKzGRgldKGTnwZyAsD-lnftnWfOqypQz3e8Mc1vgQClkzIRecP1oPLransxgMP2_gGGzitciOFsLu-pC2QUwBNHNsZ3wH1lL1k0ds0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="font-display text-headline-md text-white">VARIETY PACK</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-label-bold text-label-sm text-on-surface-variant">PRODUCT</span>
                  <span className="font-display text-[#ffb1c1]">3,000 PTS</span>
                </div>
                <button className="w-full py-3 border border-[#c41e5c] text-[#ffb1c1] font-display text-label-bold tracking-widest uppercase hover:bg-[#c41e5c] hover:text-white transition-all">
                  REDEEM NOW
                </button>
              </div>
            </div>
            {/* Reward Item 4 */}
            <div className="bg-surface-container border border-outline-variant/30 overflow-hidden group">
              <div className="h-64 relative overflow-hidden bg-surface-container-highest">
                <img 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  alt="A minimalist high-end gym bag in charcoal grey with crimson embroidery" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1fCwfrBFfwIPFW6_Q-Nv0wOGFIuT-46YrJwnZqahkSj5lTDCUollkii3wRMshygHAe5uygvbi64LbpkbGK3rQJ-mUP5Tll11Dc84zsrI09Fu2gcSKIvyApzEE9pM5pU_l64ZCplb3kxuaTWzBxpqjkkbbLRLhv5rbDVehUOuyI-EyyGSZD4Xuq5WsWOGUCxIM6JLLfNAIMi9NQWV7DjnhMQBrEpo-CWrCGNF5704r7WgLsdN9W1NgFmAemeRJapJKMwd1nvvW9rM"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="font-display text-headline-md text-white">PERFORMANCE BAG</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-label-bold text-label-sm text-on-surface-variant">MERCH</span>
                  <span className="font-display text-[#ffb1c1]">5,000 PTS</span>
                </div>
                <button className="w-full py-3 border border-outline-variant text-on-surface-variant font-display text-label-bold tracking-widest uppercase cursor-not-allowed opacity-50" disabled>
                  LOCKED (TIER 3)
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Referral Section */}
      <section className="py-section-desktop overflow-hidden">
        <div className="max-w-container-max mx-auto px-gutter grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-[#c41e5c] to-[#66002a] opacity-10 blur-3xl rounded-full"></div>
            <img 
              className="relative z-10 w-full h-auto grayscale hover:grayscale-0 transition-all duration-700" 
              alt="A dynamic action shot of two athletes performing a synchronized high-intensity workout" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDa5gk9Gvwig5OaIEknnDUWvzPi11PW-wf77_EdE-yCiwrgEUwFGQK73vSK0AX92mwgeJQgs0X2V54sy7jcKJumuTBZLG99ErSlX2VKufBK1uD_pRPD0QUxnpV4nak1pHrmPgYlTsS1uN8y4eA1tL1kqqa-tO1AG_zLf6vxLymi6eV3YVcsUbwaI7CsBe5xb_iu5y0hookszi_1PHqyY1xdHwjSAob2xskRDOBbeS8EKPC2opaqF_ezEvhW2k1HMD6N0TSl9b_Bhr0"
            />
          </div>
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-headline-lg italic leading-none">
              THE <span className="text-[#ffb1c1] glow-text-primary">RECRUITMENT</span> DRIVE
            </h2>
            <p className="font-body text-body-lg text-on-surface-variant">
              Everything is better with a training partner. Invite your friends to join the Protibae ecosystem. They get 15% off their first order, and you get 500 Performance Points ($5 value) for every successful recruitment.
            </p>
            <div className="flex flex-col gap-4 mt-4">
              <label className="font-label-bold text-label-sm text-on-surface-variant uppercase">
                Your Referral Link
              </label>
              <div className="flex">
                <input 
                  className="bg-surface-container border-outline-variant border-r-0 flex-1 px-4 font-body text-body-md text-white focus:ring-0 focus:border-[#c41e5c] outline-none" 
                  readOnly 
                  type="text" 
                  defaultValue="protibae.com/ref/athlete_4852"
                />
                <button className="bg-[#c41e5c] px-6 py-3 font-display text-label-bold tracking-widest uppercase text-white hover:brightness-110 transition-all">
                  COPY LINK
                </button>
              </div>
            </div>
            <div className="flex gap-4 mt-2">
              <button className="p-3 border border-outline-variant hover:border-[#ffb1c1] hover:text-[#ffb1c1] transition-all text-on-surface-variant flex items-center justify-center">
                <Share2 size={24} strokeWidth={1.5} />
              </button>
              <button className="p-3 border border-outline-variant hover:border-[#ffb1c1] hover:text-[#ffb1c1] transition-all text-on-surface-variant flex items-center justify-center">
                <Mail size={24} strokeWidth={1.5} />
              </button>
              <button className="p-3 border border-outline-variant hover:border-[#ffb1c1] hover:text-[#ffb1c1] transition-all text-on-surface-variant flex items-center justify-center">
                <MessageCircle size={24} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
