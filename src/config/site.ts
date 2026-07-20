// Site-wide configuration — single source of truth for SEO and content
// Uses NEXT_PUBLIC_SITE_URL env variable as canonical base URL (no localhost hardcoding)

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://protibae.com';

export const siteConfig = {
  // Core identity
  name: 'PROTIBAE',
  companyName: 'Protibae Nutrition Pvt. Ltd.',
  tagline: 'Performance Nutrition',
  description:
    'High-performance nutrition for the modern athlete. Fuel your ambition with clean protein bars crafted from real ingredients — zero compromise, pure power.',

  // Canonical base URL — driven by env, never localhost
  url: SITE_URL,

  // SEO title template
  titleTemplate: '%s | PROTIBAE',
  defaultTitle: 'PROTIBAE | Performance Nutrition',

  // Keywords used in global metadata
  keywords: [
    'protein bars',
    'performance nutrition',
    'high protein snacks',
    'clean ingredients',
    'sports nutrition',
    'protein snacks India',
    'healthy protein bars',
    'PROTIBAE',
    'fitness nutrition',
    'athlete food',
    'natural protein',
    'low sugar protein bar',
  ],

  // Authors & attribution
  authors: [{ name: 'PROTIBAE', url: SITE_URL }],
  creator: 'PROTIBAE',
  publisher: 'Protibae Nutrition Pvt. Ltd.',

  // Default Open Graph image (must exist in /public)
  ogImage: `${SITE_URL}/og-image.jpg`,

  // Logo path (relative to /public)
  logoPath: '/logo.png',

  // Theme
  themeColor: '#c41e5c',

  // Locale
  locale: 'en_IN',
  alternateLocales: ['en_US'],

  // Robots defaults
  robots: {
    index: true,
    follow: true,
  },

  // Social links (placeholders — update when accounts are created)
  social: {
    instagram: 'https://instagram.com/protibae',
    twitter: 'https://twitter.com/protibae',
    facebook: 'https://facebook.com/protibae',
    youtube: 'https://youtube.com/@protibae',
    linkedin: 'https://linkedin.com/company/protibae',
  },

  // Twitter handle
  twitterHandle: '@protibae',

  // Search engine verification (add real values in .env or here when available)
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? '',
    bing: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ?? '',
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION ?? '',
  },

  // Contact
  contact: {
    email: 'hello@protibae.com',
    phone: '+91-XXXXXXXXXX',
    address: 'India',
  },
} as const;

// ─── Navigation Links ──────────────────────────────────────────────────────────

export const navLinks = [
  { label: 'SHOP', href: '/shop' },
  { label: 'PROTEIN BARS', href: '/shop' },
  { label: 'REWARDS', href: '/rewards' },
  { label: 'OUR STORY', href: '/our-story' },
  { label: 'HELP', href: '/help' },
] as const;

export const footerLinks = {
  shop: [
    { label: 'SHOP ALL', href: '/shop' },
    { label: 'BEST SELLERS', href: '/shop?sort=best-sellers' },
    { label: 'SUBSCRIPTION', href: '/subscription' },
  ],
  account: [
    { label: 'MY ACCOUNT', href: '/account' },
    { label: 'ORDER TRACKING', href: '/account/orders' },
    { label: 'SHIPPING POLICY', href: '/shipping' },
  ],
  help: [
    { label: 'CONTACT US', href: '/help' },
    { label: 'FAQs', href: '/help' },
    { label: 'REFUND POLICY', href: '/refund-policy' },
  ],
} as const;

// ─── Category Labels ───────────────────────────────────────────────────────────

export const CATEGORY_LABELS: Record<string, string> = {
  'protein-bars': 'Protein Bars',
  'nuts-seeds': 'Nuts & Seeds',
  combos: 'Combo Packs',
  all: 'All Collections',
};

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'protein-bars':
    'Premium protein bars crafted with real ingredients. High protein, low sugar, and packed with flavor.',
  'nuts-seeds':
    'Natural nuts and seeds, ethically sourced and packed for maximum nutrition.',
  combos:
    'Curated combo packs for the athlete who wants it all. Save more, train harder.',
};
