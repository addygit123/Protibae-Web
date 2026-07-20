/**
 * @file app/sitemap.ts
 * @description Dynamic sitemap.xml generation for PROTIBAE.
 * Fetches live product slugs from the database via Prisma.
 * Generated at build time (or on-demand with ISR) by Next.js.
 *
 * Includes: static pages + all active products
 * Excludes: admin, auth, API routes
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { siteConfig } from '@/config/site';

// ─── Static page definitions ───────────────────────────────────────────────────

const staticPages: MetadataRoute.Sitemap = [
  {
    url: siteConfig.url,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1.0,
  },
  {
    url: `${siteConfig.url}/shop`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  },
  {
    url: `${siteConfig.url}/our-story`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    url: `${siteConfig.url}/help`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    url: `${siteConfig.url}/rewards`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  },
];

// ─── Sitemap generator ─────────────────────────────────────────────────────────

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all active products
  let productPages: MetadataRoute.Sitemap = [];

  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    productPages = products.map((product) => ({
      url: `${siteConfig.url}/shop/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }));
  } catch (error) {
    console.error('⚠️ Sitemap: Failed to fetch products from DB:', error);
    // Gracefully degrade — return static pages even if DB is down
  }

  return [...staticPages, ...productPages];
}
