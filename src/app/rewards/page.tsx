import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import { Trophy } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = generatePageMetadata({
  title: 'Rewards - Coming Soon',
  description: 'The PROTIBAE Rewards program is coming soon. Stay tuned for updates.',
  path: '/rewards',
});

export default function RewardsComingSoonPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="bg-surface-container border border-outline-variant/20 p-8 rounded-full mb-8 shadow-sm">
        <Trophy className="h-16 w-16 text-primary animate-pulse" />
      </div>
      <h1 className="font-display text-4xl md:text-5xl font-bold uppercase italic mb-4">
        REWARDS <span className="text-primary glow-text-primary">COMING SOON</span>
      </h1>
      <p className="text-on-surface-variant max-w-lg mb-8 text-lg">
        We are building an elite loyalty experience. Our premium rewards program is launching shortly. Check back soon!
      </p>
      <Link 
        href="/shop"
        className="bg-primary text-on-primary font-display uppercase tracking-wider px-8 py-4 font-bold hover:scale-105 transition-transform"
      >
        RETURN TO SHOP
      </Link>
    </div>
  );
}
