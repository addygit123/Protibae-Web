import Link from 'next/link';
import type { Metadata } from 'next';
import { Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: "The page you are looking for doesn't exist. Return to the PROTIBAE shop.",
  robots: { index: false, follow: true },
};

export default function NotFoundPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-404 {
            0%, 100% { transform: translateY(0) rotate(12deg); }
            50% { transform: translateY(-20px) rotate(15deg); }
        }
        .animate-float-404 {
            animation: float-404 6s ease-in-out infinite;
        }
        .glass-blur-404 {
            backdrop-filter: blur(20px);
            background: rgba(26, 26, 26, 0.7);
        }
      `}} />

      {/* Main Content Area */}
      <main className="min-h-[80vh] pt-20 flex items-center relative overflow-hidden">
        <div className="max-w-container-max mx-auto px-gutter w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          {/* Content Side */}
          <div className="order-2 md:order-1">
            <div className="inline-block px-4 py-1 bg-primary-container/20 border border-[#ffb1c1]/30 rounded-full mb-6">
              <span className="font-label-bold text-[#ffb1c1] tracking-widest uppercase">ERROR 404</span>
            </div>
            <h1 className="font-display text-[120px] md:text-[180px] leading-[0.85] uppercase mb-4 glow-text-primary italic">
              LOST <br/> YOUR <br/> <span className="text-[#c41e5c]">WAY?</span>
            </h1>
            <p className="font-body text-body-lg text-on-surface-variant max-w-md mb-12 border-l-2 border-[#c41e5c] pl-6">
              Your hunger led you off the trail. Even the best athletes miss a step occasionally. Let&apos;s get you back to the protein source.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link className="inline-flex items-center justify-center bg-[#c41e5c] text-white px-10 py-5 font-display text-headline-md tracking-wider uppercase glow-primary hover:scale-95 transition-transform duration-150" href="/">
                RETURN HOME
              </Link>
              <Link className="inline-flex items-center justify-center border-2 border-on-background text-on-background px-10 py-5 font-display text-headline-md tracking-wider uppercase hover:bg-on-background hover:text-background transition-all duration-300" href="/">
                SHOP ALL
              </Link>
            </div>
          </div>
          
          {/* Graphic Side */}
          <div className="order-1 md:order-2 flex justify-center items-center relative h-[400px] md:h-[600px]">
            {/* Abstract 3D Bar Element */}
            <div className="relative w-full max-w-md aspect-square animate-float-404">
              {/* Glassy Background Card */}
              <div className="absolute inset-0 glass-blur-404 rounded-xl border border-outline-variant/30 transform -rotate-6"></div>
              {/* Primary Product Image */}
              <div className="absolute inset-4 z-20 flex items-center justify-center">
                <img 
                  className="w-full h-auto drop-shadow-[0_20px_50px_rgba(196,30,92,0.4)]" 
                  alt="A hyper-realistic 3D rendering of a premium dark chocolate protein bar" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeAWHQKIyWLPjKkUkW1cwQVRTwJC2fS63AjoJcOe-lEs5cmMC84Ulf75Y5h_LvHy2FJOr2xDZMMZp_szEgetOM2v0sU4NgDhkltLzD4GXBDPP5eLCer59Ii9rvcqI6gAwpZXy-a7idTH6RheSVqn1g4gMsyFz0eLVQBvxTGUcQ4oR7LhjqQafvhafgLG8BViV6tDcoU4NeGMThqodfRAJH2Crg7ido5AFZvPGBSZFnImFMyTLk_X1nBRmJ7vMeTbBsvdLx3KYPVys"
                />
              </div>
              {/* Decorative Lightning/Energy Elements */}
              <div className="absolute -top-10 -right-10 text-[#c41e5c] opacity-50 blur-sm">
                <Zap size={120} strokeWidth={1} fill="currentColor" />
              </div>
              <div className="absolute -bottom-10 -left-10 text-[#ffb1c1] opacity-20 blur-[2px]">
                <Zap size={160} strokeWidth={1} fill="currentColor" />
              </div>
            </div>
            
            {/* 404 Watermark */}
            <span className="absolute -z-10 font-display text-[300px] text-white/5 select-none pointer-events-none">
              404
            </span>
          </div>
        </div>
      </main>
    </>
  );
}
