// Site-wide configuration — single source of truth for content

export const siteConfig = {
  name: 'PROTIBAE',
  tagline: 'Performance Nutrition',
  description:
    'High-performance nutrition for the modern athlete. Fuel your ambition with the power of real ingredients.',
  url: 'https://protibae.com',
  ogImage: '/og-image.jpg',
} as const;

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
    { label: 'CONTACT US', href: '/support' },
    { label: 'FAQs', href: '/support/faq' },
    { label: 'REFUND POLICY', href: '/refund-policy' },
  ],
} as const;
