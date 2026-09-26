import { defineField, defineType } from 'sanity';

/**
 * Shop details the owner should be able to change without a developer:
 * phone number, WhatsApp, Instagram, shipping thresholds.
 *
 * A singleton — there is only ever one of these documents.
 */
export default defineType({
  name: 'siteSettings',
  title: 'Shop Settings',
  type: 'document',

  groups: [
    { name: 'contact', title: 'Contact details', default: true },
    { name: 'shipping', title: 'Shipping' },
    { name: 'social', title: 'Social' },
  ],

  fields: [
    defineField({
      name: 'contactPublished',
      title: 'My contact details are real — show them on the site',
      type: 'boolean',
      group: 'contact',
      initialValue: false,
      description:
        'Leave OFF until every field below is genuine. While it is off, the site honestly shows "To be confirmed" instead of a placeholder phone number.',
    }),
    defineField({ name: 'phone', title: 'Phone', type: 'string', group: 'contact' }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp number',
      type: 'string',
      group: 'contact',
      description: 'With country code, e.g. +91 98765 43210. Turns on the WhatsApp button.',
    }),
    defineField({ name: 'email', title: 'Email', type: 'string', group: 'contact' }),
    defineField({
      name: 'address',
      title: 'Store address',
      type: 'object',
      group: 'contact',
      fields: [
        { name: 'line1', title: 'Address', type: 'string' },
        { name: 'city', title: 'City', type: 'string' },
        { name: 'state', title: 'State', type: 'string' },
        { name: 'pincode', title: 'PIN code', type: 'string' },
      ],
    }),
    defineField({
      name: 'hours',
      title: 'Opening hours',
      type: 'array',
      group: 'contact',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'days', title: 'Days', type: 'string' },
            { name: 'time', title: 'Hours', type: 'string' },
          ],
          preview: { select: { title: 'days', subtitle: 'time' } },
        },
      ],
    }),

    defineField({
      name: 'freeShippingAbove',
      title: 'Free shipping above (₹)',
      type: 'number',
      group: 'shipping',
      initialValue: 15000,
      description: 'Set to 0 if you never offer free shipping.',
    }),
    defineField({
      name: 'shippingFlatRate',
      title: 'Shipping charge below that (₹)',
      type: 'number',
      group: 'shipping',
      initialValue: 250,
    }),
    defineField({
      name: 'deliveryEstimate',
      title: 'Delivery estimate',
      type: 'string',
      group: 'shipping',
      initialValue: '5 – 7 business days',
    }),

    defineField({
      name: 'instagram',
      title: 'Instagram URL',
      type: 'url',
      group: 'social',
      description: 'Full link, e.g. https://instagram.com/yourhandle. Leave empty to hide it.',
    }),
  ],

  preview: {
    prepare: () => ({ title: 'Shop Settings' }),
  },
});
