'use client';

import { motion } from 'framer-motion';

import { usePathname } from 'next/navigation';

export function AnnouncementBar({ price6 = 399 }: { price6?: number }) {
  const pathname = usePathname();
  
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const MESSAGE = `🎁 GET FREE DELIVERY WITH A PACK OF 6 FOR ₹${price6} · PURE PERFORMANCE NUTRITION · FUEL YOUR AMBITION · REAL INGREDIENTS · NO CRAP`;

  // Duplicate the message so the marquee loops seamlessly
  const repeated = `${MESSAGE} · ${MESSAGE} · `;

  return (
    <div
      role="banner"
      aria-label="Announcement"
      className="relative z-50 overflow-hidden bg-[#c41e5c] py-2 text-white"
    >
      <div className="flex whitespace-nowrap">
        <motion.p
          className="text-label-bold uppercase tracking-[0.15em] flex-shrink-0"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 30,
            ease: 'linear',
            repeat: Infinity,
          }}
          aria-hidden="false"
        >
          {repeated}
          {repeated}
        </motion.p>
      </div>
    </div>
  );
}
