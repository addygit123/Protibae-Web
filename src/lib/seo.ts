/**
 * @file seo.ts
 * @description Enterprise-grade SEO utility functions for PROTIBAE.
 * All metadata generation is centralised here. No page should duplicate
 * OpenGraph, Twitter, or canonical logic. Server-side only — zero runtime overhead.
 */

import type { Metadata } from 'next';
import { siteConfig, CATEGORY_LABELS, CATEGORY_DESCRIPTIONS } from '@/config/site';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface ProductSeoData {
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  sku?: string | null;
  flavor?: string | null;
  inventory: number;
}

export interface PageSeoOptions {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
  keywords?: string[];
}

// ─── Canonical URL helper ──────────────────────────────────────────────────────

/**
 * Generates an absolute canonical URL for a given path.
 * Always strips trailing slashes for consistency.
 */
export function generateCanonicalUrl(path: string = ''): string {
  const base = siteConfig.url.replace(/\/$/, '');
  const normalised = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalised}`;
}

// ─── OpenGraph generator ───────────────────────────────────────────────────────

/**
 * Generates a fully-typed OpenGraph object for any page type.
 */
export function generateOpenGraph(
  options: PageSeoOptions & {
    type?: 'website' | 'article' | 'profile';
  }
): NonNullable<Metadata['openGraph']> {
  const canonical = generateCanonicalUrl(options.path ?? '');
  return {
    type: options.type ?? 'website',
    locale: siteConfig.locale,
    url: canonical,
    siteName: siteConfig.name,
    title: options.title,
    description: options.description,
    images: [
      {
        url: options.ogImage ?? siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${options.title} — ${siteConfig.name}`,
      },
    ],
  };
}

// ─── Twitter card generator ────────────────────────────────────────────────────

/**
 * Generates a Twitter card metadata object.
 */
export function generateTwitterMetadata(
  options: Pick<PageSeoOptions, 'title' | 'description' | 'ogImage'>
): NonNullable<Metadata['twitter']> {
  return {
    card: 'summary_large_image',
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: options.title,
    description: options.description,
    images: [options.ogImage ?? siteConfig.ogImage],
  };
}

// ─── Generic page metadata ─────────────────────────────────────────────────────

/**
 * Generates complete Metadata for any standard page.
 * Covers title, description, canonical, OG, Twitter, robots, and keywords.
 */
export function generatePageMetadata(options: PageSeoOptions): Metadata {
  const canonical = generateCanonicalUrl(options.path ?? '');
  const fullTitle = options.title;

  return {
    title: fullTitle,
    description: options.description,
    keywords: [...(options.keywords ?? []), ...siteConfig.keywords].slice(0, 20),
    authors: siteConfig.authors as Metadata['authors'],
    creator: siteConfig.creator,
    publisher: siteConfig.publisher,
    alternates: {
      canonical,
    },
    openGraph: generateOpenGraph({ ...options, type: 'website' }),
    twitter: generateTwitterMetadata(options),
    robots: options.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
  };
}

// ─── Product page metadata ─────────────────────────────────────────────────────

/**
 * Generates complete Metadata for a dynamic product page.
 * Automatically resolves canonical, OG images, pricing, and availability.
 */
export function generateProductMetadata(product: ProductSeoData): Metadata {
  const path = `/shop/${product.slug}`;
  const canonical = generateCanonicalUrl(path);

  const primaryImage = product.images[0] ?? siteConfig.ogImage;
  const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category;

  const title = `${product.name} — ${categoryLabel} | ${siteConfig.name}`;
  const description =
    product.description.length > 160
      ? `${product.description.substring(0, 157)}…`
      : product.description;

  const availability = product.inventory > 0 ? 'in stock' : 'out of stock';

  const productKeywords = [
    product.name,
    categoryLabel,
    'protein bar',
    'performance nutrition',
    'buy protein bar India',
    product.flavor ?? '',
    siteConfig.name,
  ].filter(Boolean);

  return {
    title,
    description,
    keywords: productKeywords as string[],
    authors: siteConfig.authors as Metadata['authors'],
    creator: siteConfig.creator,
    publisher: siteConfig.publisher,
    category: categoryLabel,
    alternates: {
      canonical,
    },
    openGraph: {
      type: 'website',
      locale: siteConfig.locale,
      url: canonical,
      siteName: siteConfig.name,
      title,
      description,
      images: product.images.length > 0
        ? product.images.map((img, i) => ({
            url: img,
            width: 800,
            height: 800,
            alt: i === 0
              ? `${product.name} — ${siteConfig.name}`
              : `${product.name} image ${i + 1}`,
          }))
        : [
            {
              url: siteConfig.ogImage,
              width: 1200,
              height: 630,
              alt: `${product.name} — ${siteConfig.name}`,
            },
          ],
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title,
      description,
      images: [primaryImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    // Additional structured metadata for product enrichment
    other: {
      'product:price:amount': String(product.price),
      'product:price:currency': 'INR',
      'product:availability': availability,
      ...(product.sku ? { 'product:retailer_item_id': product.sku } : {}),
    },
  };
}

// ─── Category page metadata ────────────────────────────────────────────────────

/**
 * Generates complete Metadata for a category listing page.
 */
export function generateCategoryMetadata(categorySlug: string): Metadata {
  const label = CATEGORY_LABELS[categorySlug] ?? 'Shop';
  const description =
    CATEGORY_DESCRIPTIONS[categorySlug] ??
    `Shop ${label} at PROTIBAE — premium nutrition for performance athletes.`;

  const path = categorySlug === 'all' ? '/shop' : `/shop?category=${categorySlug}`;
  const title = `${label} | ${siteConfig.name}`;

  return generatePageMetadata({
    title,
    description,
    path,
    keywords: [label, 'protein bars', 'performance nutrition', 'shop', siteConfig.name],
  });
}
