import type { Product } from '@/lib/types';

/* ===========================================================================
   DEMONSTRATION CATALOGUE
   ---------------------------------------------------------------------------
   Every product below — name, price, SKU, stock figure, description and
   image — is placeholder content created for this build. None of it
   represents actual Sri Kanchi Silks merchandise or pricing, and all of it
   must be replaced with official product data before launch.

   To replace: edit the entries here. Keep `slug` stable (it is the URL) and
   keep the image filenames, or point `images` at new files you drop into
   /public/images/products. No component changes are required.
   =========================================================================== */

/**
 * File extension for product photography.
 *
 * The demo artwork is SVG. When you replace it with real photographs, change
 * this ONE line to 'jpg' (or 'webp') and name your files to match the pattern
 * below — you do not need to edit twenty separate image arrays.
 *
 * Remember to also remove `dangerouslyAllowSVG` from next.config.ts once no
 * SVG images remain.
 */
const IMAGE_EXT = 'svg';

/**
 * Builds the four image paths for a product:
 *   /images/products/<slug>-1.<ext>  main shot, full drape
 *   /images/products/<slug>-2.<ext>  border / selvedge detail
 *   /images/products/<slug>-3.<ext>  pallu detail
 *   /images/products/<slug>-4.<ext>  weave close-up
 *
 * Shoot in 3:4 portrait — the grid, gallery and cards are all built around it.
 * A product can override this by setting `images` to an explicit array.
 */
const img = (slug: string) =>
  [1, 2, 3, 4].map((n) => `/images/products/${slug}-${n}.${IMAGE_EXT}`);

