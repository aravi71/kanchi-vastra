import type { MetadataRoute } from 'next';
import { getProducts } from '@/features/catalog/server/catalogue';
import { collections } from '@/content/collections';
import { legalPages } from '@/content/legal';
import { site } from '@/config/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const now = new Date();
  const url = (path: string) => `${site.url}${path}`;

  const staticPages: MetadataRoute.Sitemap = [
    { url: url('/'), lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: url('/shop'), lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: url('/collections'), lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: url('/about'), lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: url('/contact'), lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: url('/faq'), lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: url('/care-guide'), lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  const collectionPages: MetadataRoute.Sitemap = collections.map((c) => ({
    url: url(`/collections/${c.slug}`),
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: url(`/product/${p.slug}`),
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Legal drafts are noindex until reviewed, so they are listed at low
  // priority for discovery only.
  const legal: MetadataRoute.Sitemap = Object.keys(legalPages).map((slug) => ({
    url: url(`/legal/${slug}`),
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.2,
  }));

  return [...staticPages, ...collectionPages, ...productPages, ...legal];
}
