/**
 * @file app/robots.ts
 * @description Dynamic robots.txt generation for PROTIBAE.
 * Generated at build time by Next.js App Router conventions.
 *
 * Allows: all public pages
 * Disallows: admin, API, auth, private pages
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */

import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Default rule — allow all bots
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/admin',
          '/api/',
          '/api',
          '/auth/',
          '/auth',
          '/account/orders/',
          '/checkout/',
          '/cart/',
          '/_next/',
          '/private/',
        ],
      },
      {
        // Block AIs from training on site content (optional — remove if not needed)
        userAgent: ['GPTBot', 'ChatGPT-User', 'CCBot', 'anthropic-ai', 'Claude-Web'],
        disallow: '/',
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