export const products: Product[] = [
  {
    id: 'sks-001',
    slug: 'kanchipuram-ruby-zari-silk-saree',
    name: 'Kanchipuram Ruby Zari Silk Saree',
    price: 18500,
    category: 'kanchipuram',
    collections: ['kanchipuram', 'new-arrivals'],
    color: 'Ruby Red',
    colorFamily: 'red',
    colorHex: '#9B1B30',
    fabric: 'Pure Mulberry Silk',
    description:
      'Deep ruby meets antique gold in a timeless silk composition, framed by a traditional zari border drawn from South Indian architectural motifs.',
    story:
      'The body carries an even scatter of lotus buttas, each one lifted in gold against a saturated ruby ground. Along the selvedge, a contrast border steps inward in the manner of a temple cornice, and the pallu closes the drape with a sequence of broad and fine zari courses. A saree built for the occasions that ask for weight and presence.',
    specs: {
      length: '6.3 metres including blouse piece',
      width: '48 inches',
      blouse: '0.8 metre contrast blouse piece attached',
      zari: 'Half-fine gold zari',
      weight: 'Approx. 750 g',
      weave: 'Traditional Kanchipuram handloom technique',
      care: 'Dry clean only. Store folded in cotton muslin.',
    },
    sku: 'SKS-KAN-001',
    stock: 4,
    images: img('kanchipuram-ruby-zari-silk-saree'),
    featured: true,
    newArrival: true,
  },
  {
    id: 'sks-002',
    slug: 'temple-border-crimson-silk',
    name: 'Temple Border Crimson Silk',
    price: 12500,
    category: 'kanchipuram',
    collections: ['kanchipuram'],
    color: 'Crimson',
    colorFamily: 'red',
    colorHex: '#B01E2E',
    fabric: 'Pure Mulberry Silk',
    description:
      'A crimson drape edged with the stepped temple border that gives the weave its name — restrained on the body, decisive at the selvedge.',
    story:
      'The temple border, or thazhampoo rekku, is among the oldest devices in South Indian weaving: a row of stepped spires running the length of the saree. Here it is worked in gold against a darkened crimson edge, while the body is left comparatively quiet so the border can do the speaking.',
    specs: {
      length: '6.3 metres including blouse piece',
      width: '47 inches',
      blouse: '0.8 metre matching blouse piece attached',
      zari: 'Half-fine gold zari',
      weight: 'Approx. 680 g',
      weave: 'Traditional Kanchipuram handloom technique',
      care: 'Dry clean only. Store folded in cotton muslin.',
    },
    sku: 'SKS-KAN-002',
    stock: 7,
    images: img('temple-border-crimson-silk'),
  },
  {
    id: 'sks-003',
    slug: 'peacock-motif-heritage-silk',
    name: 'Peacock Motif Heritage Silk',
    price: 24900,
    category: 'kanchipuram',
    collections: ['kanchipuram', 'new-arrivals'],
    color: 'Peacock Teal',
    colorFamily: 'green',
    colorHex: '#0E5B60',
    fabric: 'Korvai Silk',
    description:
      'Peacock plumes in fine zari open across a deep teal ground, met at the border by a contrast weave joined thread by thread.',
    story:
      'Korvai is the technique of joining a contrast border to the body by interlocking the warp by hand — slow, exacting, and visible in the crispness of the seam. The plume motif is set at a generous interval so the teal is allowed to hold its depth rather than disappear under ornament.',
    specs: {
      length: '6.3 metres including blouse piece',
      width: '48 inches',
      blouse: '0.8 metre contrast blouse piece attached',
      zari: 'Fine gold zari',
      weight: 'Approx. 820 g',
      weave: 'Korvai — hand-interlocked contrast border',
      care: 'Dry clean only. Store folded in cotton muslin.',
    },
    sku: 'SKS-KAN-003',
    stock: 3,
    images: img('peacock-motif-heritage-silk'),
    featured: true,
    newArrival: true,
  },
  {
    id: 'sks-004',
    slug: 'antique-gold-bridal-kanjivaram',
    name: 'Antique Gold Bridal Kanjivaram',
    price: 32000,
    compareAtPrice: 36500,
    category: 'bridal',
    collections: ['bridal', 'kanchipuram'],
    color: 'Antique Gold',
    colorFamily: 'gold',
    colorHex: '#C9A24B',
    fabric: 'Korvai Silk',
    description:
      'An antique gold body against a wine border — the pairing South Indian brides have returned to for generations, cut with a contemporary restraint.',
    story:
      'Mango buttas run the length of a warm gold ground, echoing in the wine border and gathering into a densely worked pallu. This is a saree with real weight to it, designed to hold its pleats through a long day and to photograph with depth rather than glare.',
    specs: {
      length: '6.5 metres including blouse piece',
      width: '48 inches',
      blouse: '0.9 metre contrast blouse piece attached',
      zari: 'Fine gold zari, antique finish',
      weight: 'Approx. 980 g',
      weave: 'Korvai — hand-interlocked contrast border',
      care: 'Dry clean only. Store folded in cotton muslin, refold every few months.',
    },
    sku: 'SKS-BRD-004',
    stock: 2,
    images: img('antique-gold-bridal-kanjivaram'),
    featured: true,
  },
  {
    id: 'sks-005',
    slug: 'emerald-temple-weave',
    name: 'Emerald Temple Weave',
    price: 15900,
    category: 'kanchipuram',
    collections: ['kanchipuram', 'festive'],
    color: 'Emerald',
    colorFamily: 'green',
    colorHex: '#14603F',
    fabric: 'Pure Mulberry Silk',
    description:
      'A saturated emerald ground with stepped temple spires in gold — a clear, architectural saree that reads well in daylight.',
    story:
      'Green silk is difficult to get right; too yellow and it flattens, too blue and it turns cold. This ground sits deliberately in the middle, so the gold reads warm against it. The temple motif repeats on both the body and the border, at two different scales.',
    specs: {
      length: '6.3 metres including blouse piece',
      width: '47 inches',
      blouse: '0.8 metre contrast blouse piece attached',
      zari: 'Half-fine gold zari',
      weight: 'Approx. 720 g',
      weave: 'Traditional Kanchipuram handloom technique',
      care: 'Dry clean only. Store folded in cotton muslin.',
    },
    sku: 'SKS-KAN-005',
    stock: 5,
    images: img('emerald-temple-weave'),
  },
  {
    id: 'sks-006',
    slug: 'lotus-zari-kanchipuram',
    name: 'Lotus Zari Kanchipuram',
    price: 18500,
    category: 'kanchipuram',
    collections: ['kanchipuram', 'bridal'],
    color: 'Ivory Gold',
    colorFamily: 'gold',
    colorHex: '#F2E6CE',
    fabric: 'Pure Mulberry Silk',
    description:
      'Eight-petal lotus buttas worked in deep gold across an ivory ground, bordered in warm antique brass.',
    story:
      'An unusually quiet Kanchipuram. The ivory ground is left largely open, with the lotus set at a wide interval and the ornament concentrated at the border and pallu. It suits daytime ceremonies, and it suits being photographed without a flash.',
    specs: {
      length: '6.3 metres including blouse piece',
      width: '48 inches',
      blouse: '0.8 metre contrast blouse piece attached',
      zari: 'Half-fine gold zari',
      weight: 'Approx. 700 g',
      weave: 'Traditional Kanchipuram handloom technique',
      care: 'Dry clean only. Keep away from prolonged direct sunlight.',
    },
    sku: 'SKS-KAN-006',
    stock: 6,
    images: img('lotus-zari-kanchipuram'),
    featured: true,
  },
  {
    id: 'sks-007',
    slug: 'maroon-bridal-heritage-silk',
    name: 'Maroon Bridal Heritage Silk',
    price: 32000,
    category: 'bridal',
    collections: ['bridal'],
    color: 'Maroon',
    colorFamily: 'maroon',
    colorHex: '#6E2038',
    fabric: 'Korvai Silk',
    description:
      'Deep maroon carried by a heavy zari pallu — a bridal weave built for ceremony rather than for subtlety.',
    story:
      'The pallu runs nearly a metre, layered with broad zari courses and a closing row of mango motifs. Maroon holds gold better than almost any other ground, which is why it remains the default for South Indian bridal silk. Weighted, structured, and unhurried.',
    specs: {
      length: '6.5 metres including blouse piece',
      width: '48 inches',
      blouse: '0.9 metre contrast blouse piece attached',
      zari: 'Fine gold zari',
      weight: 'Approx. 1,020 g',
      weave: 'Korvai — hand-interlocked contrast border',
      care: 'Dry clean only. Store folded in cotton muslin, refold every few months.',
    },
    sku: 'SKS-BRD-007',
    stock: 2,
    images: img('maroon-bridal-heritage-silk'),
  },
  {
    id: 'sks-008',
    slug: 'royal-purple-zari-silk',
    name: 'Royal Purple Zari Silk',
    price: 15900,
    category: 'festive',
    collections: ['festive', 'new-arrivals'],
    color: 'Royal Purple',
    colorFamily: 'purple',
    colorHex: '#4A2A6B',
    fabric: 'Pure Mulberry Silk',
    description:
      'Faceted diamond buttas in gold across a deep violet ground, with a narrow, precisely drawn border.',
    story:
      'Purple sits slightly outside the traditional Kanchipuram palette, which is exactly what makes it useful — it reads as festive without reading as bridal. The diamond butta keeps the surface geometric and the border deliberately narrow.',
    specs: {
      length: '6.3 metres including blouse piece',
      width: '47 inches',
      blouse: '0.8 metre contrast blouse piece attached',
      zari: 'Half-fine gold zari',
      weight: 'Approx. 690 g',
      weave: 'Traditional Kanchipuram handloom technique',
      care: 'Dry clean only. Store folded in cotton muslin.',
    },
    sku: 'SKS-FST-008',
    stock: 5,
    images: img('royal-purple-zari-silk'),
    newArrival: true,
  },
  {
    id: 'sks-009',
    slug: 'indigo-kolam-silk',
    name: 'Indigo Kolam Silk',
    price: 8900,
    category: 'everyday',
    collections: ['everyday'],
    color: 'Indigo',
    colorFamily: 'blue',
    colorHex: '#24356B',
    fabric: 'Silk Cotton',
    description:
      'Kolam lattice-work in silver thread on indigo — a lighter weave for days that call for silk without ceremony.',
    story:
      'Kolam are the looped rice-flour patterns drawn at South Indian thresholds each morning. Rendered small and in silver rather than gold, the motif keeps this saree firmly in the register of everyday wear. Silk cotton means it drapes softly and sits comfortably through a full day.',
    specs: {
      length: '6.3 metres including blouse piece',
      width: '46 inches',
      blouse: '0.8 metre matching blouse piece attached',
      zari: 'Silver-tone zari',
      weight: 'Approx. 480 g',
      weave: 'Silk-cotton handloom',
      care: 'Dry clean recommended. Gentle hand wash acceptable for the first wash.',
    },
    sku: 'SKS-EVD-009',
    stock: 11,
    images: img('indigo-kolam-silk'),
  },
  {
    id: 'sks-010',
    slug: 'saffron-festive-silk',
    name: 'Saffron Festive Silk',
    price: 12500,
    category: 'festive',
    collections: ['festive'],
    color: 'Saffron',
    colorFamily: 'saffron',
    colorHex: '#D98324',
    fabric: 'Pure Mulberry Silk',
    description:
      'Warm saffron against a deep red border — a festival saree with genuine brightness to it.',
    story:
      'Saffron is the colour of the season that runs from Navaratri into Deepavali, and it is unforgiving in cheaper silk. On mulberry silk it holds its warmth under artificial light instead of turning orange. The contrast border keeps the whole thing anchored.',
    specs: {
      length: '6.3 metres including blouse piece',
      width: '47 inches',
      blouse: '0.8 metre contrast blouse piece attached',
      zari: 'Half-fine gold zari',
      weight: 'Approx. 690 g',
      weave: 'Traditional Kanchipuram handloom technique',
      care: 'Dry clean only. Store folded in cotton muslin.',
    },
    sku: 'SKS-FST-010',
    stock: 8,
    images: img('saffron-festive-silk'),
  },
  {
    id: 'sks-011',
    slug: 'rose-quartz-tissue-silk',
    name: 'Rose Quartz Tissue Silk',
    price: 8900,
    category: 'everyday',
    collections: ['everyday', 'new-arrivals'],
    color: 'Rose Quartz',
    colorFamily: 'pink',
    colorHex: '#E8B7BE',
    fabric: 'Tissue Silk',
    description:
      'A pale rose tissue weave with a wine border — light in the hand, with a faint metallic ground that catches the light.',
    story:
      'Tissue silk carries a fine metallic thread through the weft, so the ground has a low sheen rather than a printed shine. At this weight the saree drapes close and pleats easily, which makes it a practical choice for long evenings.',
    specs: {
      length: '6.3 metres including blouse piece',
      width: '46 inches',
      blouse: '0.8 metre contrast blouse piece attached',
      zari: 'Fine gold tissue weft',
      weight: 'Approx. 450 g',
      weave: 'Tissue silk handloom',
      care: 'Dry clean only. Handle gently — tissue weaves snag easily.',
    },
    sku: 'SKS-EVD-011',
    stock: 9,
    images: img('rose-quartz-tissue-silk'),
    newArrival: true,
  },
  {
    id: 'sks-012',
    slug: 'midnight-blue-zari-kanjivaram',
    name: 'Midnight Blue Zari Kanjivaram',
    price: 24900,
    category: 'bridal',
    collections: ['bridal', 'kanchipuram'],
    color: 'Midnight Blue',
    colorFamily: 'blue',
    colorHex: '#16264A',
    fabric: 'Korvai Silk',
    description:
      'Gold mango buttas across a near-black blue, with a heavily worked pallu — an evening saree with unusual depth.',
    story:
      'The ground is pitched dark enough that the gold appears to float rather than sit on the surface. It is a difficult effect to achieve and it depends entirely on the density of the dye. Cut with a korvai border and a full zari pallu.',
    specs: {
      length: '6.5 metres including blouse piece',
      width: '48 inches',
      blouse: '0.9 metre contrast blouse piece attached',
      zari: 'Fine gold zari',
      weight: 'Approx. 940 g',
      weave: 'Korvai — hand-interlocked contrast border',
      care: 'Dry clean only. Store folded in cotton muslin.',
    },
    sku: 'SKS-BRD-012',
    stock: 3,
    images: img('midnight-blue-zari-kanjivaram'),
    featured: true,
  },
  {
    id: 'sks-013',
    slug: 'turmeric-gold-mangalagiri',
    name: 'Turmeric Gold Mangalagiri',
    price: 6500,
    category: 'everyday',
    collections: ['everyday'],
    color: 'Turmeric',
    colorFamily: 'saffron',
    colorHex: '#D9A62E',
    fabric: 'Silk Cotton',
    description:
      'A turmeric silk-cotton weave with a fine gold edge — the most wearable saree in the collection.',
    story:
      'Light, breathable and easy to maintain, this is the weave to reach for when silk needs to be practical. The kolam motif is kept small and the border narrow, so it works as readily for an office day as for a family lunch.',
    specs: {
      length: '6.3 metres including blouse piece',
      width: '46 inches',
      blouse: '0.8 metre matching blouse piece attached',
      zari: 'Fine gold edge',
      weight: 'Approx. 440 g',
      weave: 'Silk-cotton handloom',
      care: 'Gentle hand wash in cold water, or dry clean.',
    },
    sku: 'SKS-EVD-013',
    stock: 14,
    images: img('turmeric-gold-mangalagiri'),
  },
  {
    id: 'sks-014',
    slug: 'olive-korvai-silk',
    name: 'Olive Korvai Silk',
    price: 18500,
    category: 'kanchipuram',
    collections: ['kanchipuram'],
    color: 'Olive',
    colorFamily: 'green',
    colorHex: '#5B6034',
    fabric: 'Korvai Silk',
    description:
      'A muted olive body joined to a wine border by hand — an understated weave for someone who already owns the obvious ones.',
    story:
      'Olive and wine is not a traditional pairing, and that is the point. The rudraksha motif — concentric rings named for the seed used in prayer beads — runs down the border, while the body is left almost bare. A second or third saree rather than a first.',
    specs: {
      length: '6.3 metres including blouse piece',
      width: '48 inches',
      blouse: '0.8 metre contrast blouse piece attached',
      zari: 'Half-fine gold zari',
      weight: 'Approx. 780 g',
      weave: 'Korvai — hand-interlocked contrast border',
      care: 'Dry clean only. Store folded in cotton muslin.',
    },
    sku: 'SKS-KAN-014',
    stock: 4,
    images: img('olive-korvai-silk'),
  },
  {
    id: 'sks-015',
    slug: 'coral-mango-butta-silk',
    name: 'Coral Mango Butta Silk',
    price: 12500,
    category: 'festive',
    collections: ['festive', 'new-arrivals'],
    color: 'Coral',
    colorFamily: 'red',
    colorHex: '#E0644C',
    fabric: 'Pure Mulberry Silk',
    description:
      'Mango buttas in pale gold on a soft coral ground — warm without tipping into red.',
    story:
      'The mango, or paisley, is the most widely travelled motif in Indian textile and one of the oldest. Worked here in a lighter gold so it sits gently on the coral rather than cutting against it.',
    specs: {
      length: '6.3 metres including blouse piece',
      width: '47 inches',
      blouse: '0.8 metre contrast blouse piece attached',
      zari: 'Half-fine gold zari',
      weight: 'Approx. 670 g',
      weave: 'Traditional Kanchipuram handloom technique',
      care: 'Dry clean only. Store folded in cotton muslin.',
    },
    sku: 'SKS-FST-015',
    stock: 7,
    images: img('coral-mango-butta-silk'),
    newArrival: true,
  },
  {
    id: 'sks-016',
    slug: 'pearl-ivory-wedding-silk',
    name: 'Pearl Ivory Wedding Silk',
    price: 32000,
    category: 'bridal',
    collections: ['bridal'],
    color: 'Pearl Ivory',
    colorFamily: 'neutral',
    colorHex: '#F7F1E3',
    fabric: 'Korvai Silk',
    description:
      'A pearl ivory ground with a full antique-gold border — bridal weight, in the lightest possible register.',
    story:
      'An alternative to the red bridal saree, and an increasingly common one. The weight and the pallu are unchanged; only the ground shifts. Peacock plumes are worked in antique gold, which reads warmer against ivory than bright gold would.',
    specs: {
      length: '6.5 metres including blouse piece',
      width: '48 inches',
      blouse: '0.9 metre contrast blouse piece attached',
      zari: 'Fine gold zari, antique finish',
      weight: 'Approx. 950 g',
      weave: 'Korvai — hand-interlocked contrast border',
      care: 'Dry clean only. Store folded in cotton muslin away from light.',
    },
    sku: 'SKS-BRD-016',
    stock: 2,
    images: img('pearl-ivory-wedding-silk'),
    featured: true,
  },
  {
    id: 'sks-017',
    slug: 'deep-teal-rudraksha-silk',
    name: 'Deep Teal Rudraksha Silk',
    price: 15900,
    category: 'kanchipuram',
    collections: ['kanchipuram', 'festive'],
    color: 'Deep Teal',
    colorFamily: 'green',
    colorHex: '#0F4C55',
    fabric: 'Pure Mulberry Silk',
    description:
      'Concentric rudraksha rings in gold on deep teal, with a narrow stepped border.',
    story:
      'The rudraksha motif is drawn from the seed used in prayer beads and appears throughout South Indian weaving, usually along borders. Bringing it onto the body at this scale gives the saree a quiet, repeating rhythm.',
    specs: {
      length: '6.3 metres including blouse piece',
      width: '47 inches',
      blouse: '0.8 metre contrast blouse piece attached',
      zari: 'Half-fine gold zari',
      weight: 'Approx. 710 g',
      weave: 'Traditional Kanchipuram handloom technique',
      care: 'Dry clean only. Store folded in cotton muslin.',
    },
    sku: 'SKS-KAN-017',
    stock: 6,
    images: img('deep-teal-rudraksha-silk'),
  },
  {
    id: 'sks-018',
    slug: 'blush-tissue-organza-drape',
    name: 'Blush Tissue Organza Drape',
    price: 6500,
    category: 'everyday',
    collections: ['everyday', 'new-arrivals'],
    color: 'Blush',
    colorFamily: 'pink',
    colorHex: '#EBC9C4',
    fabric: 'Organza Silk',
    description:
      'A sheer blush organza with a terracotta edge — the lightest weave we carry, and the easiest to wear.',
    story:
      'Organza holds its shape rather than falling close to the body, which gives the drape a soft structure through the pleats. Finished with a narrow terracotta border and small gold diamonds.',
    specs: {
      length: '6.3 metres including blouse piece',
      width: '45 inches',
      blouse: '0.8 metre contrast blouse piece attached',
      zari: 'Fine gold edge',
      weight: 'Approx. 380 g',
      weave: 'Organza silk',
      care: 'Dry clean only. Steam rather than iron directly.',
    },
    sku: 'SKS-EVD-018',
    stock: 10,
    images: img('blush-tissue-organza-drape'),
    newArrival: true,
  },
  {
    id: 'sks-019',
    slug: 'sandalwood-beige-silk-cotton',
    name: 'Sandalwood Beige Silk Cotton',
    price: 6500,
    category: 'everyday',
    collections: ['everyday'],
    color: 'Sandalwood',
    colorFamily: 'neutral',
    colorHex: '#D9C6A5',
    fabric: 'Silk Cotton',
    description:
      'A warm sandalwood neutral with a terracotta border — quiet, durable, and easy to return to.',
    story:
      'Neutrals are underrepresented in South Indian silk and disproportionately useful. This one pairs with almost any blouse, takes a kolam motif in deep gold, and is light enough to wear through a working day.',
    specs: {
      length: '6.3 metres including blouse piece',
      width: '46 inches',
      blouse: '0.8 metre contrast blouse piece attached',
      zari: 'Antique gold edge',
      weight: 'Approx. 460 g',
      weave: 'Silk-cotton handloom',
      care: 'Gentle hand wash in cold water, or dry clean.',
    },
    sku: 'SKS-EVD-019',
    stock: 12,
    images: img('sandalwood-beige-silk-cotton'),
  },
  {
    id: 'sks-020',
    slug: 'wine-heritage-korvai-silk',
    name: 'Wine Heritage Korvai Silk',
    price: 24900,
    category: 'bridal',
    collections: ['bridal', 'kanchipuram'],
    color: 'Wine',
    colorFamily: 'maroon',
    colorHex: '#58192C',
    fabric: 'Korvai Silk',
    description:
      'The house colour, worked as a full korvai weave with peacock plumes in antique gold.',
    story:
      'If Sri Kanchi Silks had a single saree to stand for the rest, this would be it — a deep wine ground, a near-black border joined by hand, and a pallu closed with a run of peacock plumes. Traditional in every particular, and cut without excess.',
    specs: {
      length: '6.5 metres including blouse piece',
      width: '48 inches',
      blouse: '0.9 metre contrast blouse piece attached',
      zari: 'Fine gold zari, antique finish',
      weight: 'Approx. 900 g',
      weave: 'Korvai — hand-interlocked contrast border',
      care: 'Dry clean only. Store folded in cotton muslin.',
    },
    sku: 'SKS-BRD-020',
    stock: 3,
    images: img('wine-heritage-korvai-silk'),
    featured: true,
  },
];

/* --- Derived lookups ------------------------------------------------------ */

export const getProductBySlug = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);

export const getProductById = (id: string): Product | undefined =>
  products.find((p) => p.id === id);

export const featuredProducts = (): Product[] => products.filter((p) => p.featured);

export const newArrivals = (): Product[] => products.filter((p) => p.newArrival);

export const productsInCollection = (slug: string): Product[] =>
  slug === 'all' ? products : products.filter((p) => p.collections.includes(slug));

/**
 * Products that share a category with the given one, excluding itself.
 * Falls back to featured items so the rail is never empty.
 */
export const relatedProducts = (product: Product, limit = 4): Product[] => {
  const sameCategory = products.filter(
    (p) => p.id !== product.id && p.category === product.category,
  );
  const fill = products.filter(
    (p) => p.id !== product.id && p.category !== product.category && p.featured,
  );
  return [...sameCategory, ...fill].slice(0, limit);
};
