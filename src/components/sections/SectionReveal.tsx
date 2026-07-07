'use client';

import { type ReactNode, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface SectionRevealProps {
  children: ReactNode;
  delay?: number;
}

/**
 * SectionReveal — reusable scroll-triggered reveal boundary.
 * Used by ComparisonSection, TestimonialsSection, NewsletterSection.
 */
export function SectionReveal({ children, delay = 0 }: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
