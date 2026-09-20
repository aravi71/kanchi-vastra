import { Hero } from '@/components/home/Hero';
import { HeritageStory } from '@/components/home/HeritageStory';
import { CollectionsShowcase } from '@/components/home/CollectionsShowcase';
import { FeaturedRail } from '@/components/home/FeaturedRail';
import { CraftSection } from '@/components/home/CraftSection';
import { TrustSection } from '@/components/home/TrustSection';
import { SocialSection } from '@/components/home/SocialSection';
import { EditorialQuote } from '@/components/home/EditorialQuote';
import { getFeaturedProducts, getNewArrivals, getProducts } from '@/lib/catalogue';

export default async function HomePage() {
  const [featured, arrivals, all] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
    getProducts(),
  ]);

  return (
    <>
      <Hero />
      <TrustSection />
      <HeritageStory />
      <CollectionsShowcase products={all} />
      {featured.length > 0 && (
        <FeaturedRail
          eyebrow="Signature Pieces"
          title="The weaves we are showing this season"
          description="A short edit from across the collection — the sarees that best represent how we think about colour, weight and ornament."
          href="/shop"
          hrefLabel="All Sarees"
          products={featured.slice(0, 4)}
        />
      )}
      <EditorialQuote />
      <CraftSection />
      {arrivals.length > 0 && (
        <FeaturedRail
          eyebrow="New Arrivals"
          title="Latest on the loom"
          href="/collections/new-arrivals"
          hrefLabel="View New Arrivals"
          products={arrivals.slice(0, 4)}
        />
      )}
      <SocialSection />
    </>
  );
}
