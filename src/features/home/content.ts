import { shipping } from '@/config/site';
import { formatPrice } from '@/lib/utils';

/* ===========================================================================
   HOMEPAGE CONTENT
   ---------------------------------------------------------------------------
   Every word and link on the homepage, kept apart from the layout code so
   copy can change without touching components. Photo names refer to
   editorial/<name>.jpg in the photo storage (see src/content/demo-photos.json).

   Claims here must be ones the business can stand behind — no invented
   certifications, ratings, customer counts or discounts.
   =========================================================================== */

export const hero = {
  eyebrow: 'Tradition meets tomorrow',
  titleLines: ['Woven for', 'every forever'],
  body: 'Kanchipuram silks and festive weaves, chosen for the weight of the silk and the gleam of the zari — for the days you will want to remember.',
  primary: { label: 'Explore collections', href: '/collections' },
  secondary: { label: 'Our story', href: '/about' },
  photo: 'hero',
  promises: [
    'Handpicked silk sarees',
    `Free shipping above ${formatPrice(shipping.freeAbove)}`,
    'Quality checked before dispatch',
  ],
} as const;

/** The scrolling band under the hero. */
export const marquee = [
  'Handpicked Kanchipuram silks',
  `Free shipping on orders above ${formatPrice(shipping.freeAbove)}`,
  'Quality checked, piece by piece',
  'Pan-India delivery with tracking',
  'Secure checkout',
  'A care guide for every saree',
] as const;

export const moods = {
  title: 'Six moods.',
  kicker: 'Find the drape that fits the day',
  items: [
    { label: 'Heirloom', href: '/collections/kanchipuram', photo: 'mood-heirloom' },
    { label: 'Festive', href: '/collections/festive', photo: 'mood-festive' },
    { label: 'Regal', href: '/collections/bridal', photo: 'mood-regal' },
    { label: 'Garden', href: '/collections/everyday', photo: 'mood-garden' },
    { label: 'Contemporary', href: '/collections/new-arrivals', photo: 'mood-contemporary' },
    { label: 'Evening', href: '/shop?color=green,blue,purple', photo: 'mood-evening' },
  ],
} as const;

export const remembered = {
  eyebrow: 'The signature pieces',
  title: 'Woven to be',
  accent: 'Remembered',
  cta: { label: 'Shop signatures', href: '/shop' },
} as const;

export const bridal = {
  eyebrow: 'For the wedding',
  title: 'The Bridal Collection',
  body: 'Heavy silks, broad temple borders and pallus worked edge to edge in zari.',
  cta: { label: 'View the collection', href: '/collections/bridal' },
  photo: 'bridal',
} as const;

export const season = {
  eyebrow: 'Season edit',
  titleLines: ['Festive', 'Season 2026'],
  body: 'Deep reds, temple gold and the first cool evenings — the sarees we reach for from Navratri to the wedding season.',
  cta: { label: 'Explore the edit', href: '/collections/festive' },
  photos: ['mood-regal', 'temple-walk', 'edit-atelier'],
} as const;

export const spotlight = {
  label: 'New drop 2026',
  changeLook: 'Change look',
} as const;

export const occasions = {
  title: 'Edits for',
  accent: 'every occasion',
  cta: { label: 'All collections', href: '/collections' },
  items: [
    {
      label: 'The Wedding Edit',
      note: 'Bridal silks',
      href: '/collections/bridal',
      photo: 'edit-wedding',
    },
    {
      label: 'Heritage Weaves',
      note: 'Kanchipuram',
      href: '/collections/kanchipuram',
      photo: 'edit-heritage',
    },
    {
      label: 'The New Drape',
      note: 'Just arrived',
      href: '/collections/new-arrivals',
      photo: 'edit-new-drape',
    },
    {
      label: 'Everyday Atelier',
      note: 'Light silks',
      href: '/collections/everyday',
      photo: 'edit-atelier',
    },
  ],
} as const;

export const attention = {
  eyebrow: 'Curated for you',
  title: 'Worth your attention',
  items: [
    { label: 'Bridal reds', href: '/shop?color=red,maroon&category=bridal', photo: 'offer-1' },
    { label: 'Veils & drapes', href: '/collections/bridal', photo: 'offer-2' },
    { label: 'The celebration edit', href: '/collections/festive', photo: 'offer-3' },
    { label: 'Evening silks', href: '/shop?color=maroon,purple', photo: 'offer-4' },
    { label: 'Heirloom zari', href: '/collections/kanchipuram', photo: 'offer-5' },
    { label: 'Under ₹10,000', href: '/shop?price=under-10k', photo: 'offer-6' },
  ],
} as const;

export const story = {
  eyebrow: 'The ceremony story',
  titleLines: ['First', 'Light'],
  body: 'Morning prayers, marigold and the rustle of new silk. The sarees made for the first hour of the celebration.',
  cta: { label: 'Read our story', href: '/about' },
  photo: 'story',
} as const;

export const trends = {
  titleLines: ['Latest', 'Trends'],
  cta: { label: 'Discover now', href: '/collections/new-arrivals' },
  photo: 'trends',
  storyTitle: 'Stories behind the drape',
  storyBody:
    'Every border carries a motif — temple towers, mango buttas, rudraksha beads — each with a story older than the loom it was woven on.',
  rangeTitle: 'Explore the range',
} as const;
