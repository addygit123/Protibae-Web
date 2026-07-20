/**
 * @file jsonld.ts
 * @description Reusable JSON-LD structured data generators for PROTIBAE.
 * All schema types are typed, composable, and tree-shakeable.
 * Only import what each page needs — zero runtime overhead for unused schemas.
 *
 * Schema.org references:
 *  - Organization: https://schema.org/Organization
 *  - WebSite: https://schema.org/WebSite
 *  - BreadcrumbList: https://schema.org/BreadcrumbList
 *  - Product: https://schema.org/Product
 *  - SearchAction: https://schema.org/SearchAction
 */

import { siteConfig } from '@/config/site';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  name: string;
  href: string;
}

export interface ProductJsonLdData {
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  sku?: string | null;
  inventory: number;
  brand?: string;
}

// ─── Organization JSON-LD ──────────────────────────────────────────────────────

/**
 * Generates Organization schema for PROTIBAE.
 * Used on homepage and any page that benefits from brand presence in SERP.
 */
export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteConfig.url}/#organization`,
    name: siteConfig.companyName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    logo: {
      '@type': 'ImageObject',
      url: `${siteConfig.url}${siteConfig.logoPath}`,
      width: 512,
      height: 512,
    },
    sameAs: Object.values(siteConfig.social),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: siteConfig.contact.email,
        availableLanguage: ['English', 'Hindi'],
        areaServed: 'IN',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
  } as const;
}

// ─── Website JSON-LD ───────────────────────────────────────────────────────────

/**
 * Generates WebSite schema with SearchAction for Google Sitelinks Searchbox.
 * Use on the homepage.
 */
export function generateWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      '@id': `${siteConfig.url}/#organization`,
    },
    inLanguage: 'en-IN',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/shop?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  } as const;
}

// ─── BreadcrumbList JSON-LD ────────────────────────────────────────────────────

/**
 * Generates BreadcrumbList schema for any page.
 * Automatically prepends the home crumb.
 *
 * @example
 * generateBreadcrumbJsonLd([
 *   { name: 'Shop', href: '/shop' },
 *   { name: 'Protein Bars', href: '/shop?category=protein-bars' },
 *   { name: 'Dark Choco Bar', href: '/shop/dark-choco-bar' },
 * ])
 */
export function generateBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  const allItems: BreadcrumbItem[] = [
    { name: 'Home', href: '/' },
    ...items,
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.href.startsWith('http')
        ? item.href
        : `${siteConfig.url}${item.href}`,
    })),
  } as const;
}

// ─── Product JSON-LD ───────────────────────────────────────────────────────────

/**
 * Generates Product schema for a product detail page.
 * Supports rich results for Google Shopping and product carousels.
 */
export function generateProductJsonLd(product: ProductJsonLdData) {
  const productUrl = `${siteConfig.url}/shop/${product.slug}`;
  const availability =
    product.inventory > 0
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock';

  const imageList =
    product.images.length > 0
      ? product.images
      : [`${siteConfig.url}${siteConfig.logoPath}`];

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    url: productUrl,
    image: imageList,
    brand: {
      '@type': 'Brand',
      name: product.brand ?? siteConfig.name,
    },
    category: product.category,
    ...(product.sku ? { sku: product.sku, mpn: product.sku } : {}),
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'INR',
      price: product.price.toFixed(2),
      availability,
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: siteConfig.name,
      },
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
    },
  } as const;
}

// ─── WebPage JSON-LD ───────────────────────────────────────────────────────────

/**
 * Generates a generic WebPage schema.
 * Useful for static pages (About, Help, etc.).
 */
export function generateWebPageJsonLd(options: {
  title: string;
  description: string;
  path: string;
}) {
  const url = `${siteConfig.url}${options.path}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}/#webpage`,
    url,
    name: options.title,
    description: options.description,
    isPartOf: { '@id': `${siteConfig.url}/#website` },
    publisher: { '@id': `${siteConfig.url}/#organization` },
    inLanguage: 'en-IN',
  } as const;
}

// ─── ItemList JSON-LD (Category / Shop) ───────────────────────────────────────

/**
 * Generates an ItemList schema for shop/category pages listing products.
 */
export function generateItemListJsonLd(
  items: Array<{ name: string; slug: string; image?: string; price: number }>,
  listName: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: item.name,
        url: `${siteConfig.url}/shop/${item.slug}`,
        image: item.image ?? `${siteConfig.url}${siteConfig.logoPath}`,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'INR',
          price: item.price.toFixed(2),
        },
      },
    })),
  } as const;
}
