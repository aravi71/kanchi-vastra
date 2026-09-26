import { Hero } from '@/features/home/components/Hero';
import { HeritageStory } from '@/features/home/components/HeritageStory';
import { CollectionsShowcase } from '@/features/home/components/CollectionsShowcase';
import { FeaturedRail } from '@/features/home/components/FeaturedRail';
import { CraftSection } from '@/features/home/components/CraftSection';
import { TrustSection } from '@/features/home/components/TrustSection';
import { SocialSection } from '@/features/home/components/SocialSection';
import { EditorialQuote } from '@/features/home/components/EditorialQuote';
import {
  getFeaturedProducts,
  getNewArrivals,
  getProducts,
} from '@/features/catalog/server/catalogue';

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
