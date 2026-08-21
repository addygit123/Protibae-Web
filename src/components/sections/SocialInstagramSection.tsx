'use client';

import { ArrowUpRight, Users, MessageCircle, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { siteConfig } from '@/config/site';

const InstagramIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-instagram"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

interface SocialPost {
  id: number;
  type: 'workout' | 'lifestyle' | 'quote';
  image: string;
  caption: string;
  likes: string;
  comments: string;
}

const socialPosts: SocialPost[] = [
  {
    id: 1,
    type: 'workout',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop',
    caption: 'No excuses. Fueling early morning sets with clean chocolate peanut power. 🏋️‍♂️',
    likes: '1.2k',
    comments: '48',
  },
  {
    id: 2,
    type: 'lifestyle',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop',
    caption: '13G protein, less than 0.5G sugar. The only snack that doesn&apos;t compromise on clean ingredients. 🍫',
    likes: '920',
    comments: '32',
  },
  {
    id: 3,
    type: 'quote',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop',
    caption: 'Clean fuel for mind and muscle. Empowering your everyday hustle. 🧘‍♀️',
    likes: '1.5k',
    comments: '64',
  },
];

export function SocialInstagramSection() {
  return (
    <section 
      className="py-[120px] px-6 bg-[#0d0e12] border-t border-[#594045]/20"
      aria-labelledby="social-heading"
    >
      <div className="max-w-[1280px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#c41e5c]/10 border border-[#c41e5c]/30 text-[#ffb1c1] text-xs font-bold uppercase tracking-wider rounded-full">
              <Users size={12} />
              Join the Clan
            </div>
            <h2 
              id="social-heading"
              className="text-headline-lg uppercase font-display"
            >
              FOLLOW THE <span className="text-[#c41e5c] italic">MOVEMENT</span>
            </h2>
            <p className="text-body-lg text-[#e1bec3] max-w-xl">
              Real athletes. Real journeys. Get nutrition tips, community highlights, and exclusive launches first.
            </p>
          </div>
          
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-transparent border-2 border-[#c41e5c] text-white hover:bg-[#c41e5c] px-8 py-4 font-display text-headline-sm tracking-wider uppercase transition-all duration-300"
          >
            <InstagramIcon size={20} />
            FOLLOW US ON INSTAGRAM
            <ArrowUpRight size={16} />
          </a>
        </div>

        {/* Feed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {socialPosts.map((post) => (
            <motion.div
              key={post.id}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="group relative bg-[#1a1b1f] border border-[#594045]/20 rounded-xl overflow-hidden shadow-xl"
            >
              {/* Image Container */}
              <div className="aspect-[4/3] w-full relative overflow-hidden bg-black/40">
                <img
                  src={post.image}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  loading="lazy"
                />
                
                {/* Stats Overlay on Hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-8">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Heart size={20} className="fill-[#c41e5c] text-[#c41e5c]" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white font-bold">
                    <MessageCircle size={20} className="text-[#ffb1c1]" />
                    <span>{post.comments}</span>
                  </div>
                </div>
              </div>

              {/* Caption */}
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-xs text-[#ffb1c1] font-bold uppercase tracking-wider">
                  <span>@protibae</span>
                  <span className="text-[10px] bg-[#594045]/30 px-2 py-0.5 rounded">{post.type}</span>
                </div>
                <p className="text-sm text-[#e1bec3] leading-relaxed line-clamp-2">
                  {post.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
