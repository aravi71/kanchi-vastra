import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug, getProducts, getRelatedProducts } from '@/lib/catalogue';
import { getCollection } from '@/data/collections';
import { site } from '@/data/site';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProductGallery } from '@/components/product/ProductGallery';
import { BuyBox } from '@/components/product/BuyBox';
import { StickyBuyBar } from '@/components/product/StickyBuyBar';
import { FeaturedRail } from '@/components/home/FeaturedRail';
import { Accordion } from '@/components/ui/Accordion';
import { formatPrice } from '@/lib/utils';

/** Pre-render every product page at build time. */
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Saree not found' };

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      type: 'website',
      title: `${product.name} | Kanchi Vastra`,
      description: product.description,
      images: [{ url: product.images[0], width: 1000, height: 1333, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: [product.images[0]],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const collection = getCollection(product.category);
  const related = await getRelatedProducts(product, 4);

  /**
   * Product structured data. `availability` and `price` are driven by the
   * same catalogue the page renders, so the markup can never drift from what
   * the shopper is looking at.
   */
  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.sku,
    image: product.images.map((i) => `${site.url}${i}`),
    brand: { '@type': 'Brand', name: site.name },
    color: product.color,
    material: product.fabric,
    offers: {
      '@type': 'Offer',
      url: `${site.url}/product/${product.slug}`,
      priceCurrency: 'INR',
      price: product.price,
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: site.name },
    },
  };

  const specs: [string, string][] = [
    ['Fabric', product.fabric],
    ['Weave', product.specs.weave],
    ['Zari', product.specs.zari],
    ['Saree length', product.specs.length],
    ['Width', product.specs.width],
    ['Blouse', product.specs.blouse],
    ['Weight', product.specs.weight],
    ['Colour', product.color],
    ['SKU', product.sku],
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />

      <PageHeader
        title=""
        className="pb-0 md:pb-0"
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Sarees', href: '/shop' },
          ...(collection ? [{ label: collection.title, href: `/collections/${collection.slug}` }] : []),
          { label: product.name },
        ]}
      />

      <div className="container-editorial pb-20 md:pb-28">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] lg:gap-16 xl:gap-24">
          <ProductGallery images={product.images} name={product.name} />
          <div className="lg:pt-2">
            <BuyBox product={product} />
          </div>
        </div>
      </div>

      {/* --- the story + specifications -------------------------------- */}
      <section className="border-t border-ivory-300 bg-ivory-200/40 py-20 md:py-28">
        <div className="container-editorial">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-24">
            <div>
              <h2 className="eyebrow text-wine-700">About this weave</h2>
              <p className="mt-7 text-[1.0625rem] leading-[1.9] text-ink-700">{product.story}</p>

              <dl className="mt-10 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {specs.map(([label, value]) => (
                  <div key={label} className="border-b border-ivory-300 pb-3">
                    <dt className="eyebrow-sm text-ink-400">{label}</dt>
                    <dd className="mt-1.5 text-sm text-ink-800">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <Accordion
                defaultOpen="care"
                items={[
                  {
                    id: 'care',
                    title: 'Care Instructions',
                    content: (
                      <div className="space-y-3">
                        <p>{product.specs.care}</p>
                        <p>
                          Silk should be kept away from direct sunlight and damp. Refold the
                          saree along a different line every few months so the zari does not
                          crease permanently along one fold.
                        </p>
                        <Link href="/care-guide" className="link-underline inline-block text-wine-700">
                          Read the full care guide
                        </Link>
                      </div>
                    ),
                  },
                  {
                    id: 'shipping',
                    title: 'Shipping',
                    content: (
                      <div className="space-y-3">
                        <p>
                          We ship across India. Estimated delivery is 5–7 business days from
                          dispatch, with tracking shared by email.
                        </p>
                        <p>
                          Complimentary shipping applies to orders above{' '}
                          {formatPrice(15000)}.
                        </p>
                        <p className="text-ink-400">
                          Shipping partners and precise timelines will be confirmed before
                          launch.
                        </p>
                        <Link href="/legal/shipping" className="link-underline inline-block text-wine-700">
                          Shipping policy
                        </Link>
                      </div>
                    ),
                  },
                  {
                    id: 'returns',
                    title: 'Returns & Exchanges',
                    content: (
                      <div className="space-y-3">
                        <p>
                          Returns are accepted on unworn, unwashed sarees with original tags
                          intact. The saree must be in the condition it arrived in.
                        </p>
                        <p className="text-ink-400">
                          The return window and process are being finalised and will be
                          published here before the store opens for orders.
                        </p>
                        <Link href="/legal/returns" className="link-underline inline-block text-wine-700">
                          Returns policy
                        </Link>
                      </div>
                    ),
                  },
                  {
                    id: 'authenticity',
                    title: 'About the imagery',
                    content: (
                      <p>
                        The images on this page are original artwork created for this
                        demonstration build, not photographs of the saree described. They will
                        be replaced with photography of the actual piece before launch.
                      </p>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      <FeaturedRail
        eyebrow="You may also like"
        title="From the same collection"
        href="/shop"
        hrefLabel="All Sarees"
        products={related}
      />

      <StickyBuyBar product={product} />
    </>
  );
}
