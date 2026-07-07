'use client';

import { type ReactNode, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface ReviewCardAnimationsProps {
  children: ReactNode;
  index: number;
}

/**
 * ReviewCardAnimations — Client Component boundary.
 * Each review card slides up with a staggered delay based on its index.
 * Also handles the hover lift effect on the card.
 */
export function ReviewCardAnimations({ children, index }: ReviewCardAnimationsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.12,
      }}
      whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
    >
      {children}
    </motion.div>
  );
}
