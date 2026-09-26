import type { MetadataRoute } from 'next';
import { site } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Transactional and personal routes carry no SEO value and should
        // never appear in results.
        disallow: ['/cart', '/checkout', '/wishlist', '/account', '/legal/'],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
