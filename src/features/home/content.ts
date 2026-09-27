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
  kicker: 'Silks woven for the days you remember.',
  primary: { label: 'Explore collections', href: '/collections' },
  secondary: { label: 'New arrivals', href: '/collections/new-arrivals' },
  /** The shop's own photograph (scripts/media-editorial-upload.sh). */
  photo: 'hero-own-v2',
  photoAlt: 'Woman in a pink silk saree outside a stone temple',
} as const;

export const newArrivals = {
  eyebrow: 'Fresh from the loom',
  title: 'New Arrivals',
  kicker: 'Kanchipuram silks and festive weaves, chosen for the weight of the silk.',
  cta: { label: 'View all new arrivals', href: '/collections/new-arrivals' },
} as const;

export const occasions = {
  eyebrow: 'Discover',
  title: 'Edits for every occasion',
  kicker: 'Find the drape that fits the day.',
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

export const bridal = {
  eyebrow: 'For the wedding',
  title: 'The Bridal Collection',
  kicker: 'Heavy silks, broad temple borders and pallus worked edge to edge in zari.',
  photoLine: ['Red silk,', 'temple gold,', 'forever.'],
  cta: { label: 'View the collection', href: '/collections/bridal' },
  photo: 'bridal',
} as const;

export const signatures = {
  eyebrow: 'The signature pieces',
  title: 'Woven to be Remembered',
  kicker: 'The sarees we would choose first.',
  cta: { label: 'Shop signatures', href: '/shop' },
} as const;

/** Four promises, each one the business can keep. */
export const promises = [
  { label: 'Handpicked Kanchipuram silks', icon: 'sparkles' },
  { label: 'Quality checked, piece by piece', icon: 'shield' },
  { label: `Free shipping above ${formatPrice(shipping.freeAbove)}`, icon: 'truck' },
  { label: 'Secure checkout', icon: 'lock' },
] as const;

export const story = {
  eyebrow: 'The ceremony story',
  title: 'First',
  accent: 'Light.',
  body: 'Morning prayers, marigold and the rustle of new silk. The sarees made for the first hour of the celebration.',
  note: 'Every border carries a motif — temple towers, mango buttas, rudraksha beads — each with a story older than the loom it was woven on.',
  cta: { label: 'Read our story', href: '/about' },
  photo: 'story',
} as const;

export const closing = {
  lines: ['Silk that remembers', 'every celebration'],
  body: 'Where South Indian heritage meets contemporary elegance.',
} as const;
