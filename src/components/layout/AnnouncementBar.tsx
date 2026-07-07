'use client';

import { motion } from 'framer-motion';

const MESSAGE = '🚀 FREE SHIPPING ON ORDERS ABOVE ₹499 · USE CODE PROTIBAE10 FOR 10% OFF YOUR FIRST ORDER · NEW FLAVOR DROPPING SOON';

/**
 * AnnouncementBar
 * Full-width, sticky top banner with a looping marquee.
 * Matches Stitch design: primary-container bg, white uppercase text.
 */
export function AnnouncementBar() {
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
