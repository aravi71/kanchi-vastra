import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { site } from '@/config/site';
import '@/styles/globals.css';

/* Self-hosted at build time by next/font — no render-blocking request to
   Google, and no layout shift from a late swap. */
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'Kanchi Vastra | Timeless Kanchipuram Silk Sarees',
    template: '%s | Kanchi Vastra',
  },
  description: site.description,
  keywords: [
    'Kanchipuram silk saree',
    'Kanjivaram saree',
    'silk saree',
    'bridal silk saree',
    'South Indian saree',
    'Kanchi Vastra',
  ],
  applicationName: site.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: 'Kanchi Vastra | Timeless Kanchipuram Silk Sarees',
    description: site.description,
    locale: 'en_IN',
    url: site.url,
    images: [{ url: '/images/editorial/hero.svg', width: 1920, height: 1080, alt: site.tagline }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kanchi Vastra | Timeless Kanchipuram Silk Sarees',
    description: site.description,
    images: ['/images/editorial/hero.svg'],
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/favicon.svg' }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#faf6ee',
  width: 'device-width',
  initialScale: 1,
};

/** Organization + WebSite structured data, emitted once for the whole site. */
const organizationLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${site.url}/#organization`,
      name: site.name,
      url: site.url,
      logo: `${site.url}/logo/logo-primary.svg`,
      description: site.description,
    },
    {
      '@type': 'WebSite',
      '@id': `${site.url}/#website`,
      url: site.url,
      name: site.name,
      publisher: { '@id': `${site.url}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${site.url}/shop?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

/** Document shell only. The storefront frame lives in (store)/layout.tsx. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="min-h-screen antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        {children}
      </body>
    </html>
  );
}
