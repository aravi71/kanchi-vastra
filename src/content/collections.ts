import type { Collection, CategoryId, ColorFamily, Fabric } from '@/types/catalog';

export const collections: Collection[] = [
  {
    slug: 'kanchipuram',
    title: 'Kanchipuram Silks',
    tagline: 'The house weave',
    description:
      'Traditional silk sarees featuring rich zari borders and timeless motifs, woven in the manner associated with Kanchipuram.',
    image: '/images/editorial/collection-kanchipuram.svg',
    category: 'kanchipuram',
  },
  {
    slug: 'bridal',
    title: 'Bridal Silks',
    tagline: 'For the day itself',
    description:
      'Statement sarees for weddings and celebrations — heavier weaves, fuller pallus, and deeper grounds.',
    image: '/images/editorial/collection-bridal.svg',
    category: 'bridal',
  },
  {
    slug: 'festive',
    title: 'Festive Collection',
    tagline: 'Season of light',
    description:
      'Elegant sarees for festivals and special occasions, in colours that hold their warmth under evening light.',
    image: '/images/editorial/collection-festive.svg',
    category: 'festive',
  },
  {
    slug: 'everyday',
    title: 'Everyday Elegance',
    tagline: 'Silk, unceremonious',
    description:
      'Sophisticated sarees for modern occasions — lighter weaves that drape close and wear comfortably all day.',
    image: '/images/editorial/collection-everyday.svg',
    category: 'everyday',
  },
  {
    slug: 'new-arrivals',
    title: 'New Arrivals',
    tagline: 'Latest on the loom',
    description: 'Recently added designs across every collection.',
    image: '/images/editorial/collection-new-arrivals.svg',
  },
];

export const getCollection = (slug: string): Collection | undefined =>
  collections.find((c) => c.slug === slug);

/* --- Filter vocabularies shared by the shop UI --------------------------- */

export const categories: { id: CategoryId; label: string }[] = [
  { id: 'kanchipuram', label: 'Kanchipuram Silks' },
  { id: 'bridal', label: 'Bridal Silks' },
  { id: 'festive', label: 'Festive' },
  { id: 'everyday', label: 'Everyday Elegance' },
];

export const colorFamilies: { id: ColorFamily; label: string; hex: string }[] = [
  { id: 'red', label: 'Red & Coral', hex: '#B01E2E' },
  { id: 'maroon', label: 'Maroon & Wine', hex: '#6E2038' },
  { id: 'gold', label: 'Gold & Ivory', hex: '#C9A24B' },
  { id: 'green', label: 'Green & Teal', hex: '#14603F' },
  { id: 'blue', label: 'Blue & Indigo', hex: '#24356B' },
  { id: 'purple', label: 'Purple', hex: '#4A2A6B' },
  { id: 'pink', label: 'Pink & Blush', hex: '#E8B7BE' },
  { id: 'saffron', label: 'Saffron & Turmeric', hex: '#D98324' },
  { id: 'neutral', label: 'Neutral', hex: '#D9C6A5' },
];

export const fabrics: Fabric[] = [
  'Pure Mulberry Silk',
  'Korvai Silk',
  'Tissue Silk',
  'Silk Cotton',
  'Organza Silk',
];

/** Price brackets offered in the shop filter, in whole rupees. */
export const priceBands: { id: string; label: string; min: number; max: number }[] = [
  { id: 'under-10k', label: 'Under ₹10,000', min: 0, max: 9999 },
  { id: '10k-20k', label: '₹10,000 – ₹20,000', min: 10000, max: 19999 },
  { id: '20k-30k', label: '₹20,000 – ₹30,000', min: 20000, max: 29999 },
  { id: 'above-30k', label: 'Above ₹30,000', min: 30000, max: Number.MAX_SAFE_INTEGER },
];
