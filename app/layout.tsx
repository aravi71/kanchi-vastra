import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { site } from '@/data/site';
import { CartProvider } from '@/lib/store/cart';
import { WishlistProvider } from '@/lib/store/wishlist';
import { UiProvider } from '@/lib/store/ui';
import { CatalogueProvider } from '@/lib/store/catalogue';
import { getProducts } from '@/lib/catalogue';
import { SiteChrome } from '@/components/layout/SiteChrome';
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Fetched once per render and handed to client components through context,
  // so the cart, wishlist and search can look products up in the browser
  // without ever talking to the CMS themselves.
  const products = await getProducts();

  return (
    <html lang="en-IN" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="min-h-screen antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-wine-800 focus:px-5 focus:py-3 focus:text-ivory-50 focus:eyebrow"
        >
          Skip to content
        </a>
        <CatalogueProvider products={products}>
          <UiProvider>
            <WishlistProvider>
              <CartProvider>
                <SiteChrome>{children}</SiteChrome>
              </CartProvider>
            </WishlistProvider>
          </UiProvider>
        </CatalogueProvider>
      </body>
    </html>
  );
}
