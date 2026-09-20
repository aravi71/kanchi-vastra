import { defineField, defineType } from 'sanity';

/**
 * A saree, as it appears in the admin.
 *
 * Field order, grouping and help text all matter here — this is the screen the
 * shop owner actually uses, not a database table. The things changed most
 * often (price, stock) sit in the first group so they are one tap away.
 */
export default defineType({
  name: 'product',
  title: 'Saree',
  type: 'document',

  groups: [
    { name: 'essentials', title: 'Price & Stock', default: true },
    { name: 'photos', title: 'Photos' },
    { name: 'details', title: 'Description' },
    { name: 'specs', title: 'Measurements' },
    { name: 'visibility', title: 'Where it appears' },
  ],

  fields: [
    /* --- essentials ---------------------------------------------------- */
    defineField({
      name: 'name',
      title: 'Saree name',
      type: 'string',
      group: 'essentials',
      description: 'What customers see. e.g. "Kanchipuram Ruby Zari Silk Saree"',
      validation: (r) => r.required().min(3).max(90),
    }),
    defineField({
      name: 'price',
      title: 'Price (₹)',
      type: 'number',
      group: 'essentials',
      description: 'Just the number — 18500, not ₹18,500. The site adds the symbol and commas.',
      validation: (r) => r.required().positive().integer(),
    }),
    defineField({
      name: 'stock',
      title: 'How many do you have?',
      type: 'number',
      group: 'essentials',
      initialValue: 1,
      description:
        '0 shows "Sold out" and stops anyone buying it. 1 or 2 shows an "Only N remaining" badge.',
      validation: (r) => r.required().min(0).integer(),
    }),
    defineField({
      name: 'sku',
      title: 'Your stock code (SKU)',
      type: 'string',
      group: 'essentials',
      description: 'Your own reference, e.g. KV-KAN-001. Must be different for every saree.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'compareAtPrice',
      title: 'Was-price (optional)',
      type: 'number',
      group: 'essentials',
      description:
        'Shows struck through next to the price. Leave empty unless it genuinely sold at this price before — a fake "was" price is misleading and illegal in many places.',
      validation: (r) =>
        r.positive().integer().custom((value, ctx) => {
          const price = (ctx.document as { price?: number } | undefined)?.price;
          if (value && price && value <= price) {
            return 'The was-price must be higher than the current price, or left empty.';
          }
          return true;
        }),
    }),
    defineField({
      name: 'slug',
      title: 'Web address',
      type: 'slug',
      group: 'essentials',
      description:
        'Generated from the name — press Generate. Do NOT change it after the saree is published: it would break every link anyone has shared.',
      options: {
        source: 'name',
        maxLength: 80,
        slugify: (input) =>
          input.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80),
      },
      validation: (r) => r.required(),
    }),

    /* --- photos --------------------------------------------------------- */
    defineField({
      name: 'images',
      title: 'Photos',
      type: 'array',
      group: 'photos',
      description:
        'Four photos works best: the full saree, the border, the pallu, and a close-up of the weave. The FIRST one is the main picture. Shoot them portrait (taller than wide).',
      of: [
        {
          type: 'image',
          // hotspot lets the owner choose what stays visible when the site
          // crops a photo to 3:4 — without it, faces and borders get cut off.
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Describe this photo',
              type: 'string',
              description:
                'For blind visitors and for Google. e.g. "Ruby red silk saree with gold temple border"',
            },
          ],
        },
      ],
      validation: (r) => r.min(1).error('Add at least one photo.'),
    }),

    /* --- description ---------------------------------------------------- */
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'text',
      rows: 3,
      group: 'details',
      description: 'One or two lines. Shown on the shop grid and in search results.',
      validation: (r) => r.required().max(300),
    }),
    defineField({
      name: 'story',
      title: 'Longer description',
      type: 'text',
      rows: 6,
      group: 'details',
      description: 'A paragraph shown lower down the saree page. Optional but worth writing.',
    }),
    defineField({
      name: 'color',
      title: 'Colour name',
      type: 'string',
      group: 'details',
      description: 'As you would say it to a customer. e.g. "Ruby Red"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'colorHex',
      title: 'Colour swatch',
      type: 'string',
      group: 'details',
      description: 'The little colour dot on the page. A 6-digit code like #9B1B30.',
      validation: (r) =>
        r.required().regex(/^#[0-9a-fA-F]{6}$/, { name: 'colour code (e.g. #9B1B30)' }),
    }),
    defineField({
      name: 'colorFamily',
      title: 'Colour filter group',
      type: 'string',
      group: 'details',
      description: 'Which colour a customer would tick to find this saree.',
      options: {
        list: [
          { title: 'Red & Coral', value: 'red' },
          { title: 'Maroon & Wine', value: 'maroon' },
          { title: 'Gold & Ivory', value: 'gold' },
          { title: 'Green & Teal', value: 'green' },
          { title: 'Blue & Indigo', value: 'blue' },
          { title: 'Purple', value: 'purple' },
          { title: 'Pink & Blush', value: 'pink' },
          { title: 'Saffron & Turmeric', value: 'saffron' },
          { title: 'Neutral', value: 'neutral' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'fabric',
      title: 'Fabric',
      type: 'string',
      group: 'details',
      options: {
        list: [
          'Pure Mulberry Silk',
          'Korvai Silk',
          'Tissue Silk',
          'Silk Cotton',
          'Organza Silk',
        ],
      },
      validation: (r) => r.required(),
    }),

    /* --- measurements ---------------------------------------------------- */
    defineField({
      name: 'specs',
      title: 'Measurements and care',
      type: 'object',
      group: 'specs',
      options: { collapsible: true, collapsed: false },
      fields: [
        { name: 'length', title: 'Length', type: 'string', initialValue: '6.3 metres including blouse piece' },
        { name: 'width', title: 'Width', type: 'string', initialValue: '47 inches' },
        { name: 'blouse', title: 'Blouse piece', type: 'string', initialValue: '0.8 metre blouse piece attached' },
        { name: 'zari', title: 'Zari', type: 'string', initialValue: 'Half-fine gold zari' },
        { name: 'weight', title: 'Weight', type: 'string', initialValue: 'Approx. 700 g' },
        { name: 'weave', title: 'Weave', type: 'string', initialValue: 'Traditional Kanchipuram handloom technique' },
        { name: 'care', title: 'Care', type: 'text', rows: 2, initialValue: 'Dry clean only. Store folded in cotton muslin.' },
      ],
    }),

    /* --- visibility ------------------------------------------------------ */
    defineField({
      name: 'category',
      title: 'Main collection',
      type: 'string',
      group: 'visibility',
      options: {
        list: [
          { title: 'Kanchipuram Silks', value: 'kanchipuram' },
          { title: 'Bridal Silks', value: 'bridal' },
          { title: 'Festive', value: 'festive' },
          { title: 'Everyday Elegance', value: 'everyday' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'collections',
      title: 'Also show in',
      type: 'array',
      group: 'visibility',
      description: 'A saree can appear in more than one collection.',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Kanchipuram Silks', value: 'kanchipuram' },
          { title: 'Bridal Silks', value: 'bridal' },
          { title: 'Festive', value: 'festive' },
          { title: 'Everyday Elegance', value: 'everyday' },
          { title: 'New Arrivals', value: 'new-arrivals' },
        ],
      },
    }),
    defineField({
      name: 'featured',
      title: 'Show on the homepage',
      type: 'boolean',
      group: 'visibility',
      initialValue: false,
    }),
    defineField({
      name: 'newArrival',
      title: 'Mark as "New"',
      type: 'boolean',
      group: 'visibility',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Sort position',
      type: 'number',
      group: 'visibility',
      description: 'Lower numbers appear first. Leave empty to sort automatically.',
    }),
  ],

  /* The row you see in the list of sarees — photo, name, and live stock. */
  preview: {
    select: { title: 'name', media: 'images.0', price: 'price', stock: 'stock', color: 'color' },
    prepare({ title, media, price, stock, color }) {
      const rupees = typeof price === 'number' ? `₹${price.toLocaleString('en-IN')}` : 'no price';
      const level = stock === 0 ? 'SOLD OUT' : `${stock} in stock`;
      return { title, media, subtitle: `${rupees} · ${level}${color ? ` · ${color}` : ''}` };
    },
  },

  orderings: [
    { title: 'Sort position', name: 'order', by: [{ field: 'order', direction: 'asc' }] },
    { title: 'Price, low to high', name: 'priceAsc', by: [{ field: 'price', direction: 'asc' }] },
    { title: 'Price, high to low', name: 'priceDesc', by: [{ field: 'price', direction: 'desc' }] },
    { title: 'Running out first', name: 'stockAsc', by: [{ field: 'stock', direction: 'asc' }] },
    { title: 'Name A–Z', name: 'nameAsc', by: [{ field: 'name', direction: 'asc' }] },
  ],
});
