'use client';

import { type ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';

interface HeroAnimationsProps {
  children: ReactNode;
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * HeroAnimations — thin Client Component boundary.
 * Wraps hero copy children in staggered Framer Motion reveals.
 * Keeps HeroSection itself as a Server Component.
 */
export function HeroAnimations({ children }: HeroAnimationsProps) {
  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Each direct child gets its own staggered animation */}
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div key={i} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : <motion.div variants={itemVariants}>{children}</motion.div>}
    </motion.div>
  );
}
