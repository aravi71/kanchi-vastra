/* ===========================================================================
   SITE + BUSINESS CONFIGURATION
   ---------------------------------------------------------------------------
   Everything marked `PLACEHOLDER` below is invented scaffolding, not real
   Kanchi Vastra information. Replace each value with the genuine detail
   before the site goes live, and delete the `isPlaceholder` flags as you go —
   the UI reads those flags to decide whether to show a "details to follow"
   state instead of a fake phone number or address.
   =========================================================================== */

export const site = {
  name: 'Kanchi Vastra',
  shortName: 'Kanchi Vastra',
  /** Used for canonical URLs, sitemap and Open Graph. Set NEXT_PUBLIC_SITE_URL in production. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  tagline: 'The Art of Timeless Silk',
  description:
    'Discover timeless Indian silk sarees inspired by the artistry and elegance of South India.',
  /** Brand positioning line used across the site. */
  positioning: 'Where South Indian heritage meets contemporary elegance.',
} as const;

/**
 * Contact details. Every field here is a placeholder and is rendered by the
 * UI as such until `isPlaceholder` is set to false.
 */
export const contact = {
  isPlaceholder: true,
  phone: '+91 00000 00000',
  whatsapp: '+91 00000 00000',
  email: 'hello@example.com',
  /** Store address — not a real location. */
  address: {
    line1: 'Store address to be confirmed',
    line2: '',
    city: 'City',
    state: 'Tamil Nadu',
    pincode: '000000',
    country: 'India',
  },
  hours: [
    { days: 'Monday – Saturday', time: 'Hours to be confirmed' },
    { days: 'Sunday', time: 'Hours to be confirmed' },
  ],
  social: {
    instagram: '', // e.g. https://instagram.com/<handle>
    facebook: '',
    youtube: '',
  },
} as const;

/**
 * Trust signals. Deliberately limited to statements the business can actually
 * stand behind. Do not add customer counts, awards, certifications or
 * rankings here unless they are documented and true.
 */
export const trustPoints = [
  {
    title: 'Premium Silk Collection',
    body: 'A focused edit of silk sarees, each one selected for the quality of its weave.',
    icon: 'sparkles',
  },
  {
    title: 'Quality Checked',
    body: 'Every saree is inspected for weave, finish and zari before it is dispatched.',
    icon: 'badge-check',
  },
  {
    title: 'Secure Shopping',
    body: 'Checkout runs over HTTPS. Payment details are never stored on our servers.',
    icon: 'shield',
  },
  {
    title: 'Pan-India Delivery',
    body: 'We ship across India, with tracking provided on every order.',
    icon: 'truck',
  },
  {
    title: 'Customer Support',
    body: 'Questions about a weave, a size or an order — reach us directly.',
    icon: 'headset',
  },
] as const;

/** Primary navigation. Order here is the order shown in the header. */
export const navigation = [
  { label: 'Home', href: '/' },
  { label: 'Sarees', href: '/shop' },
  { label: 'Kanchipuram Silks', href: '/collections/kanchipuram' },
  { label: 'New Arrivals', href: '/collections/new-arrivals' },
  { label: 'Collections', href: '/collections' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

export const footerNav = {
  shop: [
    { label: 'All Sarees', href: '/shop' },
    { label: 'Kanchipuram Silks', href: '/collections/kanchipuram' },
    { label: 'Bridal', href: '/collections/bridal' },
    { label: 'Festive', href: '/collections/festive' },
    { label: 'New Arrivals', href: '/collections/new-arrivals' },
  ],
  about: [
    { label: 'Our Story', href: '/about' },
    { label: 'Craftsmanship', href: '/about#craftsmanship' },
    { label: 'Contact', href: '/contact' },
  ],
  help: [
    { label: 'Shipping', href: '/legal/shipping' },
    { label: 'Returns', href: '/legal/returns' },
    { label: 'FAQs', href: '/faq' },
    { label: 'Care Guide', href: '/care-guide' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/legal/privacy' },
    { label: 'Terms', href: '/legal/terms' },
    { label: 'Shipping Policy', href: '/legal/shipping' },
    { label: 'Returns Policy', href: '/legal/returns' },
  ],
} as const;

/** Shipping thresholds used by the cart. DEMO VALUES. */
export const shipping = {
  freeAbove: 15000,
  flatRate: 250,
  estimate: '5 – 7 business days',
} as const;
