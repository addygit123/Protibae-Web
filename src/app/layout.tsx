import type { Metadata, Viewport } from 'next';
import { Bebas_Neue, Hanken_Grotesk } from 'next/font/google';
import './globals.css';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { siteConfig } from '@/config/site';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateOrganizationJsonLd, generateWebSiteJsonLd } from '@/lib/jsonld';

// ─── Fonts ─────────────────────────────────────────────────────────────────────

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const hankenGrotesk = Hanken_Grotesk({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

// ─── Global Metadata ───────────────────────────────────────────────────────────
// This is the root metadata. Every page can override individual fields.
// The titleTemplate ensures consistent branding across all page titles.

export const metadata: Metadata = {
  // Title template: child pages set `title: 'Page Name'` and this template wraps it
  title: {
    default: siteConfig.defaultTitle,
    template: siteConfig.titleTemplate,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords as unknown as string[],
  authors: siteConfig.authors as Metadata['authors'],
  creator: siteConfig.creator,
  publisher: siteConfig.publisher,
  applicationName: siteConfig.name,

  // Canonical base — Next.js uses this to resolve all relative OG/Twitter images
  metadataBase: new URL(siteConfig.url),

  // Robots — allow everything by default; individual pages or robots.ts can restrict
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

  // Open Graph defaults
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — ${siteConfig.tagline}`,
      },
    ],
  },

  // Twitter card defaults
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },

  // Apple PWA / icon config
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: 'black-translucent',
  },

  // Format detection
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // Icons (favicon, apple touch icon, etc.)
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },

  // Web manifest
  manifest: '/site.webmanifest',

  // Canonical default (root)
  alternates: {
    canonical: siteConfig.url,
  },

  // Search engine verification
  ...(siteConfig.verification.google && {
    verification: {
      google: siteConfig.verification.google,
      ...(siteConfig.verification.bing && { other: { 'msvalidate.01': siteConfig.verification.bing } }),
      ...(siteConfig.verification.yandex && { yandex: siteConfig.verification.yandex }),
    },
  }),
};

// ─── Viewport (must be separate export in Next.js 15) ─────────────────────────

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: 'dark',
};

// ─── Root Layout ───────────────────────────────────────────────────────────────

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`dark ${bebasNeue.variable} ${hankenGrotesk.variable}`}
      data-scroll-behavior="smooth"
    >
      <head>
        {/* Google Fonts — Material Symbols */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />

        {/* Global Organization + WebSite JSON-LD — present on every page */}
        <JsonLd
          id="jsonld-organization"
          data={generateOrganizationJsonLd()}
        />
        <JsonLd
          id="jsonld-website"
          data={generateWebSiteJsonLd()}
        />
      </head>
      <body className="bg-[#121317] text-[#e3e2e7] antialiased">
        <AuthProvider>
          {/* Announcement Bar — above everything */}
          <AnnouncementBar />

          {/* Sticky Navbar */}
          <Navbar />

          {/* Page Content — skip-to-content anchor for accessibility & SEO */}
          <main id="main-content">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
